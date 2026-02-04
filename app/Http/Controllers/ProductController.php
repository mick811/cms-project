<?php

namespace App\Http\Controllers;

use App\Services\StrapiService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Handles product listing and detail pages.
 */
class ProductController extends Controller
{
    /**
     * Display the products page with filtering.
     *
     * Reads filter params from the url query string and passes them
     * to strapi. also fetches formats/genres for the filter dropdowns
     * and price range for the slider bounds.
     */
    public function index(Request $request, StrapiService $strapi): Response
    {
        // build filters array from query params
        // each filter is cast to the right type or set to null if empty
        $filters = [
            'query' => trim((string) $request->input('q', '')) ?: null,
            'format' => $request->input('format') ? (int) $request->input('format') : null,
            'genre' => $request->input('genre') ? (int) $request->input('genre') : null,
            // using has() for price because 0 is a valid value
            'minPrice' => $request->has('minPrice') ? (float) $request->input('minPrice') : null,
            'maxPrice' => $request->has('maxPrice') ? (float) $request->input('maxPrice') : null,
        ];

        // remove null values so strapi only gets the filters that are set
        $filters = array_filter($filters, fn ($v) => $v !== null);

        return Inertia::render('products', [
            'products' => $strapi->getProducts($filters),
            // for the filter sidebar dropdowns
            'formats' => $strapi->getFormats(),
            'genres' => $strapi->getGenres(),
            // for the price slider min/max bounds
            'priceRange' => $strapi->getPriceRange(),
            // pass current filters back to frontend so inputs stay in sync
            'filters' => [
                'query' => $filters['query'] ?? '',
                'format' => $filters['format'] ?? null,
                'genre' => $filters['genre'] ?? null,
                'minPrice' => $filters['minPrice'] ?? null,
                'maxPrice' => $filters['maxPrice'] ?? null,
            ],
        ]);
    }

    /**
     * Display a single product detail page.
     */
    public function show(string $slug, StrapiService $strapi): Response
    {
        $product = $strapi->getProduct($slug);

        if (! $product) {
            abort(404);
        }

        return Inertia::render('products/show', [
            'product' => $product,
        ]);
    }
}
