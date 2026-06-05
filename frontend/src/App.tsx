// 📁 src/App.tsx
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // 🆕 Import Router elements
import { Navbar } from './components/Navbar';
import { Login } from './components/Login'; 
import { Register } from './components/Register'; 
import { Home } from './components/Home'; 
import { ProductDetails } from './components/ProductDetails'; // 🆕 Import Details Component
import { useAuth } from './context/AuthContext'; 
import { Profile } from './components/Profile';
import { Cart } from './components/Cart'; // 🆕 Import the Cart view component

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

  if (!isAuthenticated) {
    return (
      <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif', paddingTop: '40px' }}>
        <Navbar /> 
        {authView === 'login' ? (
          <div>
            <Login />
            <p style={{ textAlign: 'center', marginTop: '15px', color: '#aaa' }}><button onClick={() => setAuthView('register')} style={{ background: 'none', border: 'none', color: '#646cff', textDecoration: 'underline', cursor: 'pointer' }}>Create an account here</button></p>
          </div>
        ) : (
          <div>
            <Register onSwitchToLogin={() => setAuthView('login')} />
            <p style={{ textAlign: 'center', marginTop: '15px', color: '#aaa' }}><button onClick={() => setAuthView('login')} style={{ background: 'none', border: 'none', color: '#646cff', textDecoration: 'underline', cursor: 'pointer' }}>Sign into your profile</button></p>
          </div>
        )}
      </div>
    );
  }

  return (
    // 🆕 Wrap your authenticated dashboard area in BrowserRouter routing
    <BrowserRouter>
      <div style={{ backgroundColor: '#121212', minHeight: '100vh', width: '100%' }}>
        <Navbar /> 
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', width: '100%', boxSizing: 'border-box' }}>
          
          {/* 🆕 Define URL path mappings */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} /> {/* 🆕 Added checkout pathway */}
          </Routes>

        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;