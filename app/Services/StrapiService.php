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
     * Get entries for a specific content type.
     *
     * @param  array<string, mixed>  $params
     */
    public function collection(string $contentType, array $params = []): Response
    {
        return $this->request('get', "/api/{$contentType}", $params);
    }

    /**
     * Get a single entry by ID.
     *
     * @param  array<string, mixed>  $params
     */
    public function entry(string $contentType, int|string $id, array $params = []): Response
    {
        return $this->request('get', "/api/{$contentType}/{$id}", $params);
    }

    /**
     * Handle the HTTP request to Strapi.
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
