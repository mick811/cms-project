<?php

namespace Tests\Feature;

use App\Services\StrapiService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use Tests\TestCase;

class StrapiHeroTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->mock(StrapiService::class, function (Mockery\MockInterface $mock) {
            $mock->shouldReceive('getAll')
                ->once()
                ->andReturn([
                    'hero' => ['title' => 'Test Hero', 'image' => null],
                    'products' => [],
                ]);
        });
    }

    /**
     * Test that the home page returns a successful response.
     */
    public function test_returns_a_successful_response(): void
    {
        $response = $this->get(route('home'));

        $response->assertOk();
    }
}
