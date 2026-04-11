import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin, user } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: 'var(--col-page-bg)' }}>
        <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: 'var(--col-divider)', borderTopColor: 'var(--col-accent)' }}></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
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
            <Route path="/economic-world" element={<EconomicWorld />} />
            <Route path="/listening-lab" element={<ListeningLab />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/trade-simulator" element={<TradeSimulator />} />
            <Route path="/review" element={<Review />} />
            <Route path="/mistakes" element={<MyMistakes />} />
          </Route>
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/admin-setup" element={<AdminSetup />} />
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
  )
}

export default App