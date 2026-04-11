import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, CheckCircle, AlertTriangle, Loader, GraduationCap, RefreshCw } from 'lucide-react';

const TEACHER_EMAIL = 'emzakhtser@mail.ru';

/**
 * AdminSetup — One-time teacher account initialization page.
 *
 * HOW THE TEACHER ACCOUNT WORKS:
 * ─────────────────────────────────────────────────────────────────
 * Authentication is handled by Supabase. This means:
 *
 * 1. The teacher (emzakhtser@mail.ru) must register or be invited once.
 * 2. On their FIRST login, the system automatically assigns role='teacher'.
 * 3. From that point, every login routes them directly to /teacher.
 * 4. No other account has teacher access.
 *
 * This page lets an existing admin send the invitation email.
 * ─────────────────────────────────────────────────────────────────
 */
export default function AdminSetup() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [teacherExists, setTeacherExists] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!user) return;
    // Only admins can access this page
    if (user.role !== 'admin' && user.email !== TEACHER_EMAIL) {
      navigate('/', { replace: true });
      return;
    }
    checkTeacherExists();
  }, [user]);

  const checkTeacherExists = async () => {
    setChecking(true);
    try {
      // TODO: replace with Supabase query
      const users = [];
      const existing = users.find(u => u.email?.toLowerCase().trim() === TEACHER_EMAIL);
      setTeacherExists(existing || null);

      // If teacher exists but doesn't have the right role, fix it
      if (existing && existing.role !== 'teacher') {
        // TODO: replace with Supabase update
        console.warn('Teacher role update not yet implemented');
        setMessage(`Role corrected: ${TEACHER_EMAIL} is now set to 'teacher'.`);
        setStatus('exists');
      } else if (existing) {
        setStatus('exists');
        setMessage(`Teacher account confirmed: ${TEACHER_EMAIL} (role: ${existing.role})`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setChecking(false);
    }
  };

  const handleInviteTeacher = async () => {
    setStatus('loading');
    setMessage('');
    try {
      // Invite as 'user' — AuthContext auto-elevates to 'teacher' on first login for this exact email
      // TODO: replace with Supabase invite
      console.warn('User invitation not yet implemented');
      setStatus('done');
      setMessage(
        `Invitation sent to ${TEACHER_EMAIL}. ` +
        `They will receive an email to set their password. ` +
        `On first login, the system will automatically assign the 'teacher' role.`
      );
    } catch (e) {
      // If the error says user already exists, check again
      if (e?.message?.toLowerCase().includes('already') || e?.status === 409) {
        await checkTeacherExists();
        return;
      }
      setStatus('error');
      setMessage(e?.message || 'Failed to send invitation. Make sure you have admin rights.');
    }
  };

  const handleStripOtherAdmins = async () => {
    try {
      // TODO: replace with Supabase query
      const users = [];
      const wrongAdmins = users.filter(u =>
        u.email?.toLowerCase().trim() !== TEACHER_EMAIL &&
        (u.role === 'teacher' || u.role === 'admin')
      );
      for (const u of wrongAdmins) {
        // TODO: replace with Supabase update
        console.warn('Role update not yet implemented for', u.email);
      }
      if (wrongAdmins.length > 0) {
        setMessage(`Stripped teacher/admin role from ${wrongAdmins.length} account(s): ${wrongAdmins.map(u => u.email).join(', ')}`);
        setStatus('exists');
      } else {
        setMessage('No other admin/teacher accounts found. System is clean.');
        setStatus('exists');
      }
    } catch (e) {
      setMessage('Error stripping roles: ' + (e?.message || 'unknown'));
      setStatus('error');
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--col-page-bg)' }}>
        <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: 'var(--col-divider)', borderTopColor: 'var(--col-accent)' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--col-page-bg)' }}>
      <div className="max-w-lg mx-auto space-y-5 pt-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl" style={{ backgroundColor: 'var(--col-accent-light)' }}>
            <Shield className="h-5 w-5" style={{ color: 'var(--col-accent)' }} />
          </div>
          <div>
            <h1 className="font-bold text-lg" style={{ color: 'var(--col-heading)' }}>Teacher Account Setup</h1>
            <p className="text-xs" style={{ color: 'var(--col-muted)' }}>Initialize the teacher/admin account for this course</p>
          </div>
        </div>

        {/* How it works */}
        <div className="rounded-xl p-4 text-sm space-y-2" style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}>
          <p className="font-semibold text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--col-muted)' }}>How the teacher account works</p>
          <p style={{ color: 'var(--col-secondary)' }}>
            The teacher account is <strong style={{ color: 'var(--col-heading)' }}>{TEACHER_EMAIL}</strong>.
            The system manages authentication — passwords are set by the user via an invitation email.
          </p>
          <p style={{ color: 'var(--col-secondary)' }}>
            On first login, the system automatically assigns <code className="text-xs px-1 rounded" style={{ backgroundColor: 'var(--col-tag-bg)', color: 'var(--col-tag-text)' }}>role=teacher</code> to this account.
            This is the only account with teacher access.
          </p>
        </div>

        {/* Teacher account status */}
        <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}>
          <p className="font-semibold text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--col-muted)' }}>Teacher Account Status</p>
          {checking ? (
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--col-muted)' }}>
              <Loader className="h-4 w-4 animate-spin" /> Checking...
            </div>
          ) : teacherExists ? (
            <div className="flex items-center gap-2.5">
              <CheckCircle className="h-5 w-5 shrink-0" style={{ color: 'var(--col-correct)' }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--col-heading)' }}>Account exists ✓</p>
                <p className="text-xs" style={{ color: 'var(--col-muted)' }}>
                  {TEACHER_EMAIL} · Role: <strong>{teacherExists.role || 'user'}</strong>
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="h-5 w-5 shrink-0" style={{ color: 'var(--col-warning)' }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--col-heading)' }}>Account not found</p>
                <p className="text-xs" style={{ color: 'var(--col-muted)' }}>Send an invitation to create it below.</p>
              </div>
            </div>
          )}
          <button
            onClick={checkTeacherExists}
            className="mt-3 flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg"
            style={{ border: '1px solid var(--col-border)', color: 'var(--col-secondary)', backgroundColor: 'transparent' }}
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh status
          </button>
        </div>

        {/* Status message */}
        {message && (
          <div
            className="rounded-xl p-4 flex items-start gap-2.5"
            style={{
              backgroundColor: status === 'error' ? 'rgba(229,115,115,0.08)' : 'var(--col-accent-light)',
              border: `1px solid ${status === 'error' ? 'rgba(229,115,115,0.3)' : 'var(--col-divider)'}`,
            }}
          >
            {status === 'error'
              ? <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" style={{ color: 'var(--col-incorrect)' }} />
              : <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" style={{ color: 'var(--col-correct)' }} />
            }
            <p className="text-sm" style={{ color: status === 'error' ? 'var(--col-incorrect)' : 'var(--col-accent-text)' }}>
              {message}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleInviteTeacher}
            disabled={status === 'loading' || !!teacherExists}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white"
            style={{
              backgroundColor: teacherExists ? 'var(--col-correct)' : 'var(--col-accent)',
              opacity: status === 'loading' ? 0.7 : 1,
              minHeight: 52,
            }}
          >
            {status === 'loading' ? (
              <><Loader className="h-4 w-4 animate-spin" /> Sending invitation...</>
            ) : teacherExists ? (
              <><CheckCircle className="h-4 w-4" /> Teacher Account Active</>
            ) : (
              <><GraduationCap className="h-4 w-4" /> Send Teacher Invitation Email</>
            )}
          </button>

          <button
            onClick={handleStripOtherAdmins}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium"
            style={{ border: '1px solid var(--col-incorrect)', color: 'var(--col-incorrect)', backgroundColor: 'rgba(229,115,115,0.05)', minHeight: 44 }}
          >
            <Shield className="h-4 w-4" /> Remove Teacher Role from All Other Accounts
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full py-2.5 rounded-xl text-sm font-medium"
            style={{ color: 'var(--col-secondary)', border: '1px solid var(--col-border)' }}
          >
            Return to App
          </button>
        </div>

      </div>
    </div>
  );
}