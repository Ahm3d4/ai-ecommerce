// 📁 src/components/ProductCard.tsx
import React from 'react';
import { Link } from 'react-router-dom'; // 🆕 Import Link
import { type Product } from '../services/api';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div style={{ border: '1px solid #333', borderRadius: '8px', padding: '20px', backgroundColor: '#1e1e1e', display: 'flex', flexDirection: 'column', justifyContent: 'between' }}>
      
      {/* 🆕 Wrap image and text in a Link to make it clickable */}
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <img 
          src={product.imageUrl || 'https://via.placeholder.com/150'} 
          alt={product.name} 
          style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer' }} 
        />
        <h3 style={{ margin: '15px 0 10px 0', cursor: 'pointer' }}>{product.name}</h3>
      </Link>

      <p style={{ color: '#aaa', fontSize: '14px', height: '40px', overflow: 'hidden', margin: '0 0 15px 0' }}>
        {product.description}
      </p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
        <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#4caf50' }}>
          ${product.price.toFixed(2)}
        </span>
        <button 
          onClick={() => onAddToCart(product)}
          style={{ backgroundColor: '#646cff', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};