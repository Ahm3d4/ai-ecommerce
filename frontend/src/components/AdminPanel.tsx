// 📁 src/components/AdminPanel.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchProducts, type Product } from '../services/api';

export const AdminPanel = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);

  // Form States
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [addProductMessage, setAddProductMessage] = useState({ text: '', isError: false });

  const [selectedProductId, setSelectedProductId] = useState<number | "">("");
  const [restockQuantity, setRestockQuantity] = useState<number>(0);
  const [restockMessage, setRestockMessage] = useState({ text: '', isError: false });

  // 🆕 Deletion Safety Tracking Hook States
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [globalMessage, setGlobalMessage] = useState({ text: '', isError: false });

  const loadAdminInventory = () => {
    fetchProducts()
      .then(data => setProducts(data))
      .catch(err => console.error("Error updating admin inventory matrix:", err));
  };

  useEffect(() => {
    loadAdminInventory();
  }, []);

  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddProductMessage({ text: '', isError: false });
    if (!name || !price) return;

    try {
      const response = await fetch('http://localhost:5047/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name, description, price: parseFloat(price), imageUrl: imageUrl || undefined, stockQuantity: parseInt(stockQuantity) || 0 })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to list new component.');

      setAddProductMessage({ text: '🚀 Component listed live!', isError: false });
      setName(''); setDescription(''); setPrice(''); setImageUrl(''); setStockQuantity('');
      loadAdminInventory();
    } catch (err: any) {
      setAddProductMessage({ text: err.message, isError: true });
    }
  };

  const handleRestockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRestockMessage({ text: '', isError: false });
    if (!selectedProductId || restockQuantity <= 0) return;

    try {
      const response = await fetch('http://localhost:5047/api/admin/restock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ productId: Number(selectedProductId), quantityToAdd: restockQuantity })
      });
      const rawText = await response.text();
      if (!response.ok) throw new Error("Failed stock adjustment.");
      const data = rawText ? JSON.parse(rawText) : null;

      setRestockMessage({ text: `✅ ${data?.message}`, isError: false });
      setRestockQuantity(0);
      loadAdminInventory();
    } catch (err: any) {
      setRestockMessage({ text: err.message, isError: true });
    }
  };

  // 🆕 ACTION handler: Execute Product Purge Command Route
  // 📁 src/components/AdminPanel.tsx

