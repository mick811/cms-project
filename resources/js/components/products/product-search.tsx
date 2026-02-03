import { Input } from '@/components/ui/input';

interface ProductSearchProps {
    value: string;
    onChange: (value: string) => void;
}

export function ProductSearch({ value, onChange }: ProductSearchProps) {
    return (
        <form className="flex w-full max-w-xl flex-col gap-2">
            <label htmlFor="products-search" className="sr-only">
                Search products
            </label>
            <Input
                id="products-search"
                type="search"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Filter by title..."
                className="h-11 rounded-xs bg-sidebar-accent text-sidebar-accent-foreground placeholder:text-sidebar-foreground/70"
            />
        </form>
    );
}
