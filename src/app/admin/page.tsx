'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import {
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
  Clock,
  ExternalLink,
  Image as ImageIcon,
  Phone,
  Search,
  Lock,
  Unlock,
  KeyRound,
  ShieldAlert,
  Eye,
  EyeOff,
} from 'lucide-react';

interface BookingRecord {
  id: string | number;
  created_at?: string;
  full_name: string;
  phone: string;
  selected_service: string;
  tx_ref?: string | null;
  payment_method?: string | null;
  payment_reference?: string | null;
  payment_screenshot_url?: string | null;
  payment_status?: string | null;
}

interface AuthRecord {
  passwordHash: string;
  recoveryCodeHash: string;
}

const LOCAL_AUTH_KEY = 'dawit_services_admin_auth_v1';
const SESSION_UNLOCK_KEY = 'dawit_services_admin_unlocked_v1';

function validateStrongPassword(pw: string): string | null {
  if (pw.length < 10) return 'Password must be at least 10 characters long.';
  if (!/[A-Z]/.test(pw)) return 'Include at least 1 uppercase letter (A-Z).';
  if (!/[a-z]/.test(pw)) return 'Include at least 1 lowercase letter (a-z).';
  if (!/[0-9]/.test(pw)) return 'Include at least 1 number (0-9).';
  if (!/[^A-Za-z0-9]/.test(pw)) return 'Include at least 1 special character (e.g. !@#$%).';
  return null;
}

