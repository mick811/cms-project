/**
 * Cart Store using Zustand with persistence
 *
 * Zustand is a lightweight state management library.
 * The 'persist' middleware automatically saves cart data to localStorage,
 * so the cart persists across page reloads.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StrapiProduct } from '@/types';

export interface CartItem {
    id: number;
    product: StrapiProduct;
    quantity: number;
}

interface CartStore {
    items: CartItem[];
    addItem: (product: StrapiProduct) => boolean;
    removeItem: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => boolean;
    clearCart: () => void;
    total: () => number;
    itemCount: () => number;
    getItemQuantity: (id: number) => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        // set = update state, get = read current state
        (set, get) => ({
            items: [],

            addItem: (product: StrapiProduct): boolean => {
                const stock = product.stock || 0;
                const existingItem = get().items.find(
                    (item) => item.id === product.id,
                );
                const currentQuantity = existingItem?.quantity || 0;

                if (currentQuantity >= stock) {
                    return false;
                }

                set((state) => {
                    if (existingItem) {
                        return {
                            items: state.items.map((item) =>
                                item.id === product.id
                                    ? { ...item, quantity: item.quantity + 1 }
                                    : item,
                            ),
                        };
                    }

                    return {
                        items: [
                            ...state.items,
                            { id: product.id, product, quantity: 1 },
                        ],
                    };
                });

                return true;
            },

            removeItem: (id: number) => {
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id),
                }));
            },

            updateQuantity: (id: number, quantity: number): boolean => {
                if (quantity <= 0) {
                    get().removeItem(id);
                    return true;
                }

                const item = get().items.find((i) => i.id === id);
                if (!item) return false;

                const stock = item.product.stock || 0;
                if (quantity > stock) {
                    return false;
                }

                set((state) => ({
                    items: state.items.map((i) =>
                        i.id === id ? { ...i, quantity } : i,
                    ),
                }));

                return true;
            },

            clearCart: () => {
                set({ items: [] });
            },

            total: () => {
                return get().items.reduce(
                    (sum, item) => sum + item.product.price * item.quantity,
                    0,
                );
            },

            itemCount: () => {
                return get().items.reduce(
                    (sum, item) => sum + item.quantity,
                    0,
                );
            },

            getItemQuantity: (id: number) => {
                const item = get().items.find((i) => i.id === id);
                return item?.quantity || 0;
            },
        }),
        {
            name: 'cart-storage',
        },
    ),
);
