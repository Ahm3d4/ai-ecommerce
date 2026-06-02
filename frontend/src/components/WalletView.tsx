// 📁 src/components/WalletView.tsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // ◄── Pull global context

export const WalletView = () => {
  // 🆕 Pull both the global balance AND the refresh trigger from useAuth()
  const { token, balance, refreshBalance } = useAuth(); 
  const [depositAmount, setDepositAmount] = useState<string>('');

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) return;

    try {
      const response = await fetch('http://localhost:5047/api/wallets/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount })
      });

      if (response.ok) {
        setDepositAmount('');
        // 🆕 This triggers the context fetch, which automatically updates BOTH Navbar and WalletView instantly
        refreshBalance(); 
      }
    } catch (err) {
      console.error("Deposit network error:", err);
    }
  };

  return (
    <div style={{ backgroundColor: '#16171d', border: '1px solid #2e303a', borderRadius: '8px', padding: '25px', marginTop: '30px' }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#f3f4f6' }}>💳 NextGen Digital Wallet Balance</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1f2028', padding: '20px', borderRadius: '6px', border: '1px solid #2e303a' }}>
        <div>
          <span style={{ color: '#9ca3af', fontSize: '13px', textTransform: 'uppercase' }}>Available Capital funds</span>
          {/* 🆕 Uses global balance from context */}
          <h2 style={{ margin: '5px 0 0 0', color: '#4caf50', fontSize: '32px' }}>${balance.toFixed(2)}</h2>
        </div>

        <form onSubmit={handleDeposit} style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="number" 
            step="0.01" 
            placeholder="Amount ($)" 
            value={depositAmount}
            onChange={e => setDepositAmount(e.target.value)}
            style={{ padding: '10px', backgroundColor: '#121212', border: '1px solid #2e303a', color: '#fff', borderRadius: '4px', width: '120px', outline: 'none' }}
          />
          <button 
            type="submit" 
            style={{ backgroundColor: '#4caf50', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Deposit Funds
          </button>
        </form>
      </div>
    </div>
  );
};