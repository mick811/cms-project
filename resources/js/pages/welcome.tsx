import { usePage } from '@inertiajs/react';
import { ProductGallery } from '@/components/product-gallery';
import { StrapiImage } from '@/components/strapi-image';
import SimpleHeaderLayout from '@/layouts/simple-header-layout';
import type { HeroData, SharedData, StrapiProduct } from '@/types';

interface PageProps extends SharedData {
    hero: HeroData;
    products: StrapiProduct[];
}

export default function Welcome() {
    const { hero, products } = usePage<PageProps>().props;

    return (
        <div>
            <div className="relative h-[50vh] min-h-75 w-full overflow-hidden sm:h-[60vh] md:h-[70vh] lg:h-[80vh]">
                <StrapiImage
                    image={hero.image}
                    alt="billede af en hero"
                    className="h-full w-full object-cover"
                />
            </div>

            <section
                id="popular"
                className="mx-4 py-6 md:mx-8 md:py-8 lg:mx-12"
            >
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold tracking-wide uppercase sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
                        Popular Products
                    </h2>
                    <a
                        href="/products"
                        className="shrink-0 text-sm font-medium tracking-wide uppercase underline underline-offset-4 transition-all hover:text-muted-foreground sm:rounded-xs sm:border sm:border-border sm:px-4 sm:py-1.5 sm:text-base sm:no-underline sm:hover:bg-primary sm:hover:text-primary-foreground md:px-6 md:py-2 md:text-lg lg:px-8 lg:text-xl"
                    >
                        See All
                    </a>
                </div>

                <ProductGallery products={products} />
            </section>
        </div>
    );
}

Welcome.layout = (page: React.ReactNode) => (
    <SimpleHeaderLayout>{page}</SimpleHeaderLayout>
);
