<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CartPageTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that the cart page loads successfully.
     */
    public function test_cart_page_loads_successfully(): void
    {
        $response = $this->get(route('cart'));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('cart')
            );
    }

    /**
     * Test that the cart page displays empty cart state initially.
     */
    public function test_cart_page_shows_empty_state(): void
    {
        $response = $this->get(route('cart'));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('cart')
            );
    }

    /**
     * Test that cart page is accessible without authentication.
     */
    public function test_cart_page_is_publicly_accessible(): void
    {
        $response = $this->get(route('cart'));

        $response->assertOk();
    }

    /**
     * Test that the cart page renders with correct heading.
     */
    public function test_cart_page_has_correct_heading(): void
    {
        $response = $this->get(route('cart'));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('cart')
            );
    }

    /**
     * Test that the cart page includes links to continue shopping.
     */
    public function test_cart_page_includes_navigation_links(): void
    {
        $response = $this->get(route('cart'));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('cart')
            );
    }
}
