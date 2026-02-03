import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { ProductGallery } from '@/components/product-gallery';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useSearch';
import SimpleHeaderLayout from '@/layouts/simple-header-layout';
import type { SharedData, StrapiProduct } from '@/types';

interface PageProps extends SharedData {
    products: StrapiProduct[];
    query: string;
}

export default function Products() {
    const { products, query } = usePage<PageProps>().props;
    const [search, setSearch] = useState(query ?? '');
    const debounced = useDebounce(search, 300);

    useEffect(() => setSearch(query ?? ''), [query]);

    useEffect(() => {
        if (debounced === query) return;
        router.get('/products', debounced ? { q: debounced } : {}, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    }, [debounced, query]);

    return (
        <div className="px-4 py-6 md:px-8 md:py-8 lg:px-12">
            <Head title={query ? `Products: ${query}` : 'Products'} />

            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-wide uppercase sm:text-3xl md:text-4xl">
                        Products
                    </h1>
                    {query && (
                        <p className="mt-2 text-muted-foreground">
                            Showing results for "{query}"
                        </p>
                    )}
                </div>

                <form className="flex w-full max-w-xl flex-col gap-2">
                    <label htmlFor="products-search" className="sr-only">
                        Search products
                    </label>
                    <Input
                        id="products-search"
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Filter by title..."
                        className="h-11 rounded-xs bg-sidebar-accent text-sidebar-accent-foreground placeholder:text-sidebar-foreground/70"
                    />
                </form>
            </div>

            {products.length > 0 ? (
                <ProductGallery products={products} className="mt-8" />
            ) : (
                <div className="mt-10 text-center">
                    <p className="text-lg text-muted-foreground">
                        {query
                            ? 'No products found matching your search.'
                            : 'Start typing to filter products.'}
                    </p>
                </div>
            )}
        </div>
    );
}

Products.layout = (page: React.ReactNode) => (
    <SimpleHeaderLayout>{page}</SimpleHeaderLayout>
);
