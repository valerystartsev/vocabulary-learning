import { supabase } from '@/lib/supabaseClient';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Users, Search, ChevronRight, ArrowLeft, BarChart3, BookOpen, Brain, AlertTriangle, LogOut, CheckCircle, Clock } from 'lucide-react';

const TEACHER_EMAIL = 'emzakhtser@mail.ru';
// Access is granted ONLY to the exact canonical teacher email — normalized comparison prevents whitespace/case exploits
const isTeacherUser = (user) => user?.email?.toLowerCase().trim() === TEACHER_EMAIL;

function ProgressBar({ value, color = 'var(--col-accent)' }) {
  return (
    <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--col-divider)' }}>
      <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(value, 100)}%`, backgroundColor: color }} />
    </div>
  );
}

// Returns the best display name for a student: custom displayName > platform full_name > email
function getStudentName(student) {
  return student.displayName || student.full_name || student.email;
}

function StudentCard({ student, onClick }) {
  const prog = student.progress || {};
  const overall = prog.overallPercent || 0;
  const unit1 = prog.unit1Percent || 0;
  const unit2 = prog.unit2Percent || 0;
  const tests = prog.testsDoneCount || 0;
  const lastActive = prog.lastActiveAt;

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl p-5 transition-all"
      style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}
      onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--col-surface-secondary)'}
      onMouseOut={e => e.currentTarget.style.backgroundColor = 'var(--col-surface)'}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate" style={{ color: 'var(--col-heading)' }}>
            {getStudentName(student)}
          </p>
          <p className="text-xs truncate mt-0.5" style={{ color: 'var(--col-muted)' }}>{student.email}</p>
          <div className="flex flex-wrap gap-2 mt-0.5">
            <p className="text-xs" style={{ color: 'var(--col-tertiary)' }}>
              Joined {student.created_date ? new Date(student.created_date).toLocaleDateString('ru-RU') : '—'}
            </p>
            {lastActive && (
              <p className="text-xs" style={{ color: 'var(--col-tertiary)' }}>
                · Active {new Date(lastActive).toLocaleDateString('ru-RU')}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-lg font-bold" style={{ color: overall >= 70 ? 'var(--col-correct)' : 'var(--col-accent)' }}>
            {overall}%
          </span>
          <ChevronRight className="h-4 w-4" style={{ color: 'var(--col-muted)' }} />
        </div>
      </div>
      <ProgressBar value={overall} color={overall >= 70 ? 'var(--col-correct)' : 'var(--col-accent)'} />
      <div className="flex gap-4 mt-2.5 text-xs" style={{ color: 'var(--col-muted)' }}>
        <span>Unit 1: <strong style={{ color: 'var(--col-heading)' }}>{unit1}%</strong></span>
        <span>Unit 2: <strong style={{ color: 'var(--col-heading)' }}>{unit2}%</strong></span>
        <span>Tests: <strong style={{ color: 'var(--col-heading)' }}>{tests}/2</strong></span>
      </div>
    </button>
  );
}

function StudentDetail({ student, onBack, onRefreshStudent }) {
  const [localStudent, setLocalStudent] = React.useState(student);
  const [refreshing, setRefreshing] = React.useState(false);

  // On mount, immediately fetch the freshest DB record for this student
  React.useEffect(() => {
    let cancelled = false;
    const refresh = async () => {
  setRefreshing(true);
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, display_name, full_name, email, university_tracking, progress')
      .eq('id', student.id)
      .single();

    if (profile && !cancelled) {
      setLocalStudent({
        id: profile.id,
        email: profile.email || '—',
        displayName: profile.display_name || profile.full_name || profile.email || '—',
        isFinancialUniversity: profile.university_tracking,
        progress: profile.progress || {},
      });
    }
  } catch {}
  if (!cancelled) setRefreshing(false);
};
    refresh();
    return () => { cancelled = true; };
  }, [student.id]);

  // Use live-fetched data
  const s = localStudent;
  const prog = s.progress || {};
  const overall = prog.overallPercent || 0;
  const unit1 = prog.unit1Percent || 0;
  const unit2 = prog.unit2Percent || 0;
  const learned = prog.wordsLearnedCount || 0;
  const weak = prog.weakWordsCount || 0;
  const tests = prog.testsDoneCount || 0;
  const mediaCompleted = prog.mediaCompleted || 0;
  const exerciseScores = prog.exerciseScores || {};
  const exerciseBestScores = prog.exerciseBestScores || {};
  const exerciseAttempts = prog.exerciseAttempts || {};
  const allExerciseIds = [...new Set([...Object.keys(exerciseScores), ...Object.keys(exerciseBestScores)])];
  const scenarioScores = prog.scenarioScores || {};
  const crosswordScores = prog.crosswordScores || {};
  const learnedWords = Array.isArray(prog.learnedWords) ? prog.learnedWords : [];
  const weakWords = Array.isArray(prog.weakWords) ? prog.weakWords : [];

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition-all"
          style={{ color: 'var(--col-secondary)', border: '1px solid var(--col-border)', backgroundColor: 'var(--col-surface)', minHeight: 40 }}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Roster
        </button>
        {refreshing && (
          <span className="text-xs flex items-center gap-1.5" style={{ color: 'var(--col-muted)' }}>
            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Refreshing data...
          </span>
        )}
      </div>

      <div className="rounded-2xl p-5 mb-5" style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h2 className="font-bold text-lg" style={{ color: 'var(--col-heading)' }}>{getStudentName(s)}</h2>
            <p className="text-sm" style={{ color: 'var(--col-muted)' }}>{s.email}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--col-tertiary)' }}>
              Registered: {s.created_date ? new Date(s.created_date).toLocaleDateString('ru-RU') : '—'}
              {prog.lastActiveAt && ` · Last active: ${new Date(prog.lastActiveAt).toLocaleString('ru-RU')}`}
            </p>
          </div>
          {s.isFinancialUniversity && (
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold" style={{ backgroundColor: 'var(--col-accent-light)', color: 'var(--col-accent-text)', border: '1px solid var(--col-divider)' }}>
              ФинУниверситет
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Overall', value: `${overall}%`, icon: BarChart3, color: overall >= 70 ? 'var(--col-correct)' : 'var(--col-accent)' },
            { label: 'Unit 1', value: `${unit1}%`, icon: BookOpen, color: 'var(--col-accent)' },
            { label: 'Unit 2', value: `${unit2}%`, icon: BookOpen, color: '#3B6EA5' },
            { label: 'Tests Done', value: `${tests}/2`, icon: CheckCircle, color: tests === 2 ? 'var(--col-correct)' : 'var(--col-muted)' },
            { label: 'Words Learned', value: learned, icon: Brain, color: 'var(--col-correct)' },
            { label: 'Weak Words', value: weak, icon: AlertTriangle, color: 'var(--col-warning)' },
            { label: 'Media Done', value: mediaCompleted, icon: CheckCircle, color: mediaCompleted > 0 ? 'var(--col-correct)' : 'var(--col-muted)' },
            { label: 'Exercises Done', value: prog.completedExercisesCount || allExerciseIds.length, icon: CheckCircle, color: 'var(--col-accent)' },
          ].map((m, i) => (
            <div key={i} className="p-3 rounded-xl" style={{ backgroundColor: 'var(--col-surface-secondary)', border: '1px solid var(--col-border)' }}>
              <div className="flex items-center gap-1.5 mb-1">
                <m.icon className="h-3.5 w-3.5" style={{ color: m.color }} />
                <p className="text-xs" style={{ color: 'var(--col-muted)' }}>{m.label}</p>
              </div>
              <p className="font-bold text-lg" style={{ color: 'var(--col-heading)' }}>{m.value}</p>
            </div>
          ))}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--col-muted)' }}>Unit 1</p>
          <ProgressBar value={unit1} />
          <p className="text-xs font-semibold uppercase tracking-wider mb-1 mt-3" style={{ color: 'var(--col-muted)' }}>Unit 2</p>
          <ProgressBar value={unit2} color="#3B6EA5" />
          <p className="text-xs font-semibold uppercase tracking-wider mb-1 mt-3" style={{ color: 'var(--col-muted)' }}>Overall</p>
          <ProgressBar value={overall} color={overall >= 70 ? 'var(--col-correct)' : 'var(--col-accent)'} />
        </div>
      </div>

      {/* Exercise performance table */}
      {allExerciseIds.length > 0 && (
        <div className="rounded-2xl overflow-hidden mb-4" style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--col-border)' }}>
            <h3 className="font-semibold text-sm" style={{ color: 'var(--col-heading)' }}>Exercise Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ backgroundColor: 'var(--col-surface-secondary)', borderBottom: '1px solid var(--col-border)' }}>
                  <th className="text-left px-5 py-2.5 font-semibold" style={{ color: 'var(--col-muted)' }}>Exercise</th>
                  <th className="text-center px-3 py-2.5 font-semibold" style={{ color: 'var(--col-muted)' }}>Attempts</th>
                  <th className="text-center px-3 py-2.5 font-semibold" style={{ color: 'var(--col-muted)' }}>Latest</th>
                  <th className="text-center px-3 py-2.5 font-semibold" style={{ color: 'var(--col-muted)' }}>Best</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--col-border)' }}>
                {allExerciseIds.map(id => {
                  const latest = exerciseScores[id];
                  const best = exerciseBestScores[id] ?? latest;
                  const attempts = exerciseAttempts[id] || 1;
                  const scoreColor = best >= 70 ? 'var(--col-correct)' : 'var(--col-warning)';
                  return (
                    <tr key={id}>
                      <td className="px-5 py-3" style={{ color: 'var(--col-body)' }}>{id.replace(/_/g, ' ')}</td>
                      <td className="px-3 py-3 text-center font-semibold" style={{ color: 'var(--col-secondary)' }}>{attempts}</td>
                      <td className="px-3 py-3 text-center">
                        <span className="font-bold px-2 py-0.5 rounded" style={{ backgroundColor: latest >= 70 ? 'var(--col-accent-light)' : 'rgba(199,154,74,0.1)', color: latest >= 70 ? 'var(--col-accent-text)' : 'var(--col-warning)' }}>
                          {latest}%
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="font-bold px-2 py-0.5 rounded" style={{ backgroundColor: best >= 70 ? '#D0EDD8' : '#FEF3C7', color: scoreColor }}>
                          {best}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Scenario & Crossword */}
      {(Object.keys(scenarioScores).length > 0 || Object.keys(crosswordScores).length > 0) && (
        <div className="rounded-2xl overflow-hidden mb-4" style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--col-border)' }}>
            <h3 className="font-semibold text-sm" style={{ color: 'var(--col-heading)' }}>Other Tasks</h3>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--col-border)' }}>
            {Object.entries(scenarioScores).map(([unitId, sc]) => (
              <div key={`scenario-${unitId}`} className="flex items-center justify-between px-5 py-3">
                <p className="text-sm" style={{ color: 'var(--col-body)' }}>Unit {unitId} — Scenario</p>
                <span className="text-xs font-bold px-2 py-1 rounded" style={{ backgroundColor: (sc?.score || 0) >= 70 ? 'var(--col-accent-light)' : 'rgba(199,154,74,0.1)', color: (sc?.score || 0) >= 70 ? 'var(--col-accent-text)' : 'var(--col-warning)' }}>
                  {sc?.score || 0}% · {sc?.result || ''}
                </span>
              </div>
            ))}
            {Object.entries(crosswordScores).map(([unitId]) => (
              <div key={`crossword-${unitId}`} className="flex items-center justify-between px-5 py-3">
                <p className="text-sm" style={{ color: 'var(--col-body)' }}>Unit {unitId} — Crossword</p>
                <span className="text-xs font-bold px-2 py-1 rounded" style={{ backgroundColor: 'var(--col-accent-light)', color: 'var(--col-accent-text)' }}>
                  Done
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vocabulary */}
      {(learnedWords.length > 0 || weakWords.length > 0) && (
        <div className="rounded-2xl p-5 mb-4" style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}>
          <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--col-heading)' }}>Vocabulary Status</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl" style={{ backgroundColor: '#D0EDD820', border: '1px solid #7ABD9040' }}>
              <p className="text-xs font-semibold mb-1" style={{ color: '#2A6A40' }}>Learned ({learnedWords.length})</p>
              <p className="text-xs" style={{ color: 'var(--col-secondary)' }}>{learnedWords.slice(0, 5).join(', ')}{learnedWords.length > 5 ? ` +${learnedWords.length - 5} more` : ''}</p>
            </div>
            <div className="p-3 rounded-xl" style={{ backgroundColor: '#FEF3C720', border: '1px solid #D4A82040' }}>
              <p className="text-xs font-semibold mb-1" style={{ color: '#B87820' }}>Weak ({weakWords.length})</p>
              <p className="text-xs" style={{ color: 'var(--col-secondary)' }}>{weakWords.slice(0, 5).join(', ')}{weakWords.length > 5 ? ` +${weakWords.length - 5} more` : ''}</p>
            </div>
          </div>
        </div>
      )}

      {allExerciseIds.length === 0 && Object.keys(scenarioScores).length === 0 && (
        <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}>
          <p className="text-sm" style={{ color: 'var(--col-muted)' }}>No task data recorded yet.</p>
        </div>
      )}
    </div>
  );
}

export default function TeacherDashboard() {
  const { user, logout, isLoadingAuth } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    // Wait until auth is fully resolved before making any routing decisions
    if (isLoadingAuth) return;
    if (!user) {
      navigate('/', { replace: true });
      return;
    }
    if (!isTeacherUser(user)) {
      setAccessDenied(true);
      setLoading(false);
      return;
    }
    loadStudents();
  }, [user, isLoadingAuth]);

  const loadStudents = async () => {
  try {
    setLoading(true);

    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, display_name, full_name, email, university_tracking, progress')
      .eq('university_tracking', true);

    if (error) throw error;

    const tracked = (profiles || [])
      .filter(p => p.email !== 'emzakhtser@mail.ru')
      .map(p => ({
        id: p.id,
        email: p.email || '—',
        displayName: p.display_name || p.full_name || p.email || '—',
        isFinancialUniversity: p.university_tracking,
        progress: p.progress || {},
      }))
      .sort((a, b) => {
        const aTime = a.progress?.lastActiveAt ? new Date(a.progress.lastActiveAt).getTime() : 0;
        const bTime = b.progress?.lastActiveAt ? new Date(b.progress.lastActiveAt).getTime() : 0;
        return bTime - aTime;
      });

    setStudents(tracked);
  } catch (e) {
    console.error('Failed to load students:', e);
  } finally {
    setLoading(false);
  }
};

  // Show spinner while auth is still resolving — prevents flash of wrong content
  if (isLoadingAuth || (!user && !accessDenied)) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--col-page-bg)' }}>
        <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: 'var(--col-divider)', borderTopColor: 'var(--col-accent)' }} />
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: 'var(--col-page-bg)' }}>
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(229,115,115,0.1)' }}>
            <AlertTriangle className="h-6 w-6" style={{ color: 'var(--col-incorrect)' }} />
          </div>
          <h2 className="font-bold text-lg mb-2" style={{ color: 'var(--col-heading)' }}>Access Denied</h2>
          <p className="text-sm mb-4" style={{ color: 'var(--col-secondary)' }}>This area is for the teacher only.</p>
          <Link to="/dashboard">
            <button className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: 'var(--col-accent)' }}>
              Back to Course
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const filtered = students.filter(st => {
    const q = search.toLowerCase();
    return (
      (st.displayName || '').toLowerCase().includes(q) ||
      (st.full_name || '').toLowerCase().includes(q) ||
      (st.email || '').toLowerCase().includes(q)
    );
  });

  const avgProgress = students.length > 0
    ? Math.round(students.reduce((acc, st) => acc + (st.progress?.overallPercent || 0), 0) / students.length)
    : 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--col-page-bg)' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-30 px-5 md:px-8 flex items-center justify-between"
        style={{ backgroundColor: 'var(--col-sidebar)', height: 60, boxShadow: '0 2px 12px rgba(0,0,0,0.2)' }}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center rounded-lg" style={{ width: 32, height: 32, backgroundColor: 'var(--col-accent)' }}>
            <GraduationCap className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">Teacher Dashboard</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Панель преподавателя</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs hidden sm:block" style={{ color: 'rgba(255,255,255,0.45)' }}>{user.email}</span>
          <button
            onClick={() => logout()}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg transition-all"
            style={{ color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.12)', minHeight: 36 }}
          >
            <LogOut className="h-3.5 w-3.5" /> Log Out
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        {selectedStudent ? (
          <StudentDetail
            student={selectedStudent}
            onBack={() => setSelectedStudent(null)}
          />
        ) : (
          <>
            {/* Overview */}
            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <h1 className="font-bold text-2xl mb-0.5" style={{ color: 'var(--col-heading)', letterSpacing: '-0.4px' }}>
                  Adaptation — Teacher Dashboard
                </h1>
                <p className="text-sm" style={{ color: 'var(--col-muted)' }}>Панель преподавателя · Финансовый университет</p>
                <p className="text-xs mt-1" style={{ color: 'var(--col-tertiary)' }}>
                  Logged in as: <strong style={{ color: 'var(--col-accent-text)' }}>{user.email}</strong> · Role: {user.role || 'teacher'}
                </p>
              </div>
              <button
                onClick={loadStudents}
                disabled={loading}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl shrink-0 transition-all"
                style={{ border: '1px solid var(--col-border)', color: 'var(--col-secondary)', backgroundColor: 'var(--col-surface)', minHeight: 40 }}
                title="Refresh student list"
              >
                <svg className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 mb-7">
              {[
                { label: 'Tracked Students', labelRu: 'Студентов', value: students.length, icon: Users },
                { label: 'Avg. Progress', labelRu: 'Средний прогресс', value: `${avgProgress}%`, icon: BarChart3 },
                { label: 'With Test Scores', labelRu: 'Тесты пройдены', value: students.filter(st => (st.progress?.testsDoneCount || 0) > 0).length, icon: CheckCircle },
              ].map((card, i) => (
                <div key={i} className="p-5 rounded-2xl" style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--col-muted)' }}>{card.label}</p>
                      <p className="text-xs" style={{ color: 'var(--col-tertiary)' }}>{card.labelRu}</p>
                    </div>
                    <div className="p-2 rounded-xl" style={{ backgroundColor: 'var(--col-accent-light)' }}>
                      <card.icon className="h-4 w-4" style={{ color: 'var(--col-accent)' }} />
                    </div>
                  </div>
                  <p className="font-bold text-2xl" style={{ color: 'var(--col-heading)' }}>{card.value}</p>
                </div>
              ))}
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--col-muted)' }} />
              <input
                type="text"
                placeholder="Search students by name or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-3 rounded-xl text-sm"
                style={{
                  backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)',
                  color: 'var(--col-body)', outline: 'none'
                }}
              />
            </div>

            {/* Students roster */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: 'var(--col-divider)', borderTopColor: 'var(--col-accent)' }} />
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl p-10 text-center" style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}>
                <Users className="h-10 w-10 mx-auto mb-3" style={{ color: 'var(--col-muted)' }} />
                <p className="font-semibold text-sm mb-1" style={{ color: 'var(--col-heading)' }}>
                  {search ? 'No students match your search.' : 'No tracked students yet.'}
                </p>
                <p className="text-xs" style={{ color: 'var(--col-muted)' }}>
                  Only students who checked "Финансовый университет" appear here.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-3">
                {filtered.map(st => (
                  <StudentCard key={st.id} student={st} onClick={() => setSelectedStudent(st)} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}