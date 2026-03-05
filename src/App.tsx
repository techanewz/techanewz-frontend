import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from '@/contexts/UserContext';
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';
import { Home } from '@/pages/Home/Home';
import { Explore } from '@/pages/Explore/Explore';
import { Profile } from '@/pages/Profile/Profile';

// ============================================
// App Component
// ============================================

function App() {
  return (
    <ErrorBoundary>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/profile" element={<Profile />} />
            {/* Redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </UserProvider>
    </ErrorBoundary>
  );
}

export default App;
