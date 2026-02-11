#!/bin/bash

# Create main.tsx
cat > frontend/src/main.tsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
EOF

# Create index.css
cat > frontend/src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-white text-gray-900;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
EOF

# Create App.tsx
cat > frontend/src/App.tsx << 'EOF'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/layout/Layout';
import Home from './features/products/pages/Home';
import ProductDetail from './features/products/pages/ProductDetail';
import Cart from './features/cart/pages/Cart';
import Checkout from './features/checkout/pages/Checkout';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import Orders from './features/orders/pages/Orders';
import OrderDetail from './features/orders/pages/OrderDetail';
import AdminDashboard from './features/admin/pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="products/:id" element={<ProductDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            
            <Route path="checkout" element={
              <ProtectedRoute><Checkout /></ProtectedRoute>
            } />
            <Route path="orders" element={
              <ProtectedRoute><Orders /></ProtectedRoute>
            } />
            <Route path="orders/:id" element={
              <ProtectedRoute><OrderDetail /></ProtectedRoute>
            } />
            <Route path="admin/*" element={
              <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
EOF

echo "Frontend base files created successfully!"

