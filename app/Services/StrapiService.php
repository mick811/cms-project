<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Service class for interacting with the Strapi CMS API.
 * Handles all product, format, and genre data fetching.
 */
class StrapiService
{
    protected string $baseUrl;

    protected ?string $token;

    protected bool $isAvailable = true;

    public function __construct()
    {
        // remove trailing slash to avoid double slashes in urls
        $this->baseUrl = rtrim(config('strapi.url'), '/');
        $this->token = config('strapi.token');
    }

    /**
     * Check if Strapi is available.
     */
    public function isAvailable(): bool
    {
        return $this->isAvailable;
    }

    /**
     * Fetch multiple things from Strapi at once.
     *
     * Example:
     * $strapi->getAll([
     *     'hero' => ['with' => 'image', 'first' => true],
     *     'products' => ['with' => 'images', 'limit' => 4],
     * ]);
     *
     * @param  array<string, array{for?: string, with?: string|array<string>, limit?: int, first?: bool}>  $queries
     * @return array<string, mixed>
     */
    public function getAll(array $queries): array
    {
        // using a collection instead of foreach for cleaner code,
        // built-in helpers and automatic array building
        return collect($queries)->map(function (array $config, string $key): mixed {
            // build params for strapi and remove any null values
            // 'populate' loads related data like images, 'limit' controls count
            $params = array_filter([
                'populate' => $config['with'] ?? null,
                'pagination[limit]' => $config['limit'] ?? null,
            ]);

            try {
                // call strapi api - uses 'for' if set, otherwise uses the array key
                $data = $this->request('get', '/api/'.($config['for'] ?? $key), $params)->json('data');

                // if first is true, return the single item, else return array
                // ?? [] ensures we return an empty array instead of null when no data
                return ($config['first'] ?? false) ? $data : ($data ?? []);
            } catch (ConnectionException $e) {
                Log::warning('strapi connection failed', ['key' => $key, 'error' => $e->getMessage()]);
                $this->isAvailable = false;

                return ($config['first'] ?? false) ? null : [];
            }
        })->all();
    }

    /**
     * Get products from Strapi with optional filtering.
     *
     * Strapi uses a specific query syntax for filtering:
     * - filters[field][$containsi] = case-insensitive contains
     * - filters[field][$eq] = exact match
     * - filters[field][$gte] = greater than or equal
     * - filters[field][$lte] = less than or equal
     *
     * @param  array{query?: string, format?: int, genre?: int, minPrice?: float, maxPrice?: float}  $filters
     * @return array<int, mixed>
     */
    public function getProducts(array $filters = []): array
    {
        // always load related images, format and genre data
        $params = [
            'populate' => ['images', 'format', 'genre'],
        ];

        // text search - $containsi means case-insensitive contains
        if (! empty($filters['query'])) {
            $params['filters[title][$containsi]'] = $filters['query'];
        }

        // filter by format relation (matching the format's id)
        if (! empty($filters['format'])) {
            $params['filters[format][id][$eq]'] = $filters['format'];
        }

        // filter by genre relation
        if (! empty($filters['genre'])) {
            $params['filters[genre][id][$eq]'] = $filters['genre'];
        }

        // price range filters
        // using isset() instead of empty() because 0 is a valid price
        if (isset($filters['minPrice'])) {
            $params['filters[price][$gte]'] = $filters['minPrice'];
        }

        if (isset($filters['maxPrice'])) {
            $params['filters[price][$lte]'] = $filters['maxPrice'];
        }

        try {
            $data = $this->request('get', '/api/products', $params)->json('data');

            return $data ?? [];
        } catch (ConnectionException $e) {
            Log::warning('strapi connection failed fetching products', ['error' => $e->getMessage()]);
            $this->isAvailable = false;

            return [];
        }
    }

    /**
     * Get all available formats (vinyl, cd, cassette, etc).
     *
     * @return array<int, mixed>
     */
    public function getFormats(): array
    {
        try {
            $data = $this->request('get', '/api/formats')->json('data');

            return $data ?? [];
        } catch (ConnectionException $e) {
            Log::warning('strapi connection failed fetching formats', ['error' => $e->getMessage()]);
            $this->isAvailable = false;

            return [];
        }
    }

    /**
     * Get all available genres (rock, jazz, electronic, etc).
     *
     * @return array<int, mixed>
     */
    public function getGenres(): array
    {
        try {
            $data = $this->request('get', '/api/genres')->json('data');

            return $data ?? [];
        } catch (ConnectionException $e) {
            Log::warning('strapi connection failed fetching genres', ['error' => $e->getMessage()]);
            $this->isAvailable = false;

            return [];
        }
    }

    /**
     * Get the min and max price across all products.
     * Used to set the bounds for the price filter slider.
     *
     * @return array{min: float, max: float}
     */
    public function getPriceRange(): array
    {
        // only fetch price field to keep response small
        // limit 1000 should cover most catalogs
        $params = [
            'fields' => ['price'],
            'pagination[limit]' => 1000,
        ];

        try {
            $data = $this->request('get', '/api/products', $params)->json('data') ?? [];
        } catch (ConnectionException $e) {
            Log::warning('strapi connection failed fetching price range', ['error' => $e->getMessage()]);
            $this->isAvailable = false;

            return ['min' => 0, 'max' => 1000];
        }

        // extract just the price values into a flat array
        $prices = array_column($data, 'price');

        // fallback if no products exist yet
        if (empty($prices)) {
            return ['min' => 0, 'max' => 1000];
        }

        return [
            'min' => (float) min($prices),
            'max' => (float) max($prices),
        ];
    }

    /**
     * Get product suggestions for search autocomplete.
     * Returns a limited set of products matching the query.
     *
     * @return array<int, mixed>
     */
    public function getProductSuggestions(string $query, int $limit = 6): array
    {
        $params = [
            'pagination[limit]' => $limit,
            'filters[title][$containsi]' => $query,
        ];

        try {
            $data = $this->request('get', '/api/products', $params)->json('data');

            return $data ?? [];
        } catch (ConnectionException $e) {
            Log::warning('strapi connection failed fetching suggestions', ['error' => $e->getMessage()]);
            $this->isAvailable = false;

            return [];
        }
    }

    /**
     * Get a single product by its slug.
     *
     * @return array<string, mixed>|null
     */
    public function getProduct(string $slug): ?array
    {
        $params = [
            'populate' => ['images', 'format', 'genre'],
            'filters[slug][$eq]' => $slug,
        ];

        try {
            $data = $this->request('get', '/api/products', $params)->json('data');

            return (! empty($data)) ? $data[0] : null;
        } catch (ConnectionException $e) {
            Log::warning('strapi connection failed fetching product', ['slug' => $slug, 'error' => $e->getMessage()]);
            $this->isAvailable = false;

            return null;
        }
    }

    /**
     * Make an HTTP request to Strapi.
     *
     * Handles authentication if a token is configured.
     * Uses Laravel's HTTP client which wraps Guzzle.
     *
     * @param  array<string, mixed>  $data
     *
     * @throws ConnectionException
     */
    protected function request(string $method, string $path, array $data = []): Response
    {
        $url = $this->baseUrl.$path;

        // start building the request, always expect json back
        $request = Http::acceptJson()->timeout(10);

        // add bearer token auth if configured
        if ($this->token) {
            $request->withToken($this->token);
        }

        // dynamically call get/post/put/delete based on $method
        return $request->{$method}($url, $data);
    }
}
