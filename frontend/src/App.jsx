import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'

// Public Pages
import HomePage from './pages/public/HomePage'
import ProductsPage from './pages/public/ProductsPage'
import ProductDetailPage from './pages/public/ProductDetailPage'
import RetailerPage from './pages/public/RetailerPage'
import ContactPage from './pages/public/ContactPage'

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminInquiries from './pages/admin/AdminInquiries'
import AdminOrders from './pages/admin/AdminOrders'
import AdminRetailers from './pages/admin/AdminRetailers'
import AdminLayout from './components/layout/AdminLayout'

// Retailer Pages
import RetailerLogin from './pages/retailer/RetailerLogin'
import RetailerDashboard from './pages/retailer/RetailerDashboard'
import RetailerLayout from './components/layout/RetailerLayout'

function ProtectedRoute({ children, role }) {
  const { user } = useAuth()
  if (!user) return <Navigate to={role === 'admin' ? '/admin/login' : '/retailer/login'} />
  if (role && user.role !== role) return <Navigate to="/" />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000, style: { fontFamily: 'DM Sans', borderRadius: '12px' } }} />
        <Routes>
          {/* ── PUBLIC ROUTES ─────────────────────── */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/retailers" element={<RetailerPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* ── ADMIN ROUTES ──────────────────────── */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="inquiries" element={<AdminInquiries />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="retailers" element={<AdminRetailers />} />
          </Route>

          {/* ── RETAILER ROUTES ───────────────────── */}
          <Route path="/retailer/login" element={<RetailerLogin />} />
          <Route path="/retailer" element={
            <ProtectedRoute role="retailer"><RetailerLayout /></ProtectedRoute>
          }>
            <Route index element={<RetailerDashboard />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
