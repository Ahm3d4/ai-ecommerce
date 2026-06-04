// 📁 src/components/ProductDetails.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { type Product } from '../services/api';
import { useCart } from '../context/CartContext';

export const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`http://localhost:5047/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Hardware component not found.");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div style={{ color: '#fff', padding: '40px' }}>Loading specifications...</div>;
  if (error || !product) return <div style={{ color: 'red', padding: '40px' }}>Error: {error || 'Product missing'}</div>;

  return (
    <div style={{ padding: '20px', color: '#fff' }}>
      <button 
        onClick={() => navigate('/')} 
        style={{ backgroundColor: '#333', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', marginBottom: '30px', fontWeight: 'bold' }}
      >
        ← Back to Catalog
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', backgroundColor: '#1e1e1e', padding: '40px', borderRadius: '8px', border: '1px solid #333' }}>
        <div>
          <img 
            src={product.imageUrl || 'https://via.placeholder.com/400'} 
            alt={product.name} 
            style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px' }} 
          />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{ margin: '0 0 10px 0', color: '#646cff', fontSize: '36px' }}>{product.name}</h1>
          <p style={{ color: '#4caf50', fontSize: '28px', fontWeight: 'bold', margin: '10px 0' }}>${product.price.toFixed(2)}</p>
          <hr style={{ border: '0', borderTop: '1px solid #333', margin: '20px 0' }} />
          <h3>Specifications & Details</h3>
          <p style={{ color: '#aaa', lineHeight: '1.6', fontSize: '16px' }}>{product.description}</p>
          
          <button 
            onClick={() => addToCart(product)}
            style={{ backgroundColor: '#646cff', color: 'white', border: 'none', padding: '15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '18px', marginTop: '30px', width: '200px' }}
          >
            Add to Basket
          </button>
        </div>
      </div>
    </div>
  );
};