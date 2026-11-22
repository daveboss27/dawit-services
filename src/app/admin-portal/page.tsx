'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isAllowedAdminEmail } from '../../lib/adminGuard';
import { supabase } from '../../lib/supabase';
import { ShieldCheck, LogIn, LogOut, ArrowRight, Home } from 'lucide-react';

export default function DedicatedAdminPortalEntryPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [emailInput, setEmailInput] = useState('dawittesfay2724@gmail.com');
  const [passwordInput, setPasswordInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!active) return;
      const email = user?.email ?? null;
      setSessionEmail(email);
      setIsAdmin(Boolean(user && isAllowedAdminEmail(email)));
      setChecking(false);
    };

    void loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      const email = session?.user?.email ?? null;
      setSessionEmail(email);
      setIsAdmin(Boolean(session?.user && isAllowedAdminEmail(email)));
      setChecking(false);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleDirectAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);

    const normalizedEmail = emailInput.trim().toLowerCase();
    if (!isAllowedAdminEmail(normalizedEmail)) {
      setErrorMsg('Only dawittesfay2724@gmail.com is allowed as admin.');
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: passwordInput,
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      const signedInEmail = data.user?.email ?? normalizedEmail;
      setSessionEmail(signedInEmail);
      setIsAdmin(isAllowedAdminEmail(signedInEmail));
      setInfoMsg('Signed in as admin. You can now open /admin.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    setSubmitting(true);
    setErrorMsg(null);
    setInfoMsg(null);
    try {
      await supabase.auth.signOut();
      setSessionEmail(null);
      setIsAdmin(false);
      setInfoMsg('Signed out of current session.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-slate-900 border border-white/15 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-300" />
            <h1 className="text-lg font-black uppercase tracking-wide">
              Dedicated Admin Portal Entry
            </h1>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white underline"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </div>

        <div className="bg-slate-950 border border-white/10 p-3.5 text-xs space-y-1">
          <p className="text-slate-400">Detected Supabase Session:</p>
          {checking ? (
            <p className="text-slate-200">Checking session...</p>
          ) : sessionEmail ? (
            <p className="font-mono text-amber-300">{sessionEmail}</p>
          ) : (
            <p className="text-slate-300">No active session</p>
          )}
          <p className="text-slate-300 pt-1">
            Admin Match:{' '}
            <span className={isAdmin ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
              {isAdmin ? 'Authorized (dawittesfay2724@gmail.com)' : 'Not Authorized'}
            </span>
          </p>
        </div>

        {errorMsg && (
          <p className="text-xs font-bold text-red-300 bg-red-950/70 border border-red-500/40 p-3">
            {errorMsg}
          </p>
        )}

        {infoMsg && (
          <p className="text-xs font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 p-3">
            {infoMsg}
          </p>
        )}

        {!isAdmin ? (
          <form onSubmit={handleDirectAdminSignIn} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-slate-300">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-slate-950 border border-white/20 px-3.5 py-2.5 text-sm text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-slate-300">
                Account Password
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter your Supabase password"
                className="w-full bg-slate-950 border border-white/20 px-3.5 py-2.5 text-sm text-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-xs font-extrabold uppercase tracking-wider cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>{submitting ? 'Signing In...' : 'Sign In as Admin'}</span>
              </button>

              {sessionEmail && (
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold uppercase cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-emerald-300 font-semibold">
              Your admin session is active. Continue to your main admin workspace:
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => router.push('/admin')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold uppercase tracking-wider cursor-pointer"
              >
                <span>Open /admin Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold uppercase cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}