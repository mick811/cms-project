import { router } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useSearch';

interface Filters {
    query: string;
    format: number | null;
    genre: number | null;
    minPrice: number | null;
    maxPrice: number | null;
}

interface PriceRange {
    min: number;
    max: number;
}

interface UseProductFiltersOptions {
    initialFilters: Filters;
    priceRange: PriceRange;
}

function toSelectValue(value: number | null | undefined): string {
    return value == null ? 'all' : value.toString();
}

function toIdOrNull(value: string): number | null {
    return value === 'all' ? null : parseInt(value);
}

function getInitialPrice(
    filters: Filters,
    priceRange: PriceRange,
): [number, number] {
    return [
        filters.minPrice ?? priceRange.min,
        filters.maxPrice ?? priceRange.max,
    ];
}

type ResolvedFilters = {
    query?: string;
    format?: number | null;
    genre?: number | null;
    minPrice?: number | null;
    maxPrice?: number | null;
};

function buildParams(
    { query, format, genre, minPrice, maxPrice }: ResolvedFilters,
    priceRange: PriceRange,
): Record<string, string | number> {
    const params: Record<string, string | number> = {};

    if (query) params.q = query;
    if (format) params.format = format;
    if (genre) params.genre = genre;
    if (minPrice && minPrice !== priceRange.min) {
        params.minPrice = minPrice;
    }
    if (maxPrice && maxPrice !== priceRange.max) {
        params.maxPrice = maxPrice;
    }

    return params;
}

export function useProductFilters({
    initialFilters,
    priceRange,
}: UseProductFiltersOptions) {
    const [search, setSearch] = useState(() => initialFilters.query ?? '');
    const [format, setFormat] = useState(() =>
        toSelectValue(initialFilters.format),
    );
    const [genre, setGenre] = useState(() =>
        toSelectValue(initialFilters.genre),
    );
    const [price, setPrice] = useState<[number, number]>(() =>
        getInitialPrice(initialFilters, priceRange),
    );

    const debouncedSearch = useDebounce(search, 300);
    const debouncedPrice = useDebounce(price, 300);

    // builds url params and navigates
    const navigate = useCallback(
        (overrides: Partial<Filters> = {}) => {
            const [min, max] = debouncedPrice;

            const resolved: ResolvedFilters = {
                query: debouncedSearch,
                format: toIdOrNull(format),
                genre: toIdOrNull(genre),
                minPrice: min,
                maxPrice: max,
                ...overrides,
            };

            const params = buildParams(resolved, priceRange);

            router.get('/products', params, {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            });
        },
        [debouncedSearch, format, genre, debouncedPrice, priceRange],
    );

    const setFormatAndNavigate = useCallback(
        (value: string) => {
            setFormat(value);
            navigate({ format: value === 'all' ? null : parseInt(value) });
        },
        [navigate],
    );

    const setGenreAndNavigate = useCallback(
        (value: string) => {
            setGenre(value);
            navigate({ genre: value === 'all' ? null : parseInt(value) });
        },
        [navigate],
    );

    useEffect(() => {
        if (debouncedSearch !== initialFilters.query) {
            navigate({ query: debouncedSearch });
        }
    }, [debouncedSearch, initialFilters.query, navigate]);

    useEffect(() => {
        const currentMin = initialFilters.minPrice ?? priceRange.min;
        const currentMax = initialFilters.maxPrice ?? priceRange.max;

        if (
            debouncedPrice[0] !== currentMin ||
            debouncedPrice[1] !== currentMax
        ) {
            navigate({
                minPrice: debouncedPrice[0],
                maxPrice: debouncedPrice[1],
            });
        }
    }, [
        debouncedPrice,
        initialFilters.minPrice,
        initialFilters.maxPrice,
        priceRange.min,
        priceRange.max,
        navigate,
    ]);

    return {
        search,
        setSearch,
        format,
        setFormat: setFormatAndNavigate,
        genre,
        setGenre: setGenreAndNavigate,
        price,
        setPrice,
    };
}