async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default function AdminPortalPage() {
  const [authLoading, setAuthLoading] = useState(true);
  const [authRecord, setAuthRecord] = useState<AuthRecord | null>(null);
  const [unlocked, setUnlocked] = useState(false);

  // Auth screen mode: 'create' | 'login' | 'forgot'
  const [mode, setMode] = useState<'create' | 'login' | 'forgot'>('login');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [recoveryCodeInput, setRecoveryCodeInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authInfo, setAuthInfo] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Change password modal / panel when unlocked
  const [changePwOpen, setChangePwOpen] = useState(false);
  const [currentPwInput, setCurrentPwInput] = useState('');
  const [newPwInput, setNewPwInput] = useState('');
  const [confirmNewPwInput, setConfirmNewPwInput] = useState('');
  const [newRecoveryCodeInput, setNewRecoveryCodeInput] = useState('');
  const [changePwError, setChangePwError] = useState('');
  const [changePwSuccess, setChangePwSuccess] = useState('');

  // Bookings state
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const readAuthRecord = useCallback(async (): Promise<AuthRecord | null> => {
    try {
      const { data, error } = await supabase
        .from('admin_auth')
        .select('password_hash, recovery_code_hash')
        .eq('id', 'primary_admin')
        .maybeSingle();

      if (!error && data && data.password_hash) {
        return {
          passwordHash: data.password_hash,
          recoveryCodeHash: data.recovery_code_hash || '',
        };
      }
    } catch {
      // Fall back to local storage
    }

    try {
      const raw = localStorage.getItem(LOCAL_AUTH_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AuthRecord;
        if (parsed?.passwordHash) return parsed;
      }
    } catch {
      // Ignore storage read errors
    }
    return null;
  }, []);

  const saveAuthRecord = useCallback(async (record: AuthRecord) => {
    try {
      localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(record));
    } catch {
      // Ignore storage write errors
    }

    try {
      await supabase.from('admin_auth').upsert(
        {
          id: 'primary_admin',
          password_hash: record.passwordHash,
          recovery_code_hash: record.recoveryCodeHash,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );
    } catch {
      // Local backup remains saved
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      const existing = await readAuthRecord();
      if (!active) return;
      setAuthRecord(existing);
      setMode(existing ? 'login' : 'create');

      try {
        if (sessionStorage.getItem(SESSION_UNLOCK_KEY) === 'true' && existing) {
          setUnlocked(true);
        }
      } catch {
        // Ignore session storage errors
      }
      setAuthLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [readAuthRecord]);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('id', { ascending: false });

    setLoading(false);
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    setBookings((data as BookingRecord[]) || []);
  }, []);

  useEffect(() => {
    if (unlocked) {
      loadBookings();
    }
  }, [unlocked, loadBookings]);

  const grantSession = () => {
    setUnlocked(true);
    try {
      sessionStorage.setItem(SESSION_UNLOCK_KEY, 'true');
    } catch {
      // Ignore
    }
    setPasswordInput('');
    setConfirmPasswordInput('');
    setRecoveryCodeInput('');
    setAuthError('');
    setAuthInfo('');
  };

  const handleLockPortal = () => {
    setUnlocked(false);
    setChangePwOpen(false);
    setMode('login');
    try {
      sessionStorage.removeItem(SESSION_UNLOCK_KEY);
    } catch {
      // Ignore
    }
  };

  const handleCreatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthInfo('');

    const pwErr = validateStrongPassword(passwordInput);
    if (pwErr) {
      setAuthError(pwErr);
      return;
    }
    if (passwordInput !== confirmPasswordInput) {
      setAuthError('Passwords do not match.');
      return;
    }
    if (recoveryCodeInput.trim().length < 4) {
      setAuthError('Please set a recovery PIN or secret phrase (at least 4 characters) in case you forget your password.');
      return;
    }

    setAuthSubmitting(true);
    const passwordHash = await sha256(passwordInput);
    const recoveryCodeHash = await sha256(recoveryCodeInput.trim().toLowerCase());
    const record: AuthRecord = { passwordHash, recoveryCodeHash };
    await saveAuthRecord(record);
    setAuthRecord(record);
    setAuthSubmitting(false);
    grantSession();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthInfo('');

    if (!authRecord) {
      setMode('create');
      return;
    }

    setAuthSubmitting(true);
    const enteredHash = await sha256(passwordInput);
    setAuthSubmitting(false);

    if (enteredHash !== authRecord.passwordHash) {
      setAuthError('Incorrect admin password.');
      return;
    }
    grantSession();
  };

  const handleForgotReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthInfo('');

    if (!authRecord?.recoveryCodeHash) {
      setAuthError('No recovery code is set on this account.');
      return;
    }

    const enteredRecoveryHash = await sha256(recoveryCodeInput.trim().toLowerCase());
    if (enteredRecoveryHash !== authRecord.recoveryCodeHash) {
      setAuthError('Recovery code does not match.');
      return;
    }

    const pwErr = validateStrongPassword(passwordInput);
    if (pwErr) {
      setAuthError(pwErr);
      return;
    }
    if (passwordInput !== confirmPasswordInput) {
      setAuthError('New passwords do not match.');
      return;
    }

    setAuthSubmitting(true);
    const newHash = await sha256(passwordInput);
    const updated: AuthRecord = {
      passwordHash: newHash,
      recoveryCodeHash: authRecord.recoveryCodeHash,
    };
    await saveAuthRecord(updated);
    setAuthRecord(updated);
    setAuthSubmitting(false);
    setAuthInfo('Password reset successfully.');
    grantSession();
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePwError('');
    setChangePwSuccess('');

    if (!authRecord) return;
    const currentHash = await sha256(currentPwInput);
    if (currentHash !== authRecord.passwordHash) {
      setChangePwError('Current password is incorrect.');
      return;
    }

    const pwErr = validateStrongPassword(newPwInput);
    if (pwErr) {
      setChangePwError(pwErr);
      return;
    }
    if (newPwInput !== confirmNewPwInput) {
      setChangePwError('New passwords do not match.');
      return;
    }

    const nextHash = await sha256(newPwInput);
    const nextRecoveryHash = newRecoveryCodeInput.trim()
      ? await sha256(newRecoveryCodeInput.trim().toLowerCase())
      : authRecord.recoveryCodeHash;

    const updated: AuthRecord = {
      passwordHash: nextHash,
      recoveryCodeHash: nextRecoveryHash,
    };
    await saveAuthRecord(updated);
    setAuthRecord(updated);
    setCurrentPwInput('');
    setNewPwInput('');
    setConfirmNewPwInput('');
    setNewRecoveryCodeInput('');
    setChangePwSuccess('Admin password updated.');
  };

  const extractScreenshotUrl = (row: BookingRecord): string | null => {
    if (row.payment_screenshot_url) return row.payment_screenshot_url;
    if (row.tx_ref && row.tx_ref.includes('Screenshot: ')) {
      const part = row.tx_ref.split('Screenshot: ')[1]?.trim();
      if (part && part.startsWith('http')) return part.split(' ')[0];
    }
    return null;
  };

  const isVerified = (row: BookingRecord): boolean => {
    return row.payment_status === 'verified';
  };

  const toggleVerification = async (row: BookingRecord) => {
    setUpdatingId(row.id);
    const nextStatus = isVerified(row) ? 'pending_verification' : 'verified';

    const { error } = await supabase
      .from('bookings')
      .update({ payment_status: nextStatus })
      .eq('id', row.id);

    setUpdatingId(null);
    if (error) {
      setErrorMsg('Could not update status: ' + error.message);
      return;
    }

    setBookings((prev) =>
      prev.map((item) => (item.id === row.id ? { ...item, payment_status: nextStatus } : item))
    );
  };

  const filteredBookings = bookings.filter((row) => {
    const verified = isVerified(row);
    if (statusFilter === 'verified' && !verified) return false;
    if (statusFilter === 'pending' && verified) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (row.full_name || '').toLowerCase().includes(q) ||
      (row.phone || '').toLowerCase().includes(q) ||
      (row.selected_service || '').toLowerCase().includes(q) ||
      (row.payment_reference || '').toLowerCase().includes(q) ||
      (row.tx_ref || '').toLowerCase().includes(q)
    );
  });

  const verifiedCount = bookings.filter(isVerified).length;
  const pendingCount = bookings.length - verifiedCount;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-300 flex items-center justify-center p-6 text-sm">
        Checking admin security...
      </div>
    );
  }

  // LOCKED SCREEN: CREATE, LOGIN, OR FORGOT PASSWORD
  if (!unlocked) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 flex items-center justify-center font-sans">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to DAWIT SERVICES</span>
            </Link>

            <div className="flex items-center gap-2.5 pt-1">
              <div className="p-2.5 rounded-xl bg-blue-500/15 border border-blue-500/30">
                <Lock className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-white">
                  {mode === 'create'
                    ? 'Create Admin Password'
                    : mode === 'forgot'
                    ? 'Reset Forgotten Password'
                    : 'Admin Portal Locked'}
                </h1>
                <p className="text-xs text-slate-400">
                  {mode === 'create'
                    ? 'Set a strong password and recovery code to protect your admin portal.'
                    : mode === 'forgot'
                    ? 'Enter your recovery code to set a new strong password.'
                    : 'Enter your admin password to view requests and verify 200 ETB payments.'}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-[11px] text-slate-300 space-y-1">
            <p className="font-bold text-blue-300">Strong password rules:</p>
            <p>• At least 10 characters • Uppercase & lowercase letters • At least 1 number • At least 1 symbol (!@#$%)</p>
          </div>

          {authError && (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-200 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {authInfo && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-200">
              {authInfo}
            </div>
          )}

          {mode === 'create' && (
            <form onSubmit={handleCreatePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Create Strong Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="e.g. Dawit@2026Secure!"
                    required
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 pr-10 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-white absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Recovery Code / Secret Answer (for Forgot Password)
                </label>
                <input
                  type="text"
                  value={recoveryCodeInput}
                  onChange={(e) => setRecoveryCodeInput(e.target.value)}
                  placeholder="e.g. Axum-2026 or your secret PIN"
                  required
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition cursor-pointer"
              >
                {authSubmitting ? 'Saving Password...' : 'Save Password & Open Admin'}
              </button>
            </form>
          )}

          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter admin password"
                    required
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 pr-10 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-white absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition cursor-pointer"
              >
                {authSubmitting ? 'Unlocking...' : 'Unlock Admin Portal'}
              </button>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthError('');
                    setMode('forgot');
                  }}
                  className="text-blue-400 hover:underline font-semibold cursor-pointer"
                >
                  Forgot password?
                </button>
                {!authRecord && (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthError('');
                      setMode('create');
                    }}
                    className="text-slate-300 hover:text-white font-semibold cursor-pointer"
                  >
                    Create password
                  </button>
                )}
              </div>
            </form>
          )}

          {mode === 'forgot' && (
            <form onSubmit={handleForgotReset} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Recovery Code</label>
                <input
                  type="text"
                  value={recoveryCodeInput}
                  onChange={(e) => setRecoveryCodeInput(e.target.value)}
                  placeholder="Enter your saved recovery code"
                  required
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">New Strong Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter new strong password"
                  required
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition cursor-pointer"
              >
                {authSubmitting ? 'Resetting...' : 'Reset Password & Unlock'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthError('');
                  setMode('login');
                }}
                className="w-full text-xs text-slate-400 hover:text-white font-semibold cursor-pointer"
              >
                Back to Login
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // UNLOCKED ADMIN PORTAL
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to DAWIT SERVICES</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Admin Portal — 200 ETB Payment Verification
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Confirm telebirr (0985076136) or CBE (1000294415045) payment proof before contacting clients.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={loadBookings}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-white inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setChangePwOpen((prev) => !prev);
                setChangePwError('');
                setChangePwSuccess('');
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-blue-300 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Change Password</span>
            </button>

            <button
              type="button"
              onClick={handleLockPortal}
              className="px-3.5 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-xs font-bold text-red-200 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Lock Portal</span>
            </button>
          </div>
        </div>

        {/* CHANGE PASSWORD ANYTIME PANEL */}
        {changePwOpen && (
          <div className="rounded-2xl border border-blue-500/40 bg-slate-900 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-extrabold text-white">Change Admin Password</h2>
              <button
                type="button"
                onClick={() => setChangePwOpen(false)}
                className="text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Close
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Must be 10+ characters with uppercase, lowercase, a number, and a special character.
            </p>

            {changePwError && (
              <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-200">
                {changePwError}
              </div>
            )}
            {changePwSuccess && (
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-200">
                {changePwSuccess}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPwInput}
                  onChange={(e) => setCurrentPwInput(e.target.value)}
                  required
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  New Recovery Code (optional)
                </label>
                <input
                  type="text"
                  value={newRecoveryCodeInput}
                  onChange={(e) => setNewRecoveryCodeInput(e.target.value)}
                  placeholder="Leave blank to keep existing recovery code"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">New Strong Password</label>
                <input
                  type="password"
                  value={newPwInput}
                  onChange={(e) => setNewPwInput(e.target.value)}
                  required
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmNewPwInput}
                  onChange={(e) => setConfirmNewPwInput(e.target.value)}
                  required
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        )}

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs font-semibold text-slate-400">Total Requests</p>
            <p className="text-2xl font-extrabold text-white mt-1">{bookings.length}</p>
          </div>
          <div className="rounded-2xl border border-amber-500/30 bg-slate-900 p-4">
            <p className="text-xs font-semibold text-amber-300">Pending Payment Check</p>
            <p className="text-2xl font-extrabold text-amber-200 mt-1">{pendingCount}</p>
          </div>
          <div className="rounded-2xl border border-emerald-500/30 bg-slate-900 p-4">
            <p className="text-xs font-semibold text-emerald-300">Verified Payments (Ready to Contact)</p>
            <p className="text-2xl font-extrabold text-emerald-200 mt-1">{verifiedCount}</p>
          </div>
        </div>

        {/* FILTER & SEARCH */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {(['all', 'pending', 'verified'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                  statusFilter === tab
                    ? 'bg-blue-600 border-blue-400 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {tab === 'all' ? 'All Requests' : tab === 'pending' ? 'Pending Check' : 'Verified'}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, phone, reference..."
              className="w-full rounded-xl bg-slate-900 border border-slate-800 pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {errorMsg && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3.5 text-xs text-red-200">
            {errorMsg}
          </div>
        )}

        {/* BOOKINGS LIST */}
        {loading ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center text-sm text-slate-400">
            Loading service requests...
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center text-sm text-slate-400">
            No matching requests found.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((row) => {
              const verified = isVerified(row);
              const screenshotUrl = extractScreenshotUrl(row);
              const refCode = row.payment_reference || row.tx_ref || 'Not provided';

              return (
                <div
                  key={row.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/85 p-5 space-y-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base font-extrabold text-white">{row.full_name}</h2>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            verified
                              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                              : 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                          }`}
                        >
                          {verified ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Verified — Ready to Contact</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3.5 h-3.5" />
                              <span>Pending Payment Check</span>
                            </>
                          )}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                        <a
                          href={`tel:${row.phone}`}
                          className="inline-flex items-center gap-1 text-blue-300 hover:underline font-semibold"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{row.phone}</span>
                        </a>
                        <span className="text-slate-400">•</span>
                        <span className="font-semibold text-white">{row.selected_service}</span>
                        {row.payment_method && (
                          <>
                            <span className="text-slate-400">•</span>
                            <span className="font-bold text-blue-300">200 ETB via {row.payment_method}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={updatingId === row.id}
                      onClick={() => toggleVerification(row)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        verified
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      {updatingId === row.id
                        ? 'Saving...'
                        : verified
                        ? 'Mark as Pending'
                        : 'Confirm 200 ETB Payment'}
                    </button>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-xs text-slate-300 break-words space-y-2">
                    <div>
                      <span className="font-bold text-slate-400">Reference / Details: </span>
                      <span className="text-white">{refCode}</span>
                    </div>

                    {screenshotUrl && (
                      <div className="pt-2 border-t border-slate-800/80 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1.5 font-bold text-blue-300">
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>Payment Screenshot Proof</span>
                          </span>
                          <a
                            href={screenshotUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-blue-400 hover:underline font-semibold"
                          >
                            <span>Open Full Image</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                        <a href={screenshotUrl} target="_blank" rel="noreferrer" className="block w-fit">
                          <img
                            src={screenshotUrl}
                            alt={`Payment proof for ${row.full_name}`}
                            className="max-h-48 rounded-lg border border-slate-800 object-contain bg-slate-900"
                          />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}