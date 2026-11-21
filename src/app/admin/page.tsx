'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import { RefreshCw, ArrowLeft, Lock, CheckCircle2, Trash2 } from 'lucide-react';

interface Booking {
  id: string | number;
  created_at?: string;
  full_name: string;
  phone: string;
  selected_service: string;
  tx_ref: string;
}

export default function AdminBookingsPage() {
  // Simple client-side gate (change this passcode before deploying)
  const ADMIN_PASSCODE = 'dave2026';

  const [unlocked, setUnlocked] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedId, setCopiedId] = useState<string | number | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setErrorMsg('Failed to load bookings: ' + error.message);
      setLoading(false);
      return;
    }

    setBookings(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (unlocked) {
      fetchBookings();
    }
  }, [unlocked, fetchBookings]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput === ADMIN_PASSCODE) {
      setUnlocked(true);
      setPasscodeError('');
    } else {
      setPasscodeError('Incorrect passcode.');
    }
  };

  const handleCopyTx = async (id: string | number, txRef: string) => {
    try {
      await navigator.clipboard.writeText(txRef);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // Fallback if clipboard permission is blocked
    }
  };

  const handleDeleteBooking = async (id: string | number) => {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Delete failed: ' + error.message);
      return;
    }

    setBookings((prev) => prev.filter((item) => item.id !== id));
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-lg">
            <Lock className="w-5 h-5" /> Admin Access
          </div>
          <p className="text-xs text-slate-400">
            Enter your admin passcode to view submitted bookings.
          </p>
          <form onSubmit={handleUnlock} className="space-y-3">
            <input
              type="password"
              value={passcodeInput}
              onChange={(e) => setPasscodeInput(e.target.value)}
              placeholder="Enter passcode"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            />
            {passcodeError && (
              <p className="text-xs text-red-400 font-medium">{passcodeError}</p>
            )}
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition"
            >
              Unlock Bookings
            </button>
          </form>
          <div className="pt-2 border-t border-slate-800/80">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white">Bookings Admin</h1>
            <p className="text-xs text-slate-400">
              Total bookings: <span className="text-blue-400 font-bold">{bookings.length}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchBookings}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 text-xs font-bold text-slate-200 flex items-center gap-2 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-blue-400 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <Link
              href="/"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Home
            </Link>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
            {errorMsg}
          </div>
        )}

        <div className="bg-slate-900/85 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 text-xs uppercase">
                  <th className="py-3.5 px-4">Full Name</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Service</th>
                  <th className="py-3.5 px-4">Tx Reference</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {loading && bookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 px-4 text-center text-slate-400">
                      Loading bookings...
                    </td>
                  </tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 px-4 text-center text-slate-400">
                      No bookings found yet.
                    </td>
                  </tr>
                ) : (
                  bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4 font-semibold text-white">{b.full_name}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">{b.phone}</td>
                      <td className="py-3.5 px-4 text-blue-300 font-medium">{b.selected_service}</td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleCopyTx(b.id, b.tx_ref)}
                          title="Click to copy transaction reference"
                          className="font-mono text-xs px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-blue-500/50 text-amber-300 inline-flex items-center gap-1.5 transition"
                        >
                          <span>{b.tx_ref}</span>
                          {copiedId === b.id && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-400 whitespace-nowrap">
                        {b.created_at ? new Date(b.created_at).toLocaleString() : '-'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteBooking(b.id)}
                          title="Delete booking"
                          className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}