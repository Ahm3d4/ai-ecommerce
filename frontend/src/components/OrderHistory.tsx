// 📁 src/components/OrderHistory.tsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface OrderItem {
  id: number;
  quantity: number;
  priceAtPurchase: number;
  product?: {
    name: string;
    imageUrl: string;
  };
}

interface Order {
  id: number;
  totalAmount: number;
  orderDate: string;
  orderItems: OrderItem[];
}

export const OrderHistory = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    fetch('http://localhost:5047/api/checkout/history', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load invoice history ledger:", err);
        setLoading(false);
      });
  }, [token]);

  if (loading) return <div style={{ color: '#9ca3af' }}>Loading invoice records...</div>;

  if (orders.length === 0) {
    return (
      <div style={{ padding: '20px', backgroundColor: '#1f2028', borderRadius: '8px', border: '1px solid #2e303a', color: '#9ca3af', textAlign: 'center' }}>
        No past purchase transactions found on this account.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#fff' }}>📋 Your Purchase Records</h3>
      
      {orders.map(order => (
        <div key={order.id} style={{ backgroundColor: '#1f2028', border: '1px solid #2e303a', borderRadius: '8px', overflow: 'hidden' }}>
          
          {/* INVOICE HEADER STRIP */}
          <div style={{ backgroundColor: '#16171d', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #2e303a' }}>
            <div>
              <span style={{ color: '#9ca3af', fontSize: '12px', display: 'block', textTransform: 'uppercase' }}>Order Placed</span>
              <span style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>{new Date(order.orderDate).toLocaleDateString()}</span>
            </div>
            <div>
              <span style={{ color: '#9ca3af', fontSize: '12px', display: 'block', textTransform: 'uppercase', textAlign: 'right' }}>Invoice ID</span>
              <span style={{ color: '#a78bfa', fontSize: '14px', fontWeight: 'bold' }}>#NXG-{order.id}</span>
            </div>
            <div>
              <span style={{ color: '#9ca3af', fontSize: '12px', display: 'block', textTransform: 'uppercase', textAlign: 'right' }}>Total Amount Paid</span>
              <span style={{ color: '#4caf50', fontSize: '16px', fontWeight: 'bold' }}>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* BOUGHT ITEMS SUB-LIST */}
          <div style={{ padding: '20px' }}>
            {order.orderItems.map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px 0', borderBottom: '1px solid #16171d' }}>
                <img 
                  src={item.product?.imageUrl || 'https://via.placeholder.com/50'} 
                  alt={item.product?.name} 
                  style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', backgroundColor: '#121212' }} 
                />
                <div style={{ flexGrow: 1 }}>
                  <h4 style={{ margin: '0 0 4px 0', color: '#fff', fontSize: '15px' }}>{item.product?.name || "Discontinued Component"}</h4>
                  <span style={{ color: '#9ca3af', fontSize: '13px' }}>
                    Quantity: {item.quantity} × <strong style={{ color: '#fff' }}>${item.priceAtPurchase.toFixed(2)}</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      ))}
    </div>
  );
};