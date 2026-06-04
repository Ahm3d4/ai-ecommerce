import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CartProvider } from './context/CartContext';
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx' // 1. Import your new provider

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider> {/* 2. Wrap your app inside the provider box */}
      <CartProvider>
      <App />
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)