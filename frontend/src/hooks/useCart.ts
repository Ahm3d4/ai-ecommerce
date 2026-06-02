import { useState, useEffect } from 'react';
import type { Product } from '../services/api';

// Define what an item inside our shopping cart looks like
export interface CartItem {
    product: Product;
    quantity: number;
}

export const useCart = () => {
    // Initialize cart state by checking if there's any saved cart data in the browser's localStorage
    const [cart, setCart] = useState<CartItem[]>(() => {
        const savedCart = localStorage.getItem('nextgen_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Automatically sync the cart data to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('nextgen_cart', JSON.stringify(cart));
    }, [cart]);

    // Function to add an item to the cart
    const addToCart = (product: Product) => {
        setCart((prevCart) => {
            // Check if the item already exists in the cart
            const existingItem = prevCart.find(item => item.product.id === product.id);

            if (existingItem) {
                // If it exists, increase its quantity by 1
                return prevCart.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            // If it's a brand new item, append it to the array with a quantity of 1
            return [...prevCart, { product, quantity: 1 }];
        });
    };

    // Function to remove an item or decrease its quantity
    const removeFromCart = (productId: number) => {
        setCart((prevCart) => {
            return prevCart
                .map(item => 
                    item.product.id === productId 
                        ? { ...item, quantity: item.quantity - 1 } 
                        : item
                )
                .filter(item => item.quantity > 0); // Drop items completely if quantity hits 0
        });
    };

    // Clear the whole cart (useful after checking out)
    const clearCart = () => setCart([]);

    // Calculate total price of everything in the cart
    const getCartTotal = () => {
        return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    };

    // Calculate total count of individual items
    const getCartCount = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    return {
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartCount
    };
};