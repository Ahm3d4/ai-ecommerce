// src/services/api.ts

// Define what a Product looks like on the frontend (matching your C# Model!)
export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    imageUrl: string;
    createdAt: string;
}

// Replace this port with the exact HTTP/HTTPS port your .NET app is listening on!
const BASE_URL = 'http://localhost:5047/api'; 

export const fetchProducts = async (): Promise<Product[]> => {
    try {
        const response = await fetch(`${BASE_URL}/products`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch products:", error);
        throw error;
    }
};