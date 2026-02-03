import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
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

export function useProductFilters({
    initialFilters,
    priceRange,
}: UseProductFiltersOptions) {
    const [search, setSearch] = useState(initialFilters.query || '');
    const [format, setFormat] = useState(initialFilters.format?.toString() || 'all');
    const [genre, setGenre] = useState(initialFilters.genre?.toString() || 'all');
    const [price, setPrice] = useState<[number, number]>([
        initialFilters.minPrice ?? priceRange.min,
        initialFilters.maxPrice ?? priceRange.max,
    ]);

    const debouncedSearch = useDebounce(search, 300);
    const debouncedPrice = useDebounce(price, 300);

    // builds url params and navigates
    function navigate(overrides: Partial<Filters> = {}) {
        const params: Record<string, string | number> = {};

        // use 'in' check because null is a valid value (means "all")
        const q = 'query' in overrides ? overrides.query : debouncedSearch;
        const f =
            'format' in overrides
                ? overrides.format
                : format !== 'all'
                  ? parseInt(format)
                  : null;
        const g =
            'genre' in overrides
                ? overrides.genre
                : genre !== 'all'
                  ? parseInt(genre)
                  : null;
        const min =
            'minPrice' in overrides ? overrides.minPrice : debouncedPrice[0];
        const max =
            'maxPrice' in overrides ? overrides.maxPrice : debouncedPrice[1];

        if (q) params.q = q;
        if (f) params.format = f;
        if (g) params.genre = g;
        if (min && min !== priceRange.min) params.minPrice = min;
        if (max && max !== priceRange.max) params.maxPrice = max;

        router.get('/products', params, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    }

    useEffect(() => {
        if (debouncedSearch !== initialFilters.query) {
            navigate({ query: debouncedSearch });
        }
    }, [debouncedSearch]);

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
    }, [debouncedPrice]);

    return {
        search,
        setSearch,
        format,
        setFormat: (value: string) => {
            setFormat(value);
            navigate({ format: value === 'all' ? null : parseInt(value) });
        },
        genre,
        setGenre: (value: string) => {
            setGenre(value);
            navigate({ genre: value === 'all' ? null : parseInt(value) });
        },
        price,
        setPrice,
    };
}
