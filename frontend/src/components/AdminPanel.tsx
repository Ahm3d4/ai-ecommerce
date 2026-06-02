// 📁 src/components/AdminPanel.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const AdminPanel = ({ onProductAdded }: { onProductAdded: () => void }) => {
  const { token } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [message, setMessage] = useState({ text: '', isError: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: '', isError: false });

    if (!name || !price) {
      setMessage({ text: 'Name and Price are required.', isError: true });
      return;
    }

    try {
      const response = await fetch('http://localhost:5047/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // ◄── Passes your secure 512-bit admin token
        },
        body: JSON.stringify({
          name,
          description,
          price: parseFloat(price),
          imageUrl: imageUrl || undefined
        })
      });

      if (!response.ok) {
        throw new Error(await response.text() || 'Failed to add item.');
      }

      setMessage({ text: 'Product successfully listed in store!', isError: false });
      setName('');
      setDescription('');
      setPrice('');
      setImageUrl('');
      onProductAdded(); // ◄── Triggers a catalog refresh on the Home dashboard
    } catch (err: any) {
      setMessage({ text: err.message || 'Server connection issue.', isError: true });
    }
  };

  return (
    <div style={{ backgroundColor: '#1e1e1e', border: '1px solid #333', borderRadius: '8px', padding: '25px', marginBottom: '40px' }}>
      <h2 style={{ margin: '0 0 20px 0', color: '#c084fc' }}>🛠️ Admin Dashboard: Add New Hardware</h2>
      
      {message.text && (
        <div style={{ padding: '10px', borderRadius: '4px', marginBottom: '15px', backgroundColor: message.isError ? 'rgba(211,47,47,0.2)' : 'rgba(76,175,80,0.2)', color: message.isError ? '#ff7961' : '#81c784' }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <input type="text" placeholder="Product Name " value={name} onChange={e => setName(e.target.value)} style={{ padding: '10px', backgroundColor: '#121212', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
          <input type="number" step="0.01" placeholder="Price ($)" value={price} onChange={e => setPrice(e.target.value)} style={{ padding: '10px', backgroundColor: '#121212', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
        </div>
        <textarea placeholder="Product Description..." value={description} onChange={e => setDescription(e.target.value)} rows={3} style={{ padding: '10px', backgroundColor: '#121212', border: '1px solid #333', color: '#fff', borderRadius: '4px', resize: 'vertical' }} />
        <input type="text" placeholder="Image URL (Optional)" value={imageUrl} onChange={e => setImageUrl(e.target.value)} style={{ padding: '10px', backgroundColor: '#121212', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
        <button type="submit" style={{ backgroundColor: '#c084fc', color: '#121212', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
          Publish Item Live
        </button>
      </form>
    </div>
  );
};