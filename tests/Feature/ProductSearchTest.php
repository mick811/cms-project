<?php

namespace Tests\Feature;

use App\Services\StrapiService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use Tests\TestCase;

class ProductSearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_products_page_returns_successful_response(): void
    {
        $this->mock(StrapiService::class, function (Mockery\MockInterface $mock): void {
            $mock->shouldReceive('getProducts')
                ->once()
                ->with(null)
                ->andReturn([]);
        });

        $response = $this->get(route('products'));

        $response->assertOk();
    }

    public function test_products_page_accepts_query_filter(): void
    {
        $this->mock(StrapiService::class, function (Mockery\MockInterface $mock): void {
            $mock->shouldReceive('getProducts')
                ->once()
                ->with('jazz')
                ->andReturn([]);
        });

        $response = $this->get(route('products', ['q' => 'jazz']));

        $response->assertOk();
    }
}
