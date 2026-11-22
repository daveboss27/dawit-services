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

export default function AdminPortalPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

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
    loadBookings();
  }, [loadBookings]);

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

          <button
            type="button"
            onClick={loadBookings}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-white inline-flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

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