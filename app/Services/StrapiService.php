<?php

namespace App\Services;

use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;

class StrapiService
{
    protected string $baseUrl;

    protected ?string $token;

    public function __construct()
    {
        $this->baseUrl = rtrim(config('strapi.url'), '/');
        $this->token = config('strapi.token');
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

            // call strapi api - uses 'for' if set, otherwise uses the array key
            $data = $this->request('get', '/api/'.($config['for'] ?? $key), $params)->json('data');

            // if first is true, return the single item, else return array
            // ?? [] ensures we return an empty array instead of null when no data
            return ($config['first'] ?? false) ? $data : ($data ?? []);
        })->all();
    }

    /**
     * @return array<int, mixed>
     */
    public function getProducts(?string $query = null): array
    {
        $params = [
            'populate' => ['images', 'format'],
        ];

        if ($query) {
            $params['filters[Title][$containsi]'] = $query;
        }

        $data = $this->request('get', '/api/products', $params)->json('data');

        return $data ?? [];
    }

    /**
     * @return array<int, mixed>
     */
    public function getProductSuggestions(string $query, int $limit = 6): array
    {
        $params = [
            'pagination[limit]' => $limit,
            'filters[Title][$containsi]' => $query,
        ];

        $data = $this->request('get', '/api/products', $params)->json('data');

        return $data ?? [];
    }

    /**
     * Make HTTP request to Strapi.
     *
     * @param  array<string, mixed>  $data
     */
    protected function request(string $method, string $path, array $data = []): Response
    {
        $url = $this->baseUrl.$path;
        $request = Http::acceptJson();

        if ($this->token) {
            $request->withToken($this->token);
        }

        return $request->{$method}($url, $data);
    }
}
