import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from '@/contexts/UserContext';
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';
import { Home } from '@/pages/Home/Home';
import { Explore } from '@/pages/Explore/Explore';
import { Profile } from '@/pages/Profile/Profile';
import { Login } from '@/pages/Login/Login';
import { useNativeBridge } from '@/hooks/useNativeBridge';

// ============================================
// Inner app — mounts after UserProvider is ready
// ============================================

function AppRoutes() {
  useNativeBridge(); // Listen for auth events from Expo shell
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

// ============================================
// App Component
// ============================================

function App() {
  return (
    <ErrorBoundary>
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </ErrorBoundary>
  );
}

export default App;
