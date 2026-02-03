import { StrapiImage } from '@/components/strapi-image';
import { cn } from '@/lib/utils';
import type { StrapiProduct } from '@/types';

export function ProductGallery({
    products,
    className,
}: {
    products: StrapiProduct[];
    className?: string;
}) {
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
                    <a href={`/products/${product.id}`}>
                        <figure className="h-full w-full">
                            <StrapiImage
                                image={product.images[0]}
                                alt={
                                    product.images[0]?.alternativeText ||
                                    product.Title
                                }
                                className="h-full w-full object-cover"
                                fallback={
                                    <div className="h-full w-full bg-slate-300" />
                                }
                            />
                        </figure>
                    </a>
                </li>
            ))}
        </ul>
    );
}
