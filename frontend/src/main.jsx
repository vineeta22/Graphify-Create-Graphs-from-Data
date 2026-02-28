import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App1 from './App1.jsx'
import AuthPage from './pages/AuthPage.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'

function AppRouter() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}>
          <div style={{ fontSize: '3rem', animation: 'spin 1s linear infinite' }}>📊</div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem' }}>Loading Graphify...</p>
        </div>
      </div>
    );
  }

  // If user is logged in, show the main app; otherwise show auth page
  return user ? <App1 /> : <AuthPage />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </StrictMode>,
)
