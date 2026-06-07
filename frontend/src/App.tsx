// 📁 src/App.tsx
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; 
import { Navbar } from './components/Navbar';
import { Login } from './components/Login'; 
import { Register } from './components/Register'; 
import { Home } from './components/Home'; 
import { ProductDetails } from './components/ProductDetails'; 
import { useAuth } from './context/AuthContext'; 
import { Profile } from './components/Profile';
import { Cart } from './components/Cart'; 
import { AdminPanel } from './components/AdminPanel'; 

const AdminRouteProtection = ({ children }: { children: React.JSX.Element }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || user?.role !== 'Admin') {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#121212', color: '#fff', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        Initializing security...
      </div>
    );
  }

  // 🟩 CASE 1: USER IS NOT LOGGED IN (Wrapped in BrowserRouter so Navbar never crashes)
  if (!isAuthenticated) {
    return (
      <BrowserRouter>
        <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif', paddingTop: '40px' }}>
          <Navbar /> 
          {authView === 'login' ? (
            <div>
              <Login />
              <p style={{ textAlign: 'center', marginTop: '15px', color: '#aaa' }}>
                <button onClick={() => setAuthView('register')} style={{ background: 'none', border: 'none', color: '#646cff', textDecoration: 'underline', cursor: 'pointer' }}>
                  Create an account here
                </button>
              </p>
            </div>
          ) : (
            <div>
              <Register onSwitchToLogin={() => setAuthView('login')} />
              <p style={{ textAlign: 'center', marginTop: '15px', color: '#aaa' }}>
                <button onClick={() => setAuthView('login')} style={{ background: 'none', border: 'none', color: '#646cff', textDecoration: 'underline', cursor: 'pointer' }}>
                  Sign into your profile
                </button>
              </p>
            </div>
          )}
        </div>
      </BrowserRouter>
    );
  }

  // 🟩 CASE 2: USER IS LOGGED IN
  return (
    <BrowserRouter>
      <div style={{ backgroundColor: '#121212', minHeight: '100vh', width: '100%' }}>
        <Navbar /> 
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', width: '100%', boxSizing: 'border-box' }}>
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} /> 
            <Route 
              path="/admin" 
              element={<AdminRouteProtection><AdminPanel /></AdminRouteProtection>} 
            />
          </Routes>

        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;