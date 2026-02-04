import { Link } from '@inertiajs/react';
import { StrapiImage } from '@/components/strapi-image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { StrapiProduct } from '@/types';

type ProductGalleryVariant = 'popular' | 'catalog';

interface ProductGalleryProps {
    products: StrapiProduct[];
    className?: string;
    variant?: ProductGalleryVariant;
    onAddToCart?: (product: StrapiProduct) => void;
}

function formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price);
}

export function ProductGallery({
    products,
    className,
    variant = 'popular',
    onAddToCart,
}: ProductGalleryProps) {
    if (variant === 'catalog') {
        return (
            <ul
                role="list"
                className={cn(
                    'grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4',
                    className,
                )}
            >
                {products.map((product) => (
                    <li
                        key={product.id}
                        role="listitem"
                        className="group flex flex-col overflow-hidden rounded-xs border border-border bg-card"
                    >
                        <Link
                            href={`/products/${product.slug}`}
                            className="aspect-square w-full overflow-hidden"
                        >
                            <StrapiImage
                                image={product.images[0]}
                                alt={
                                    product.images[0]?.alternativeText ||
                                    product.title
                                }
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                fallback={
                                    <div className="h-full w-full bg-slate-300" />
                                }
                            />
                        </Link>
                        <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
                            <Link
                                href={`/products/${product.slug}`}
                                className="line-clamp-2 text-sm font-medium hover:underline sm:text-base"
                            >
                                {product.title}
                            </Link>
                            <p className="text-xs text-muted-foreground sm:text-sm">
                                {product.artist}
                            </p>
                            <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                                <span className="text-sm font-semibold sm:text-base">
                                    {formatPrice(product.price)}
                                </span>
                                <Button
                                    size="sm"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onAddToCart?.(product);
                                    }}
                                    className="shrink-0 rounded-xs text-xs sm:text-sm"
                                >
                                    Add to Cart
                                </Button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <ul
            role="list"
            className={cn(
                'mt-4 grid grid-cols-2 grid-rows-2 gap-3 sm:mt-6 sm:gap-4 md:mt-8 lg:mt-10 lg:grid-cols-4 lg:grid-rows-1',
                className,
            )}
        >
            {products.map((product) => (
                <li
                    key={product.id}
                    role="listitem"
                    className="aspect-square w-full overflow-hidden rounded-xs"
                >
                    <Link href={`/products/${product.slug}`}>
                        <figure className="h-full w-full">
                            <StrapiImage
                                image={product.images[0]}
                                alt={
                                    product.images[0]?.alternativeText ||
                                    product.title
                                }
                                className="h-full w-full object-cover"
                                fallback={
                                    <div className="h-full w-full bg-slate-300" />
                                }
                            />
                        </figure>
                    </Link>
                </li>
            ))}
        </ul>
    );
}
