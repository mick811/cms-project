import { Link, router, usePage } from '@inertiajs/react';
import { Search, ShoppingCart, User } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useSuggestions } from '@/hooks/useSearch';
import type { SharedData } from '@/types';
import AppLogoIcon from './app-logo-icon';

type Suggestion = { id: number; title: string };

export default function Header() {
    const { query = '' } = usePage<SharedData & { query?: string }>().props;

    const [search, setSearch] = useState(query);
    const [open, setOpen] = useState(false);

    const suggestions = useSuggestions<Suggestion>(
        open && search.length >= 2
            ? `/search/suggest?q=${encodeURIComponent(search)}`
            : null,
    );

    return (
        <header className="fixed top-0 right-0 left-0 z-50 bg-sidebar text-sidebar-foreground">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <nav className="hidden items-center gap-6 md:flex">
                    <Link href="/" prefetch>
                        <AppLogoIcon className="size-5 fill-current text-black dark:text-white" />
                    </Link>
                    <Link
                        href="/products"
                        className="font-medium tracking-wide uppercase transition-colors hover:text-sidebar-accent-foreground"
                    >
                        Shop
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            router.get(
                                '/products',
                                search ? { q: search } : {},
                            );
                            setOpen(false);
                        }}
                        className="hidden items-center sm:flex"
                    >
                        <div
                            className="relative"
                            onFocus={() => setOpen(true)}
                            onBlur={(e) =>
                                !e.currentTarget.contains(e.relatedTarget) &&
                                setOpen(false)
                            }
                        >
                            <label htmlFor="header-search" className="sr-only">
                                Search products
                            </label>
                            <Input
                                id="header-search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search..."
                                className="h-10 w-72 rounded-xs bg-sidebar-accent pr-16 text-sidebar-accent-foreground placeholder:text-sidebar-foreground/70"
                            />
                            <button
                                type="submit"
                                className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-xs p-1 text-sidebar-foreground/70 transition hover:text-sidebar-accent-foreground"
                            >
                                <Search className="size-4" />
                            </button>

                            {open && search.length >= 2 && (
                                <div className="absolute top-full left-0 z-50 mt-2 w-full overflow-hidden rounded-xs border border-sidebar-border/80 bg-sidebar shadow-lg">
                                    <ul className="max-h-72 overflow-auto py-1">
                                        {suggestions.length === 0 ? (
                                            <li className="px-4 py-2 text-sm text-sidebar-foreground/70">
                                                No results found.
                                            </li>
                                        ) : (
                                            suggestions.map((s) => (
                                                <li key={s.id}>
                                                    <a
                                                        href={`/products/${s.id}`}
                                                        className="flex flex-col px-4 py-2 text-sm transition hover:bg-sidebar-accent"
                                                    >
                                                        {s.title}
                                                    </a>
                                                </li>
                                            ))
                                        )}
                                    </ul>
                                    <button
                                        type="submit"
                                        className="flex w-full items-center justify-between border-t border-sidebar-border/70 px-4 py-2 text-sm font-medium tracking-wide text-sidebar-foreground uppercase transition hover:bg-sidebar-accent"
                                    >
                                        View all results
                                        <span className="text-xs text-sidebar-foreground/60">
                                            {suggestions.length}
                                        </span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </form>

                    <button className="p-2 transition-colors hover:text-sidebar-accent-foreground">
                        <User className="size-5" />
                    </button>
                    <button className="p-2 transition-colors hover:text-sidebar-accent-foreground">
                        <ShoppingCart className="size-5" />
                    </button>
                </div>
            </div>
        </header>
    );
}
