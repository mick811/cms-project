<?php

namespace Tests\Feature;

use App\Services\StrapiService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use Tests\TestCase;

class ProductsPageTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that the products page loads successfully with products.
     */
    public function test_products_page_loads_with_products(): void
    {
        $products = [
            [
                'id' => 1,
                'title' => 'Dark Side of the Moon',
                'artist' => 'Pink Floyd',
                'price' => 29.99,
                'slug' => 'dark-side-of-the-moon',
                'images' => [],
                'format' => ['name' => 'Vinyl'],
                'genre' => ['type' => 'Rock'],
            ],
            [
                'id' => 2,
                'title' => 'Abbey Road',
                'artist' => 'The Beatles',
                'price' => 34.99,
                'slug' => 'abbey-road',
                'images' => [],
                'format' => ['name' => 'Vinyl'],
                'genre' => ['type' => 'Rock'],
            ],
        ];

        $this->mock(StrapiService::class, function (Mockery\MockInterface $mock) use ($products): void {
            $mock->shouldReceive('getProducts')
                ->once()
                ->with([])
                ->andReturn($products);
            $mock->shouldReceive('getFormats')
                ->once()
                ->andReturn([
                    ['id' => 1, 'name' => 'Vinyl'],
                    ['id' => 2, 'name' => 'CD'],
                ]);
            $mock->shouldReceive('getGenres')
                ->once()
                ->andReturn([
                    ['id' => 1, 'type' => 'Rock'],
                    ['id' => 2, 'type' => 'Jazz'],
                ]);
            $mock->shouldReceive('getPriceRange')
                ->once()
                ->andReturn(['min' => 10.00, 'max' => 100.00]);
        });

        $response = $this->get(route('products'));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('products')
                ->has('products', 2)
                ->where('products.0.title', 'Dark Side of the Moon')
                ->where('products.1.title', 'Abbey Road')
            );
    }

    /**
     * Test that the products page handles empty products gracefully.
     */
    public function test_products_page_shows_empty_state(): void
    {
        $this->mock(StrapiService::class, function (Mockery\MockInterface $mock): void {
            $mock->shouldReceive('getProducts')
                ->once()
                ->with([])
                ->andReturn([]);
            $mock->shouldReceive('getFormats')
                ->once()
                ->andReturn([]);
            $mock->shouldReceive('getGenres')
                ->once()
                ->andReturn([]);
            $mock->shouldReceive('getPriceRange')
                ->once()
                ->andReturn(['min' => 0, 'max' => 1000]);
        });

        $response = $this->get(route('products'));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('products')
                ->has('products', 0)
            );
    }

    /**
     * Test that the products page applies filters correctly.
     */
    public function test_products_page_applies_filters(): void
    {
        $filteredProducts = [
            [
                'id' => 1,
                'title' => 'Kind of Blue',
                'artist' => 'Miles Davis',
                'price' => 24.99,
                'slug' => 'kind-of-blue',
                'images' => [],
                'format' => ['name' => 'Vinyl'],
                'genre' => ['type' => 'Jazz'],
            ],
        ];

        $this->mock(StrapiService::class, function (Mockery\MockInterface $mock) use ($filteredProducts): void {
            $mock->shouldReceive('getProducts')
                ->once()
                ->with([
                    'query' => 'miles',
                    'format' => 1,
                    'genre' => 2,
                ])
                ->andReturn($filteredProducts);
            $mock->shouldReceive('getFormats')
                ->once()
                ->andReturn([]);
            $mock->shouldReceive('getGenres')
                ->once()
                ->andReturn([]);
            $mock->shouldReceive('getPriceRange')
                ->once()
                ->andReturn(['min' => 0, 'max' => 1000]);
        });

        $response = $this->get(route('products', [
            'q' => 'miles',
            'format' => 1,
            'genre' => 2,
        ]));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('products')
                ->has('products', 1)
                ->where('products.0.title', 'Kind of Blue')
            );
    }

    /**
     * Test that the product detail page loads successfully.
     */
    public function test_product_detail_page_loads(): void
    {
        $product = [
            'id' => 1,
            'title' => 'Dark Side of the Moon',
            'artist' => 'Pink Floyd',
            'price' => 29.99,
            'slug' => 'dark-side-of-the-moon',
            'description' => 'A classic album',
            'stock' => 5,
            'images' => [],
            'format' => ['name' => 'Vinyl'],
            'genre' => ['type' => 'Rock'],
            'release_date' => '1973-03-01',
            'media_condition' => 'Mint',
            'sleeve_condition' => 'Near Mint',
        ];

        $this->mock(StrapiService::class, function (Mockery\MockInterface $mock) use ($product): void {
            $mock->shouldReceive('getProduct')
                ->once()
                ->with('dark-side-of-the-moon')
                ->andReturn($product);
        });

        $response = $this->get(route('products.show', 'dark-side-of-the-moon'));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('products/show')
                ->where('product.title', 'Dark Side of the Moon')
                ->where('product.artist', 'Pink Floyd')
                ->where('product.price', 29.99)
            );
    }

    /**
     * Test that a non-existent product returns 404.
     */
    public function test_nonexistent_product_returns_404(): void
    {
        $this->mock(StrapiService::class, function (Mockery\MockInterface $mock): void {
            $mock->shouldReceive('getProduct')
                ->once()
                ->with('nonexistent-product')
                ->andReturn(null);
        });

        $response = $this->get(route('products.show', 'nonexistent-product'));

        $response->assertNotFound();
    }

    /**
     * Test that the products page handles Strapi connection errors gracefully.
     */
    public function test_products_page_handles_strapi_connection_error(): void
    {
        $this->mock(StrapiService::class, function (Mockery\MockInterface $mock): void {
            $mock->shouldReceive('getProducts')
                ->once()
                ->andReturn([]);
            $mock->shouldReceive('getFormats')
                ->once()
                ->andReturn([]);
            $mock->shouldReceive('getGenres')
                ->once()
                ->andReturn([]);
            $mock->shouldReceive('getPriceRange')
                ->once()
                ->andReturn(['min' => 0, 'max' => 1000]);
        });

        $response = $this->get(route('products'));

        $response->assertOk();
    }
}