const handleDeleteExecute = async (id: number) => {
  setGlobalMessage({ text: '', isError: false });
  
  // 🆕 Safety check: If the id is missing, stop immediately before hitting the network
  if (!id) {
    setGlobalMessage({ text: "Error: Invalid or missing product ID selection.", isError: true });
    return;
  }

  try {
    // 🟩 Explicitly pass the id parameter down into the URL string
    const response = await fetch(`http://localhost:5047/api/admin/${id}`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${token}` 
      }
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Deletion request rejected.");

    setGlobalMessage({ text: `🗑️ ${data.message}`, isError: false });
    setDeletingId(null);
    loadAdminInventory(); // Refresh local list state
  } catch (err: any) {
    setGlobalMessage({ text: err.message, isError: true });
  }
};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <div style={{ borderBottom: '1px solid #2e303a', paddingBottom: '15px' }}>
        <h2 style={{ margin: 0, color: '#c084fc' }}>🛡️ Standalone Admin Administration Console</h2>
        <p style={{ color: '#aaa', margin: '5px 0 0 0', fontSize: '14px' }}>Secure back-office hardware listing and repository configuration options.</p>
      </div>

      {globalMessage.text && (
        <div style={{ padding: '12px', borderRadius: '6px', fontSize: '14px', backgroundColor: globalMessage.isError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(76, 175, 80, 0.1)', border: globalMessage.isError ? '1px solid #ef4444' : '1px solid #4caf50', color: globalMessage.isError ? '#ef4444' : '#4caf50' }}>
          {globalMessage.text}
        </div>
      )}

      {/* TOP AREA GRIDS */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '30px', alignItems: 'start' }}>
        {/* ADD PRODUCT CONTAINER */}
        <div style={{ backgroundColor: '#1f2028', border: '1px solid #2e303a', borderRadius: '8px', padding: '25px' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#fff' }}>✨ Publish New Product Component</h3>
          {addProductMessage.text && <div style={{ padding: '10px', marginBottom: '10px', borderRadius: '4px', fontSize: '13px', backgroundColor: addProductMessage.isError ? 'rgba(239,68,68,0.1)' : 'rgba(76,175,80,0.1)', color: addProductMessage.isError ? '#ef4444' : '#4caf50' }}>{addProductMessage.text}</div>}
          <form onSubmit={handleAddProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '15px' }}>
              <input type="text" placeholder="Component Name" value={name} onChange={e => setName(e.target.value)} style={{ padding: '10px', backgroundColor: '#121212', border: '1px solid #2e303a', color: '#fff', borderRadius: '6px', outline: 'none' }} />
              <input type="number" step="0.01" placeholder="Price ($)" value={price} onChange={e => setPrice(e.target.value)} style={{ padding: '10px', backgroundColor: '#121212', border: '1px solid #2e303a', color: '#fff', borderRadius: '6px', outline: 'none' }} />
              <input type="number" placeholder="Initial Stock" value={stockQuantity} onChange={e => setStockQuantity(e.target.value)} style={{ padding: '10px', backgroundColor: '#121212', border: '1px solid #2e303a', color: '#fff', borderRadius: '6px', outline: 'none' }} />
            </div>
            <textarea placeholder="Technical specifications details..." value={description} onChange={e => setDescription(e.target.value)} rows={3} style={{ padding: '10px', backgroundColor: '#121212', border: '1px solid #2e303a', color: '#fff', borderRadius: '6px', outline: 'none', resize: 'vertical' }} />
            <input type="text" placeholder="Product Image Resource URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} style={{ padding: '10px', backgroundColor: '#121212', border: '1px solid #2e303a', color: '#fff', borderRadius: '6px', outline: 'none' }} />
            <button type="submit" style={{ backgroundColor: '#c084fc', color: '#16171d', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Publish Product Live</button>
          </form>
        </div>

        {/* RESTOCK CONTAINER */}
        <div style={{ backgroundColor: '#1f2028', border: '1px solid #2e303a', borderRadius: '8px', padding: '25px' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#fff' }}>📦 Replenish Active Stock</h3>
          {restockMessage.text && <div style={{ padding: '10px', marginBottom: '10px', borderRadius: '4px', fontSize: '13px', backgroundColor: restockMessage.isError ? 'rgba(239,68,68,0.1)' : 'rgba(76,175,80,0.1)', color: restockMessage.isError ? '#ef4444' : '#4caf50' }}>{restockMessage.text}</div>}
          <form onSubmit={handleRestockSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value === "" ? "" : Number(e.target.value))} style={{ backgroundColor: '#121212', border: '1px solid #2e303a', borderRadius: '6px', padding: '10px', color: '#fff', cursor: 'pointer' }}>
              <option value="">-- Choose Hardware Item --</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name} (In Stock: {p.stockQuantity ?? 0})</option>)}
            </select>
            <input type="number" min="1" value={restockQuantity || ""} onChange={(e) => setRestockQuantity(Math.max(0, parseInt(e.target.value) || 0))} placeholder="Enter units quantity count..." style={{ backgroundColor: '#121212', border: '1px solid #2e303a', borderRadius: '6px', padding: '10px', color: '#fff', outline: 'none' }} />
            <button type="submit" disabled={!selectedProductId || restockQuantity <= 0} style={{ backgroundColor: (!selectedProductId || restockQuantity <= 0) ? '#2e303a' : '#4caf50', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Add Units to Stock</button>
          </form>
        </div>
      </div>

      {/* 🆕 BOTTOM AREA: LEDGER STOCK DISPOSAL MATRIX MANAGEMENT TABLE */}
      <div style={{ backgroundColor: '#1f2028', border: '1px solid #2e303a', borderRadius: '8px', padding: '25px' }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#fff' }}>📋 Live Warehouse Component Ledger</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #2e303a', color: '#9ca3af' }}>
                <th style={{ padding: '12px 8px' }}>ID</th>
                <th style={{ padding: '12px 8px' }}>Component Name</th>
                <th style={{ padding: '12px 8px' }}>Price</th>
                <th style={{ padding: '12px 8px' }}>Stock Units</th>
                <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions Management</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} style={{ borderBottom: '1px solid #2e303a', color: '#f3f4f6' }}>
                  <td style={{ padding: '12px 8px', color: '#aaa', fontFamily: 'monospace' }}>#{product.id}</td>
                  <td style={{ padding: '12px 8px', fontWeight: '500' }}>{product.name}</td>
                  <td style={{ padding: '12px 8px', color: '#4caf50' }}>${product.price.toFixed(2)}</td>
                  <td style={{ padding: '12px 8px' }}>{product.stockQuantity ?? 0} units</td>
                  <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                    
                    {deletingId === product.id ? (
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      {/* 🟩 Pass product.id directly into the execution handler */}
                      <button onClick={() => handleDeleteExecute(product.id)} style={{ backgroundColor: '#d32f2f', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
                        Confirm Delete 💥
                      </button>
                      <button onClick={() => setDeletingId(null)} style={{ backgroundColor: '#3a3b46', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setDeletingId(product.id)} style={{ backgroundColor: 'rgba(211, 47, 47, 0.1)', color: '#ff7961', border: '1px solid rgba(211, 47, 47, 0.4)', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                      Delete Item 🗑️
                    </button>
                  )}

                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#aaa' }}>No hardware components currently logged in system inventory databases.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};