<?php

use App\Http\Controllers\AboutController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SearchController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', HomeController::class)->name('home');
Route::get('/products', [ProductController::class, 'index'])->name('products');
Route::get('/products/{slug}', [ProductController::class, 'show'])->name('products.show');
Route::get('/about', AboutController::class)->name('about');
Route::get('/search/suggest', SearchController::class)->name('search.suggest');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', fn () => Inertia::render('profile'))->name('profile');
});

require __DIR__.'/settings.php';
