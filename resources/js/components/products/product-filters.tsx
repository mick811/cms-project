import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import type { StrapiFormat, StrapiGenre } from '@/types';

interface PriceRange {
    min: number;
    max: number;
}

interface ProductFiltersProps {
    formats: StrapiFormat[];
    genres: StrapiGenre[];
    priceRange: PriceRange;
    format: string;
    genre: string;
    price: [number, number];
    onFormatChange: (value: string) => void;
    onGenreChange: (value: string) => void;
    onPriceChange: (value: [number, number]) => void;
}

export function ProductFilters({
    formats,
    genres,
    priceRange,
    format,
    genre,
    price,
    onFormatChange,
    onGenreChange,
    onPriceChange,
}: ProductFiltersProps) {
    return (
        <aside className="hidden w-72 shrink-0 lg:block">
            <div className="sticky top-6 flex flex-col gap-6">
                <h2 className="text-lg font-semibold">Filters</h2>

                <FormatFilter
                    formats={formats}
                    value={format}
                    onChange={onFormatChange}
                />

                <GenreFilter
                    genres={genres}
                    value={genre}
                    onChange={onGenreChange}
                />

                <PriceFilter
                    priceRange={priceRange}
                    value={price}
                    onChange={onPriceChange}
                />
            </div>
        </aside>
    );
}

function FormatFilter({
    formats,
    value,
    onChange,
}: {
    formats: StrapiFormat[];
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor="format-filter">Format</Label>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger id="format-filter" className="rounded-xs">
                    <SelectValue placeholder="All formats" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All formats</SelectItem>
                    {formats.map((f) => (
                        <SelectItem key={f.id} value={f.id.toString()}>
                            {f.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

function GenreFilter({
    genres,
    value,
    onChange,
}: {
    genres: StrapiGenre[];
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor="genre-filter">Genre</Label>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger id="genre-filter" className="rounded-xs">
                    <SelectValue placeholder="All genres" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All genres</SelectItem>
                    {genres.map((g) => (
                        <SelectItem key={g.id} value={g.id.toString()}>
                            {g.type}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

function PriceFilter({
    priceRange,
    value,
    onChange,
}: {
    priceRange: PriceRange;
    value: [number, number];
    onChange: (value: [number, number]) => void;
}) {
    return (
        <div className="flex flex-col gap-3">
            <Label>Price</Label>
            <div className="flex items-center justify-between gap-3">
                <Input
                    type="number"
                    value={value[0]}
                    onChange={(e) =>
                        onChange([Number(e.target.value), value[1]])
                    }
                    min={priceRange.min}
                    max={value[1]}
                    className="h-9 w-24 rounded-xs text-center"
                />
                <Input
                    type="number"
                    value={value[1]}
                    onChange={(e) =>
                        onChange([value[0], Number(e.target.value)])
                    }
                    min={value[0]}
                    max={priceRange.max}
                    className="h-9 w-24 rounded-xs text-center"
                />
            </div>
            <Slider
                min={priceRange.min}
                max={priceRange.max}
                step={1}
                value={value}
                onValueChange={(v) => onChange(v as [number, number])}
            />
        </div>
    );
}
