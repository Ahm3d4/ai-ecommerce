// 📁 src/components/Profile.tsx
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { WalletView } from './WalletView'; // 🆕 Import the new wallet widget

export const Profile = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div style={{ padding: '40px', color: '#ff7961', textAlign: 'center' }}>
        <h3>Error: Profile session missing. Please log in again.</h3>
      </div>
    );
  }

  return (
    <div style={{ color: '#f3f4f6', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      {/* Navigation Row */}
      <button 
        onClick={() => navigate('/')} 
        style={{ backgroundColor: '#1f2028', color: '#f3f4f6', border: '1px solid #2e303a', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', marginBottom: '30px', fontWeight: '600', transition: 'all 0.2s' }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#c084fc'}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#2e303a'}
      >
        ← Return to Marketplace
      </button>

      {/* Profile Core Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '25px', backgroundColor: '#16171d', border: '1px solid #2e303a', borderRadius: '12px', padding: '30px', marginBottom: '30px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#c084fc', color: '#16171d', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '32px', fontWeight: 'bold' }}>
          {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', color: '#f3f4f6' }}>{user.fullName}</h1>
          <span style={{ display: 'inline-block', marginTop: '6px', backgroundColor: user.role === 'Admin' ? 'rgba(192, 132, 252, 0.15)' : 'rgba(255,255,255,0.05)', color: user.role === 'Admin' ? '#c084fc' : '#9ca3af', border: `1px solid ${user.role === 'Admin' ? 'rgba(192, 132, 252, 0.3)' : '#2e303a'}`, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
            {user.role === 'Admin' ? '🛡️ SYSTEM ADMINISTRATOR' : '🛒 CUSTOMER PROFILE'}
          </span>
        </div>
      </div>

      {/* Grid Meta Information Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#16171d', border: '1px solid #2e303a', borderRadius: '8px', padding: '20px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#9ca3af', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.5px' }}>Registered Email Address</h4>
          <p style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>{user.email}</p>
        </div>
        <div style={{ backgroundColor: '#16171d', border: '1px solid #2e303a', borderRadius: '8px', padding: '20px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#9ca3af', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.5px' }}>Internal Identifier Token String ID</h4>
          <code style={{ fontSize: '13px', color: '#c084fc' }}>USR-000{user.id || 'N/A'}</code>
        </div>
      </div>
      <WalletView />

      {/* Advanced Security Auditing Block */}
      <div style={{ backgroundColor: '#16171d', border: '1px solid #2e303a', borderRadius: '8px', padding: '25px' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', color: '#f3f4f6' }}>🔒 Dev Audit: Active Authorization Context</h3>
        <p style={{ color: '#9ca3af', fontSize: '14px', lineHeight: '1.5', marginBottom: '15px' }}>
          Below is a truncated copy of your locally mounted 512-bit JWT. This payload string cryptographically authorizes your API fetch handshakes with your .NET Core service environment.
        </p>
        <div style={{ backgroundColor: '#1f2028', border: '1px solid #2e303a', padding: '15px', borderRadius: '6px', overflowX: 'auto', whiteSpace: 'nowrap', fontSize: '12px', color: '#81c784', fontFamily: 'monospace' }}>
          Bearer {token ? `${token.substring(0, 35)}...${token.substring(token.length - 20)}` : 'No Token Injected'}
        </div>
        
        <hr style={{ border: 0, borderTop: '1px solid #2e303a', margin: '25px 0' }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>Terminate Platform Access</h4>
            <p style={{ margin: 0, color: '#9ca3af', fontSize: '12px' }}>Wipes browser token cache registry states instantly.</p>
          </div>
          <button 
            onClick={() => { logout(); navigate('/'); }}
            style={{ backgroundColor: 'rgba(211, 47, 47, 0.1)', color: '#ff7961', border: '1px solid rgba(211, 47, 47, 0.4)', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#d32f2f'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(211, 47, 47, 0.1)'; e.currentTarget.style.color = '#ff7961'; }}
          >
            Log Out Account
          </button>
        </div>
      </div>
    </div>
  );
};