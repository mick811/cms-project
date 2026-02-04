import { Head, usePage } from '@inertiajs/react';
import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { InfoRow } from '@/components/info-row';
import { StrapiImage } from '@/components/strapi-image';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import SimpleHeaderLayout from '@/layouts/simple-header-layout';
import type { SharedData, StrapiProduct } from '@/types';

interface PageProps extends SharedData {
    product: StrapiProduct;
}

export default function ProductShow() {
    const { product } = usePage<PageProps>().props;
    const [quantity, setQuantity] = useState(1);

    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(product.price);

    const releaseYear = product.release_date
        ? new Date(product.release_date).getFullYear()
        : null;

    return (
        <>
            <Head title={`${product.title} — ${product.artist}`} />

            <main className="mx-auto max-w-7xl px-4 pt-12 pb-24 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-16 lg:flex-row">
                    <div className="grid flex-1 grid-cols-1 gap-1 self-start md:grid-cols-2">
                        {product.images.length > 0 ? (
                            product.images.map((image) => (
                                <div
                                    key={image.id}
                                    className="aspect-square overflow-hidden border border-border bg-neutral-50 dark:bg-neutral-900"
                                >
                                    <StrapiImage
                                        image={image}
                                        alt={product.title}
                                        className="h-full w-full object-cover transition-transform duration-1000 ease-out hover:scale-105"
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full flex aspect-square items-center justify-center border border-border bg-neutral-50 dark:bg-neutral-900">
                                <span className="text-[11px] font-medium tracking-[0.15em] text-muted-foreground uppercase">
                                    Image unavailable
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="w-full lg:sticky lg:top-28 lg:h-fit lg:w-105">
                        <div className="space-y-12">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <p className="text-[11px] font-medium tracking-[0.15em] text-muted-foreground uppercase">
                                        {product.artist}
                                    </p>
                                    <h1 className="text-3xl font-light tracking-tight text-foreground">
                                        {product.title}
                                    </h1>
                                </div>
                                <p className="text-lg font-light text-foreground">
                                    {formattedPrice}
                                </p>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <Label className="text-[11px] font-medium tracking-[0.15em] text-muted-foreground uppercase">
                                        Quantity
                                    </Label>
                                    <div className="flex h-12 w-36 items-center justify-between border border-border">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setQuantity(
                                                    Math.max(1, quantity - 1),
                                                )
                                            }
                                            className="flex size-12 items-center justify-center transition-colors hover:bg-neutral-50 disabled:opacity-20 dark:hover:bg-neutral-900"
                                            disabled={quantity <= 1}
                                        >
                                            <Minus className="size-3" />
                                        </button>
                                        <span className="text-sm">
                                            {quantity}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setQuantity(
                                                    Math.min(
                                                        product.stock || 99,
                                                        quantity + 1,
                                                    ),
                                                )
                                            }
                                            className="flex size-12 items-center justify-center transition-colors hover:bg-neutral-50 disabled:opacity-20 dark:hover:bg-neutral-900"
                                            disabled={
                                                quantity >=
                                                (product.stock || 99)
                                            }
                                        >
                                            <Plus className="size-3" />
                                        </button>
                                    </div>
                                </div>

                                <Button
                                    size="lg"
                                    className="h-14 w-full rounded-none bg-foreground text-[11px] font-medium tracking-[0.15em] text-background uppercase transition-colors hover:bg-foreground/90"
                                >
                                    Add to Bag
                                </Button>

                                {product.stock <= 5 && product.stock > 0 && (
                                    <p className="text-center text-[11px] tracking-wide text-muted-foreground uppercase">
                                        Limited stock: {product.stock} remaining
                                    </p>
                                )}
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <p className="text-sm leading-relaxed font-light text-muted-foreground">
                                    {product.description}
                                </p>
                            </div>

                            <Accordion
                                type="single"
                                collapsible
                                className="w-full border-t border-border"
                            >
                                <AccordionItem value="production-info">
                                    <AccordionTrigger className="py-6 text-[11px] font-medium tracking-[0.15em] uppercase hover:no-underline">
                                        Production Info
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-4 pt-2">
                                            <InfoRow
                                                label="Release Year"
                                                value={releaseYear}
                                            />
                                            <InfoRow
                                                label="Format"
                                                value={product.format?.name}
                                            />
                                            <InfoRow
                                                label="Genre"
                                                value={product.genre?.type}
                                            />
                                            <InfoRow
                                                label="Media Condition"
                                                value={product.media_condition}
                                            />
                                            <InfoRow
                                                label="Sleeve Condition"
                                                value={product.sleeve_condition}
                                            />
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="delivery">
                                    <AccordionTrigger className="py-6 text-[11px] font-medium tracking-[0.15em] uppercase hover:no-underline">
                                        Delivery & Returns
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <p className="pt-2 text-[11px] leading-relaxed tracking-wide text-muted-foreground uppercase">
                                            Standard delivery within 3-5
                                            business days. Express options
                                            available at checkout. Returns
                                            accepted within 14 days of purchase.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="care">
                                    <AccordionTrigger className="py-6 text-[11px] font-medium tracking-[0.15em] uppercase hover:no-underline">
                                        Care & Handling
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <p className="pt-2 text-[11px] leading-relaxed tracking-wide text-muted-foreground uppercase">
                                            Store vertically in a cool, dry
                                            place. Clean with a carbon fiber
                                            brush before and after play for
                                            optimal sound quality.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

ProductShow.layout = (page: React.ReactNode) => (
    <SimpleHeaderLayout>{page}</SimpleHeaderLayout>
);
