import { Head, usePage } from '@inertiajs/react';
import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { ProductGallery } from '@/components/product-gallery';
import { ProductFilters } from '@/components/products/product-filters';
import { ProductSearch } from '@/components/products/product-search';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useProductFilters } from '@/hooks/useProductFilters';
import SimpleHeaderLayout from '@/layouts/simple-header-layout';
import type {
    SharedData,
    StrapiFormat,
    StrapiGenre,
    StrapiProduct,
} from '@/types';

interface Filters {
    query: string;
    format: number | null;
    genre: number | null;
    minPrice: number | null;
    maxPrice: number | null;
}

interface PageProps extends SharedData {
    products: StrapiProduct[];
    formats: StrapiFormat[];
    genres: StrapiGenre[];
    priceRange: { min: number; max: number };
    filters: Filters;
}

export default function Products() {
    const { products, formats, genres, priceRange, filters } =
        usePage<PageProps>().props;

    const {
        search,
        setSearch,
        format,
        setFormat,
        genre,
        setGenre,
        price,
        setPrice,
    } = useProductFilters({ initialFilters: filters, priceRange });

    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    return (
        <div className="flex flex-col gap-6 px-4 py-6 lg:flex-row lg:gap-8 lg:px-12">
            <Head
                title={
                    filters.query ? `Products: ${filters.query}` : 'Products'
                }
            />

            {/* Desktop filters - hidden on mobile */}
            <ProductFilters
                formats={formats}
                genres={genres}
                priceRange={priceRange}
                format={format}
                genre={genre}
                price={price}
                onFormatChange={setFormat}
                onGenreChange={setGenre}
                onPriceChange={setPrice}
            />

            <div className="flex-1">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-wide uppercase sm:text-3xl md:text-4xl">
                            Products
                        </h1>
                        {filters.query && (
                            <p className="mt-2 text-muted-foreground">
                                Showing results for "{filters.query}"
                            </p>
                        )}
                    </div>

                    {/* Mobile filter button */}
                    <Sheet
                        open={mobileFiltersOpen}
                        onOpenChange={setMobileFiltersOpen}
                    >
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full gap-2 lg:hidden"
                            >
                                <SlidersHorizontal className="h-4 w-4" />
                                Filters
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-80">
                            <SheetHeader>
                                <SheetTitle>Filters</SheetTitle>
                            </SheetHeader>
                            <div className="mt-6">
                                <ProductFilters
                                    formats={formats}
                                    genres={genres}
                                    priceRange={priceRange}
                                    format={format}
                                    genre={genre}
                                    price={price}
                                    onFormatChange={(value) => {
                                        setFormat(value);
                                        setMobileFiltersOpen(false);
                                    }}
                                    onGenreChange={(value) => {
                                        setGenre(value);
                                        setMobileFiltersOpen(false);
                                    }}
                                    onPriceChange={(value) => {
                                        setPrice(value);
                                        setMobileFiltersOpen(false);
                                    }}
                                />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                <div className="mt-6">
                    <ProductSearch value={search} onChange={setSearch} />
                </div>

                {products.length > 0 ? (
                    <ProductGallery
                        products={products}
                        variant="catalog"
                        className="mt-8"
                    />
                ) : (
                    <div className="mt-10 text-center">
                        <p className="text-lg text-muted-foreground">
                            No products found.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

Products.layout = (page: React.ReactNode) => (
    <SimpleHeaderLayout>{page}</SimpleHeaderLayout>
);
