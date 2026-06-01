// src/App.jsx

import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { ProgressProvider } from './context/ProgressContext';
import { ModeProvider } from './context/ModeContext';
import { ThemeProvider } from './context/ThemeContext';
import { units } from './data/courseData';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import UnitPage from './pages/UnitPage';
import Glossary from './pages/Glossary';
import Progress from './pages/Progress';
import EconomicWorld from './pages/EconomicWorld';
import TeacherDashboard from './pages/TeacherDashboard';
import Profile from './pages/Profile';
import AdminSetup from './pages/AdminSetup';
import ListeningLab from './pages/ListeningLab';
import TradeSimulator from './pages/TradeSimulator';
import Review from './pages/Review';
import MyMistakes from './pages/MyMistakes';
import LoginPage from './pages/LoginPage';
import UpdatePassword from './pages/UpdatePassword';
import InteractiveLab from './pages/InteractiveLab';

const AuthenticatedApp = () => {
  // navigateToLogin убрана — её нет в AuthContext и она ломала сборку
  // useNavigate() работает здесь потому что AuthenticatedApp находится внутри <Router>
  const { isLoadingAuth, isLoadingPublicSettings, authError, user } = useAuth();
  const navigate = useNavigate();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center"
        style={{ backgroundColor: 'var(--col-page-bg)' }}>
        <div className="w-8 h-8 border-4 rounded-full animate-spin"
          style={{ borderColor: 'var(--col-divider)', borderTopColor: 'var(--col-accent)' }} />
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') return <UserNotRegisteredError />;
    if (authError.type === 'auth_required') { navigate('/login'); return null; }
  }

  return (
    <ProgressProvider user={user} courseUnits={units}>
      <ModeProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/unit/:id" element={<UnitPage />} />
            <Route path="/glossary" element={<Glossary />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/listening-lab" element={<ListeningLab />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/review" element={<Review />} />
            <Route path="/mistakes" element={<MyMistakes />} />

            {/* Interactive Lab — hub for hands-on tools. The :toolId
                pattern is handled inside InteractiveLab via useParams. */}
            <Route path="/interactive-lab" element={<InteractiveLab />} />
            <Route path="/interactive-lab/:toolId" element={<InteractiveLab />} />

            {/* Legacy redirects — keep forever so bookmarks survive */}
            <Route path="/trade-simulator" element={<Navigate to="/interactive-lab/trade-simulator" replace />} />
            <Route path="/economic-world"  element={<Navigate to="/interactive-lab/economic-world"  replace />} />
          </Route>
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/admin-setup" element={<AdminSetup />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </ModeProvider>
    </ProgressProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;