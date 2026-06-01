import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useMode } from '../context/ModeContext';
import { Home, BookOpen, LayoutDashboard, BookText, BarChart3, Menu, X, GraduationCap, Eye, Globe, LogOut, User, Lock, Settings, Headphones, Ship, RotateCcw, XCircle, Sun, Moon, TrendingUp, FlaskConical } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Switch } from '@/components/ui/switch';
import TeacherPinModal from './TeacherPinModal';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../lib/AuthContext';
import { units } from '../data/courseData';

const TEACHER_EMAIL = 'emzakhtser@mail.ru';
// Normalized comparison — prevents whitespace/case-variant exploits
const isTeacherUser = (user) => user?.email?.toLowerCase().trim() === TEACHER_EMAIL;

const authNavItems = [
  { path: '/',               label: 'Welcome',         labelRu: 'Главная',          icon: Home },
  { path: '/dashboard',      label: 'Dashboard',       labelRu: 'Панель',           icon: LayoutDashboard },
  ...units.map(u => ({ path: `/unit/${u.id}`, label: `Unit ${u.id}`, labelRu: u.title, icon: BookOpen })),
  { path: '/glossary',        label: 'Glossary',         labelRu: 'Словарь',          icon: BookText },
  { path: '/interactive-lab', label: 'Interactive Lab',  labelRu: 'Лаборатория',      icon: FlaskConical },
  { path: '/progress',        label: 'Progress',         labelRu: 'Прогресс',         icon: BarChart3 },
  { path: '/review',          label: 'Smart Review',     labelRu: 'Повторение',       icon: RotateCcw },
  { path: '/listening-lab',   label: 'Listening Lab',    labelRu: 'Аудирование',      icon: Headphones },
  { path: '/mistakes',        label: 'My Mistakes',      labelRu: 'Мои ошибки',       icon: XCircle },
];

const publicNavItems = [
  { path: '/', label: 'Welcome', labelRu: 'Главная', icon: Home },
];

function UnitProgressMini({ unitId }) {
  const { getUnitProgress } = useProgress();
  const pct = getUnitProgress(unitId);
  const barRef = useRef(null);
  const barInView = useInView(barRef, { once: true });
  return (
    <div ref={barRef} className="mt-1 flex items-center gap-1.5">
      <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: 'var(--col-accent)' }}
          initial={{ width: 0 }}
          animate={{ width: barInView ? `${pct}%` : 0 }}
          transition={{ duration: 0.85, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
        />
      </div>
      <motion.span
        style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', minWidth: 22, textAlign: 'right' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: barInView ? 1 : 0 }}
        transition={{ duration: 0.4, delay: 0.7 }}
      >
        {pct}%
      </motion.span>
    </div>
  );
}

const THEME_ICONS = { light: Sun, dark: Moon, stock: TrendingUp };

