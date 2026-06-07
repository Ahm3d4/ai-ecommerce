// 📁 src/components/Navbar.tsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Navbar = () => {
  const { user, isAuthenticated, balance, logout } = useAuth(); 
  const navigate = useNavigate();
  const { getCartCount, searchQuery, setSearchQuery } = useCart(); 

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (window.location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <nav style={{ 
      width: '100%', 
      backgroundColor: '#16171d', 
      borderBottom: '1px solid #2e303a', 
      position: 'sticky', 
      top: 0, 
      zIndex: 1000, 
      boxSizing: 'border-box' 
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* LOGO LINK */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '22px' }}>⚙️</span>
          <h3 style={{ margin: 0, fontWeight: 600, letterSpacing: '-0.5px', color: '#f3f4f6' }}>
            NextGen<span style={{ color: '#c084fc' }}>Hardware</span>
          </h3>
        </Link>

        {/* SEARCH BAR INPUT CONTAINER */}
        <div style={{ flex: '0 1 400px', margin: '0 20px' }}>
          <input
            type="text"
            placeholder="Search components (e.g., RTX 5080, DDR5)..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={{
              width: '100%',
              backgroundColor: '#121212',
              border: '1px solid #2e303a',
              borderRadius: '6px',
              padding: '8px 14px',
              color: '#fff',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#646cff'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#2e303a'}
          />
        </div>

        {/* USER UTILITY CONTROLS */}
        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            
            {/* 🆕 STANDALONE PORTAL ROUTE LINK (Strictly visible only to verified Admin roles) */}
            {user?.role === 'Admin' && (
              <Link to="/admin" style={{
                textDecoration: 'none',
                backgroundColor: 'rgba(192, 132, 252, 0.1)',
                border: '1px solid #c084fc',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 'bold',
                color: '#c084fc',
                transition: 'all 0.2s ease-in-out'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#c084fc';
                e.currentTarget.style.color = '#16171d';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(192, 132, 252, 0.1)';
                e.currentTarget.style.color = '#c084fc';
              }}
              >
                🛡️ Admin Panel
              </Link>
            )}

            {/* REAL-TIME WALLET BALANCE PILL WIDGET */}
            <Link to="/profile" style={{ 
              textDecoration: 'none',
              backgroundColor: '#1f2028',
              border: '1px solid #2e303a',
              padding: '6px 14px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#4caf50',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#4caf50'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#2e303a'}
            >
              💳 <span>${balance.toFixed(2)}</span>
            </Link>

            {/* BASKET ITEM COUNT WIDGET */}
            <Link to="/cart" style={{
              textDecoration: 'none',
              backgroundColor: '#1f2028',
              border: '1px solid #2e303a',
              padding: '6px 14px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#c084fc',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#c084fc'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#2e303a'}
            >
              🛒 <span>({getCartCount()})</span>
            </Link>

            {/* USER PROFILE INFO COMPONENT DISPLAY LINK */}
            <Link to="/profile" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'end', cursor: 'pointer' }}>
              <span style={{ color: '#f3f4f6', fontSize: '14px', fontWeight: '500' }}>
                {user?.fullName} 👤
              </span>
              <span style={{ color: user?.role === 'Admin' ? '#c084fc' : '#9ca3af', fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                {user?.role || 'User'}
              </span>
            </Link>
            
            <button 
              onClick={handleLogout} 
              style={{ backgroundColor: '#1f2028', color: '#f3f4f6', border: '1px solid #2e303a', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', transition: 'all 0.2s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#d32f2f'; e.currentTarget.style.borderColor = '#d32f2f'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1f2028'; e.currentTarget.style.borderColor = '#2e303a'; }}
            >
              Logout
            </button>
          </div>
        ) : (
          <button style={{ backgroundColor: '#c084fc', color: '#16171d', border: 'none', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};