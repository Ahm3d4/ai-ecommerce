// 📁 src/components/Home.tsx
import { useEffect, useState } from 'react';
import { fetchProducts, type Product } from '../services/api';
import { useCart } from '../context/CartContext';
import { ProductCard } from './ProductCard';
import { useAuth } from '../context/AuthContext';
import { AdminPanel } from './AdminPanel';
import { SearchBar } from './SearchBar'; // 🆕 Import our SearchBar component
import { useNavigate } from 'react-router-dom'; // 🆕 1. Import useNavigate hook

export const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { cart, addToCart, removeFromCart, getCartTotal, getCartCount, searchQuery } = useCart();
  const { token, user } = useAuth();
  const navigate = useNavigate(); // 🆕 2. Initialize the navigation director instance

  const loadStoreInventory = () => {
    fetchProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not connect to the backend API.");
        setLoading(false);
      });
  };

  useEffect(() => {
    loadStoreInventory();
  }, [token]);

  // 🆕 FILTER LOGIC: Checks both the item title and description for matching characters
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) return <div style={{ padding: '20px', color: '#fff' }}>Loading store items...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <>
      <header style={{ borderBottom: '1px solid #333', paddingBottom: '20px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, color: '#646cff' }}>AI NextGen Store</h1>
          <p style={{ color: '#aaa', margin: '5px 0 0 0' }}>Powered by React, .NET Core, & MySQL</p>
        </div>
        <div style={{ backgroundColor: '#333', padding: '10px 20px', borderRadius: '20px', fontWeight: 'bold' }}>
          🛒 Items: {getCartCount()}
        </div>
      </header>

      {user?.role === 'Admin' && (
        <AdminPanel onProductAdded={loadStoreInventory} />
      )}

      {/* 🆕 SEARCH BAR INJECTION VIEW LAYER */}

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '40px' }}>
        {/* Left Column: Product Catalog */}
        <section>
          <h2>Featured Hardware Products</h2>
          
          {/* 🆕 Fallback conditional display if no inventory specs align with search input */}
          {filteredProducts.length === 0 ? (
            <div style={{ padding: '40px 0', color: '#9ca3af', textAlign: 'center', fontSize: '16px' }}>
              No hardware components match your search term "{searchQuery}".
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
              {/* 🆕 Loop through filtered array instead of original products array */}
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
              ))}
            </div>
          )}
        </section>

        {/* Right Column: Interactive Basket */}
        <aside style={{ borderLeft: '1px solid #333', paddingLeft: '20px' }}>
          <h2>Your Basket</h2>
          {cart.length === 0 ? (
            <p style={{ color: '#aaa', marginTop: '20px' }}>Your cart is empty.</p>
          ) : (
            <div style={{ marginTop: '20px' }}>
              {cart.map((item) => (
                <div key={item.product.id} style={{ borderBottom: '1px solid #222', paddingBottom: '15px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0' }}>{item.product.name}</h4>
                    <span style={{ color: '#aaa', fontSize: '14px' }}>
                      {item.quantity} x ${item.product.price.toFixed(2)}
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item.product.id)}
                    style={{ backgroundColor: '#d32f2f', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    Remove
                  </button>
                  
                </div>
              ))}
              <div style={{ borderTop: '2px solid #333', paddingTop: '20px', marginTop: '20px' }}>
                <h3 style={{ display: 'flex', justifyContent: 'space-between', margin: 0 }}>
                  <span>Total:</span>
                  <span style={{ color: '#4caf50' }}>${getCartTotal().toFixed(2)}</span>
                </h3>
                
                <button onClick={() => navigate('/cart')} style={{ width: '100%', marginTop: '20px', backgroundColor: '#4caf50', color: 'white', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
                  Proceed to Checkout
                </button>
                

              </div>
            </div>
          )}
        </aside>
      </div>
    </>
  );
};