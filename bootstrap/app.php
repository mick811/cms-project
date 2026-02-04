<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Throwable;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->respond(function (Response $response, Throwable $exception, Request $request) {
            // Only handle Inertia requests and HTTP exceptions (404, 500, etc.)
            if (! $request->header('X-Inertia') && ! in_array($response->getStatusCode(), [404, 500, 503])) {
                return $response;
            }

            $status = $response->getStatusCode();

            // Render custom Inertia error page for HTTP errors
            if (in_array($status, [404, 500, 503])) {
                return Inertia::render('error', [
                    'status' => $status,
                    'message' => $exception->getMessage(),
                ])->toResponse($request)->setStatusCode($status);
            }

            return $response;
        });
    })->create();
