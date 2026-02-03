export interface StrapiImage {
    id: number;
    documentId: string;
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number | null;
    height: number | null;
    formats: Record<string, unknown> | null;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    provider_metadata: unknown | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

export interface StrapiMedia {
    data: StrapiImage | null;
}

export type StrapiEntry<T> = {
    id: number;
    documentId: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
} & T;

export type HeroData = StrapiEntry<{
    image: StrapiImage;
}>;

export type StrapiFormat = StrapiEntry<{
    Name: string;
}>;

export type StrapiProduct = StrapiEntry<{
    slug: string;
    Title: string;
    Artist: string;
    release_date: string;
    price: number;
    stock: number;
    media_condition: string;
    sleeve_condition: string;
    images: StrapiImage[];
    format: StrapiFormat | null;
}>;
