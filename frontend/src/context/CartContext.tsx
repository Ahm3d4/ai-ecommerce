// 📁 src/context/CartContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Product } from '../services/api'; // ◄── Uses your existing API data models

// Define what an item inside our shopping cart looks like (Matches your exact layout!)
export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    searchQuery: string;               // 🆕 Track search string globally
    setSearchQuery: (query: string) => void;
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    clearCart: () => void;
    getCartTotal: () => number;
    getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    // Initialize global cart state by checking localStorage
    const [cart, setCart] = useState<CartItem[]>(() => {
        const savedCart = localStorage.getItem('nextgen_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [searchQuery, setSearchQuery] = useState<string>('');
    // Automatically sync the cart data to localStorage whenever it changes globally
    useEffect(() => {
        localStorage.setItem('nextgen_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: Product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(item => item.product.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevCart, { product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: number) => {
        setCart((prevCart) => {
            return prevCart
                .map(item => 
                    item.product.id === productId 
                        ? { ...item, quantity: item.quantity - 1 } 
                        : item
                )
                .filter(item => item.quantity > 0);
        });
    };

    const clearCart = () => setCart([]);

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    };

    const getCartCount = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getCartTotal, getCartCount, searchQuery, setSearchQuery
            
         }}>
            {children}
        </CartContext.Provider>
    );
};

// 🆕 This is the ONLY useCart hook you keep. It hooks directly into the Global Context stream!
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
};