function ThemeSwitcherMini() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="px-3 pb-3">
      <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(176,196,220,0.45)', textTransform: 'uppercase', paddingLeft: 7, marginBottom: 6 }}>Appearance</p>
      <div className="flex gap-1.5">
        {[{ id: 'light', icon: Sun, tip: 'Light' }, { id: 'dark', icon: Moon, tip: 'Dark' }, { id: 'stock', icon: TrendingUp, tip: 'Stock' }].map(t => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            title={t.tip}
            className="flex items-center justify-center rounded-lg transition-all"
            style={{ width: 32, height: 32, backgroundColor: theme === t.id ? 'var(--col-accent)' : 'rgba(255,255,255,0.07)', border: `1px solid ${theme === t.id ? 'var(--col-accent)' : 'rgba(255,255,255,0.1)'}` }}
          >
            <t.icon className="h-3.5 w-3.5" style={{ color: theme === t.id ? 'white' : 'rgba(255,255,255,0.45)' }} />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Layout() {
  const { isTeacherMode, requestTeacherMode } = useMode();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const isTeacher = isTeacherUser(user);
  const navItems = isAuthenticated ? authNavItems : publicNavItems;

  const NavItem = ({ item, mobile = false }) => {
    const active = isActive(item.path);
    const isUnit = item.path.startsWith('/unit/');
    const unitId = isUnit ? parseInt(item.path.split('/unit/')[1]) : null;
    return (
      <motion.div whileHover={{ x: active ? 0 : 2 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
        <Link
          to={item.path}
          onClick={() => mobile && setMobileOpen(false)}
          className="relative flex items-center gap-3 rounded-lg group overflow-hidden"
          style={{
            minHeight: mobile ? 56 : 44,
            padding: mobile ? '0 24px' : '0 10px',
            backgroundColor: active ? 'var(--col-sidebar-active)' : 'transparent',
            borderLeft: active ? '3px solid var(--col-accent)' : '3px solid transparent',
            color: active ? '#FFFFFF' : 'var(--col-sidebar-text)',
            fontWeight: active ? 600 : 400,
            fontSize: mobile ? 16 : 14,
            transition: 'background-color 0.18s, border-color 0.18s, color 0.18s',
          }}
          onMouseEnter={e => { if (!active) { e.currentTarget.style.backgroundColor = 'var(--col-sidebar-hover)'; } }}
          onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          {/* Active glow ring */}
          {active && (
            <motion.div
              className="absolute inset-0 rounded-lg pointer-events-none"
              style={{ background: 'rgba(94,158,137,0.06)', border: '1px solid rgba(94,158,137,0.18)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
          <motion.div
            animate={{ scale: active ? 1.1 : 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          >
            <item.icon className="h-4 w-4 shrink-0" style={{ color: active ? 'var(--col-accent)' : 'var(--col-sidebar-text)', opacity: active ? 1 : 0.65 }} />
          </motion.div>
          <div className="min-w-0 flex-1">
            <div className="truncate">{item.label}</div>
            <div style={{ fontSize: 10, color: active ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.28)', lineHeight: 1.3 }}>{item.labelRu}</div>
            {isUnit && <UnitProgressMini unitId={unitId} />}
          </div>
        </Link>
      </motion.div>
    );
  };

  const AuthButtons = ({ mobile = false }) => {
    if (isAuthenticated) return null;
    return (
      <div className={`${mobile ? 'px-5 py-4 space-y-2' : 'px-3 py-3 space-y-2'}`}>
        <div className="pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(176,196,220,0.45)', textTransform: 'uppercase', paddingLeft: mobile ? 0 : 7, marginBottom: 6 }}>Account</p>
          <button
            onClick={() => {
  window.location.href = '/login';
  if (mobile) setMobileOpen(false);
}}

            className="w-full flex items-center gap-3 rounded-lg transition-all"
            style={{
              minHeight: 44, padding: '0 10px',
              backgroundColor: 'var(--col-accent)', color: 'white',
              fontWeight: 600, fontSize: 14,
            }}  
          >
            <User className="h-4 w-4 shrink-0" />
            <div>
              <div>Log In / Register</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', lineHeight: 1.3 }}>Войти / Регистрация</div>
            </div>
          </button>
          <div
            className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ backgroundColor: 'rgba(94,158,137,0.08)', border: '1px solid rgba(94,158,137,0.2)' }}
          >
            <Lock className="h-3 w-3 shrink-0" style={{ color: 'var(--col-accent)' }} />
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>
              Course content is unlocked after registration.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const UserSection = ({ mobile = false }) => {
    if (!isAuthenticated || !user) return null;
    return (
      <div className={mobile ? 'px-5 py-3 border-t' : 'p-3 border-t'} style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-2.5 mb-3 px-1">
          <div className="flex items-center justify-center rounded-full shrink-0 text-xs font-bold text-white" style={{ width: 28, height: 28, backgroundColor: 'var(--col-accent)' }}>
            {(user.displayName || user.full_name || user.email || 'U')[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user.displayName || user.full_name || user.email}</p>
            {(user.displayName || user.full_name) && <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>{user.email}</p>}
          </div>
        </div>
        {isTeacher && (
          <Link
            to="/teacher"
            onClick={() => mobile && setMobileOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg mb-2 text-xs font-semibold transition-all"
            style={{ backgroundColor: 'rgba(94,158,137,0.15)', color: 'var(--col-accent)', border: '1px solid rgba(94,158,137,0.25)' }}
          >
            <GraduationCap className="h-3.5 w-3.5" /> Teacher Dashboard
          </Link>
        )}
        <Link
          to="/profile"
          onClick={() => mobile && setMobileOpen(false)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg mb-1 text-xs font-medium transition-all"
          style={{ color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'transparent' }}
        >
          <Settings className="h-3.5 w-3.5" /> Settings / Настройки
        </Link>
        <button
          onClick={() => {
            logout();
            if (mobile) setMobileOpen(false);
          }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all"
          style={{ color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'transparent' }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <LogOut className="h-3.5 w-3.5" /> Log Out / Выйти
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--col-page-bg)' }}>

      {/* ── Desktop Sidebar ── */}
      <aside
        className="hidden lg:flex flex-col w-60 fixed h-screen z-40 shrink-0"
        style={{ backgroundColor: 'var(--col-sidebar)', boxShadow: '2px 0 16px rgba(0,0,0,0.15)' }}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Link to="/" className="flex items-center gap-2.5 group">
              <motion.div
                className="flex items-center justify-center rounded-lg shrink-0"
                style={{ width: 34, height: 34, backgroundColor: 'var(--col-accent)' }}
                whileHover={{ scale: 1.08, rotate: 4 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <GraduationCap className="h-5 w-5 text-white" />
              </motion.div>
              <div>
                <h1 className="font-bold text-base tracking-tight text-white leading-tight">Adaptation</h1>
                <p style={{ fontSize: 10, color: 'var(--col-sidebar-text)', lineHeight: 1.4 }}>
                  Business English · A1–A2
                </p>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          <motion.p
            style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(176,196,220,0.45)', textTransform: 'uppercase', paddingLeft: 10, marginBottom: 6 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            Navigation
          </motion.p>
          <motion.div
            className="space-y-0.5"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.055, delayChildren: 0.25 } }
            }}
          >
            {navItems.map(item => (
              <motion.div
                key={item.path}
                variants={{
                  hidden: { opacity: 0, x: -14 },
                  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } }
                }}
              >
                <NavItem item={item} />
              </motion.div>
            ))}
          </motion.div>
        </nav>

        {/* Auth / User section */}
        {isAuthenticated ? (
          <>
            <ThemeSwitcherMini />
            {!isTeacher && (
              <div className="px-4 pb-2 pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                {isTeacherMode && (
                  <div
                    className="mb-3 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2"
                    style={{ backgroundColor: 'rgba(42,50,64,0.8)', color: '#A0B0C0', border: '1px solid rgba(160,176,192,0.2)' }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0" style={{ backgroundColor: 'var(--col-accent)' }} />
                    Teacher Mode Active
                  </div>
                )}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 shrink-0" style={{ color: 'var(--col-sidebar-text)', opacity: 0.7 }} />
                    <div>
                      <p className="text-xs font-medium text-white">Teacher Mode</p>
                      <p style={{ fontSize: 9, color: 'rgba(176,196,220,0.5)' }}>Режим преподавателя</p>
                    </div>
                  </div>
                  <Switch checked={isTeacherMode} onCheckedChange={requestTeacherMode} />
                </div>
              </div>
            )}
            <UserSection />
          </>
        ) : (
          <AuthButtons />
        )}
      </aside>

      {/* ── Mobile Header ── */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4"
        style={{ backgroundColor: 'var(--col-sidebar)', height: 56, boxShadow: '0 2px 12px rgba(0,0,0,0.2)' }}
      >
        <Link to="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center rounded-lg" style={{ width: 28, height: 28, backgroundColor: 'var(--col-accent)' }}>
            <GraduationCap className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-sm text-white tracking-tight">Adaptation</span>
        </Link>
        <div className="flex items-center gap-3">
          {isTeacherMode && (
            <span className="text-[10px] font-semibold px-2 py-1 rounded" style={{ backgroundColor: 'var(--col-accent)', color: 'white' }}>
              Teacher
            </span>
          )}
          {!isAuthenticated && (
            <button
              onClick={() => window.location.href = '/login'}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg"
              style={{ backgroundColor: 'var(--col-accent)', color: 'white', minHeight: 36 }}
            >
              Log In
            </button>
          )}
          <button
            onClick={() => setMobileOpen(true)}
            className="flex items-center justify-center text-white rounded-lg touch-target"
            style={{ width: 44, height: 44 }}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* ── Mobile Overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 z-50"
            style={{ backgroundColor: 'var(--col-overlay)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Mobile Drawer ── */}
      <motion.div
        className="lg:hidden fixed top-0 left-0 bottom-0 z-50 flex flex-col"
        style={{
          width: 'min(80vw, 300px)',
          backgroundColor: 'var(--col-sidebar)',
        }}
        initial={false}
        animate={{
          x: mobileOpen ? 0 : '-100%',
          boxShadow: mobileOpen ? '4px 0 32px rgba(0,0,0,0.35)' : 'none',
        }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center rounded-lg" style={{ width: 30, height: 30, backgroundColor: 'var(--col-accent)' }}>
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-sm text-white">Adaptation</span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center text-white rounded-lg touch-target"
            style={{ width: 44, height: 44 }}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isAuthenticated && user && (
          <div className="px-5 py-3 border-b flex items-center gap-2.5" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            <div className="flex items-center justify-center rounded-full shrink-0 text-xs font-bold text-white" style={{ width: 28, height: 28, backgroundColor: 'var(--col-accent)' }}>
              {(user.displayName || user.full_name || user.email || 'U')[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user.displayName || user.full_name || user.email}</p>
              {(user.displayName || user.full_name) && <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>{user.email}</p>}
            </div>
          </div>
        )}

        <nav className="flex-1 py-3 px-3 overflow-y-auto space-y-0.5">
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(176,196,220,0.4)', textTransform: 'uppercase', paddingLeft: 16, marginBottom: 8 }}>Navigation</p>
          {navItems.map(item => <NavItem key={item.path} item={item} mobile />)}
        </nav>

        {isAuthenticated ? (
          <div className="p-5 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            {!isTeacher && (
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-white">Teacher Mode</p>
                  <p className="text-xs" style={{ color: 'var(--col-sidebar-text)' }}>Режим преподавателя</p>
                </div>
                <Switch checked={isTeacherMode} onCheckedChange={requestTeacherMode} />
              </div>
            )}
            {isTeacher && (
              <Link
                to="/teacher"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-2 text-sm font-semibold"
                style={{ backgroundColor: 'rgba(94,158,137,0.15)', color: 'var(--col-accent)', border: '1px solid rgba(94,158,137,0.25)' }}
              >
                <GraduationCap className="h-4 w-4" /> Teacher Dashboard
              </Link>
            )}
            <Link
              to="/profile"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-2 text-sm font-medium"
              style={{ color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.12)', backgroundColor: 'transparent' }}
            >
              <Settings className="h-4 w-4" /> Settings
            </Link>
            <button
              onClick={() => {
                logout();
                setMobileOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium"
              style={{ color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.12)', backgroundColor: 'transparent' }}
            >
              <LogOut className="h-4 w-4" /> Log Out
            </button>
          </div>
        ) : (
          <div className="p-5 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            <button
              onClick={() => {
                window.location.href = '/login';
                setMobileOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white mb-2"
              style={{ backgroundColor: 'var(--col-accent)' }}
            >
              <User className="h-4 w-4" /> Log In / Register
            </button>
            <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Course content is locked until you sign in.
            </p>
          </div>
        )}
      </motion.div>

      <TeacherPinModal />

      {/* ── Main content ── */}
      <main className="flex-1 lg:ml-60 min-h-screen overflow-x-guard">
        {isTeacherMode && (
          <div
            className="hidden lg:flex items-center gap-2 px-6 py-2.5 text-xs font-semibold"
            style={{
              backgroundColor: 'var(--col-sec-teacher-bg)',
              color: 'var(--col-sec-teacher-text)',
              borderBottom: '1px solid rgba(160,176,192,0.15)',
              letterSpacing: '0.02em',
            }}
          >
            <GraduationCap className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--col-accent)' }} />
            Teacher Mode Active — все ответы и ключи видны
            <div className="ml-2 w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--col-accent)' }} />
          </div>
        )}
        <div className="pt-14 lg:pt-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}