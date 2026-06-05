// 📁 src/components/Cart.tsx
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Cart = () => {
  const { cart, removeFromCart, clearCart, getCartTotal } = useCart();
  const { token, balance, refreshBalance } = useAuth();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const cartTotal = getCartTotal();
  const isWalletInsufficient = balance < cartTotal;

  const handleCheckout = async () => {
    if (cart.length === 0 || isWalletInsufficient || isProcessing) return;

    setIsProcessing(true);
    setErrorMessage(null);

    // Map global state array into the clean CartItemDto format expected by .NET's [FromBody]
    const payload = cart.map(item => ({
      productId: item.product.id,
      quantity: item.quantity
    }));

    try {
      const response = await fetch('http://localhost:5047/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data || "Transaction processing failed.");
      }

      // Success Cycle
      setSuccessMessage("🚀 Order placed successfully! Check your hardware inventory profile.");
      clearCart();       // Wipe temporary frontend storage basket clean
      refreshBalance();  // Instantly force global Navbar cash capsule to sync down values
      
      // Navigate away back to store after a quick delay
      setTimeout(() => navigate('/'), 3000);

    } catch (err: any) {
      console.error("Checkout Exception Error:", err);
      setErrorMessage(err.message || "A network error occurred during your transaction processing loop.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (successMessage) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#1f2028', border: '1px solid #4caf50', borderRadius: '8px' }}>
        <h2 style={{ color: '#4caf50' }}>{successMessage}</h2>
        <p style={{ color: '#9ca3af' }}>Redirecting you back to the hardware hub...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#1f2028', border: '1px solid #2e303a', borderRadius: '8px' }}>
        <h2 style={{ color: '#9ca3af' }}>Your shopping basket is empty</h2>
        <button onClick={() => navigate('/')} style={{ marginTop: '15px', backgroundColor: '#7c3aed', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          Browse Components
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', alignItems: 'start' }}>
      
      {/* LEFT PANEL: LIST OF CART ITEMS */}
      <div style={{ backgroundColor: '#1f2028', border: '1px solid #2e303a', borderRadius: '8px', padding: '25px' }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#fff', borderBottom: '1px solid #2e303a', paddingBottom: '10px' }}>🛒 Review Your Basket</h3>
        
        {cart.map(item => (
          <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #16171d' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <img src={item.product.imageUrl} alt={item.product.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', backgroundColor: '#121212' }} />
              <div>
                <h4 style={{ margin: '0 0 4px 0', color: '#fff' }}>{item.product.name}</h4>
                <span style={{ color: '#9ca3af', fontSize: '14px' }}>Qty: {item.quantity} × ${item.product.price.toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              onClick={() => removeFromCart(item.product.id)}
              style={{ backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* RIGHT PANEL: TRANSACTION SUMMARY BOX */}
      <div style={{ backgroundColor: '#1f2028', border: '1px solid #2e303a', borderRadius: '8px', padding: '25px' }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#fff' }}>Summary</h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '12px 0', color: '#9ca3af' }}>
          <span>Your Wallet Capital:</span>
          <span style={{ color: '#4caf50', fontWeight: 'bold' }}>${balance.toFixed(2)}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '12px 0', color: '#9ca3af', borderBottom: '1px solid #2e303a', paddingBottom: '15px' }}>
          <span>Basket Total Cost:</span>
          <span style={{ color: '#fff', fontWeight: 'bold' }}>${cartTotal.toFixed(2)}</span>
        </div>

        {/* FINANCIAL GUARD WARNING BANNER */}
        {isWalletInsufficient && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '12px', borderRadius: '6px', fontSize: '13px', margin: '15px 0', lineHeight: '1.4' }}>
            ⚠️ <strong>Insufficient capital.</strong> You need an extra <strong>${(cartTotal - balance).toFixed(2)}</strong> to fulfill this order payload. Please top up your wallet funds inside your profile dashboard.
          </div>
        )}

        {errorMessage && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '12px', borderRadius: '6px', fontSize: '13px', margin: '15px 0' }}>
            Error: {errorMessage}
          </div>
        )}

        <button
          onClick={handleCheckout}
          disabled={isWalletInsufficient || isProcessing}
          style={{
            width: '100%',
            backgroundColor: isWalletInsufficient ? '#2e303a' : '#4caf50',
            color: isWalletInsufficient ? '#9ca3af' : 'white',
            border: 'none',
            padding: '12px',
            borderRadius: '6px',
            fontWeight: 'bold',
            fontSize: '16px',
            cursor: isWalletInsufficient || isProcessing ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s',
            marginTop: '10px'
          }}
        >
          {isProcessing ? 'Processing Transaction...' : 'Confirm Order & Pay'}
        </button>
      </div>

    </div>
  );
};