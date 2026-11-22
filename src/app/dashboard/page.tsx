'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import { LangCode, SUPPORTED_LANGUAGES, INTEREST_OPTIONS, TRANSLATIONS } from '../lib/i18n';
import {
  Calculator,
  ClipboardCheck,
  Bookmark,
  Briefcase,
  LogOut,
  Plus,
  Trash2,
  ArrowLeft,
  KeyRound,
  CalendarClock,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface CourseRow {
  id: string;
  name: string;
  credit: number;
  gradePoint: number;
}

interface ServiceItem {
  id: string;
  service_type: string;
  workflow_stage: string | null;
  deposit_paid: boolean | null;
  customer_update: string | null;
  created_at: string;
}

interface ScheduleTask {
  id: string;
  title: string;
  category: 'Study' | 'Application' | 'Program' | 'Personal';
  date: string;
  time: string;
  done: boolean;
}

const GRADE_OPTIONS = [
  { label: 'A / A+ (4.00)', value: 4.0 },
  { label: 'A- (3.75)', value: 3.75 },
  { label: 'B+ (3.50)', value: 3.5 },
  { label: 'B (3.00)', value: 3.0 },
  { label: 'B- (2.75)', value: 2.75 },
  { label: 'C+ (2.50)', value: 2.5 },
  { label: 'C (2.00)', value: 2.0 },
  { label: 'D (1.00)', value: 1.0 },
  { label: 'F (0.00)', value: 0.0 },
];

const SCHEDULE_STORAGE_KEY = 'dawit_member_schedule_v1';

export default function DashboardPage() {
  const router = useRouter();
  const [lang, setLang] = useState<LangCode>('am');
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const [myRequests, setMyRequests] = useState<ServiceItem[]>([]);
  const [savedCount, setSavedCount] = useState(0);
  const [interests, setInterests] = useState<string[]>([]);

  // Password change / reset state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwSaving, setPwSaving] = useState(false);
  const [pwFeedback, setPwFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  // Account-only Student Privileges: GPA Calculator & Document Checklist
  const [courses, setCourses] = useState<CourseRow[]>([
    { id: '1', name: 'Course 1', credit: 3, gradePoint: 4.0 },
    { id: '2', name: 'Course 2', credit: 4, gradePoint: 3.75 },
  ]);
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  // Scientific calculator state
  const [sciExpr, setSciExpr] = useState('');
  const [sciResult, setSciResult] = useState('0');
  const [sciError, setSciError] = useState<string | null>(null);
  const [angleMode, setAngleMode] = useState<'DEG' | 'RAD'>('DEG');

  // Program scheduler state
  const [tasks, setTasks] = useState<ScheduleTask[]>([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState<ScheduleTask['category']>('Study');
  const [taskDate, setTaskDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [taskTime, setTaskTime] = useState('09:00');

  const t = TRANSLATIONS[lang];
  const isAm = lang === 'am';

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SCHEDULE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ScheduleTask[];
        if (Array.isArray(parsed)) setTasks(parsed);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // ignore storage errors
    }
  }, [tasks]);

  const loadUserRecords = useCallback(async (uid: string) => {
    const [reqsRes, savedRes, intsRes] = await Promise.all([
      supabase
        .from('service_requests')
        .select('id, service_type, workflow_stage, deposit_paid, customer_update, created_at')
        .eq('user_id', uid)
        .order('created_at', { ascending: false }),
      supabase.from('saved_opportunities').select('id').eq('user_id', uid),
      supabase.from('user_interests').select('interest_slug').eq('user_id', uid),
    ]);

    if (reqsRes.data) setMyRequests(reqsRes.data as ServiceItem[]);
    if (savedRes.data) setSavedCount(savedRes.data.length);
    if (intsRes.data) {
      setInterests((intsRes.data as { interest_slug: string }[]).map((r) => r.interest_slug));
    }
  }, []);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/auth');
        return;
      }

      setUserId(user.id);
      setUserEmail(user.email || '');
      await loadUserRecords(user.id);
    } finally {
      setLoading(false);
    }
  }, [loadUserRecords, router]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // Real-time subscription for service requests
  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel(`dashboard-live-requests-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'service_requests', filter: `user_id=eq.${userId}` },
        () => {
          loadUserRecords(userId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, loadUserRecords]);

  const toggleInterest = async (slug: string) => {
    if (!userId) return;
    const exists = interests.includes(slug);
    if (exists) {
      await supabase
        .from('user_interests')
        .delete()
        .eq('user_id', userId)
        .eq('interest_slug', slug);
      setInterests((prev) => prev.filter((x) => x !== slug));
    } else {
      await supabase.from('user_interests').insert({ user_id: userId, interest_slug: slug });
      setInterests((prev) => [...prev, slug]);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/auth');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwFeedback(null);

    if (newPassword.length < 6) {
      setPwFeedback({
        ok: false,
        text: isAm ? 'የይለፍ ቃሉ ቢያንስ 6 ፊደላት መሆን አለበት።' : 'Password must be at least 6 characters.',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwFeedback({
        ok: false,
        text: isAm ? 'የይለፍ ቃሎቹ አይመሳሰሉም።' : 'Passwords do not match.',
      });
      return;
    }

    setPwSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setPwFeedback({ ok: false, text: error.message });
      } else {
        setNewPassword('');
        setConfirmPassword('');
        setPwFeedback({
          ok: true,
          text: isAm ? 'የይለፍ ቃልዎ በተሳካ ሁኔታ ተቀይሯል።' : 'Your password has been updated.',
        });
      }
    } finally {
      setPwSaving(false);
    }
  };

  const handleSendResetLink = async () => {
    if (!userEmail) return;
    setPwFeedback(null);
    setPwSaving(true);
    try {
      const redirectTo =
        typeof window !== 'undefined' ? `${window.location.origin}/auth` : undefined;
      const { error } = await supabase.auth.resetPasswordForEmail(userEmail, { redirectTo });
      if (error) {
        setPwFeedback({ ok: false, text: error.message });
      } else {
        setPwFeedback({
          ok: true,
          text: isAm
            ? `የማደሻ ሊንክ ወደ ${userEmail} ተልኳል።`
            : `Reset link sent to ${userEmail}.`,
        });
      }
    } finally {
      setPwSaving(false);
    }
  };

  const appendSci = (token: string) => {
    setSciError(null);
    setSciExpr((prev) => `${prev}${token}`);
  };

  const evaluateSci = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) {
      setSciResult('0');
      setSciError(null);
      return;
    }
    try {
      const toRad = (deg: number) => (deg * Math.PI) / 180;
      const sin = (x: number) => Math.sin(angleMode === 'DEG' ? toRad(x) : x);
      const cos = (x: number) => Math.cos(angleMode === 'DEG' ? toRad(x) : x);
      const tan = (x: number) => Math.tan(angleMode === 'DEG' ? toRad(x) : x);
      const sqrt = (x: number) => Math.sqrt(x);
      const log10 = (x: number) => Math.log10(x);
      const ln = (x: number) => Math.log(x);
      const abs = (x: number) => Math.abs(x);
      const PI = Math.PI;
      const E = Math.E;

      const normalized = trimmed
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\^/g, '**')
        .replace(/π/g, 'PI');

      const check = normalized.replace(/\b(sin|cos|tan|sqrt|log10|ln|abs|PI|E)\b/g, '');
      if (!/^[0-9+\-*/().%\s*]*$/.test(check)) {
        throw new Error('Invalid characters');
      }

      // eslint-disable-next-line no-new-func
      const fn = new Function(
        'sin',
        'cos',
        'tan',
        'sqrt',
        'log10',
        'ln',
        'abs',
        'PI',
        'E',
        `"use strict"; return (${normalized});`
      );
      const out = fn(sin, cos, tan, sqrt, log10, ln, abs, PI, E);
      if (typeof out !== 'number' || !Number.isFinite(out)) {
        throw new Error('Math error');
      }
      setSciResult(Number.isInteger(out) ? String(out) : String(Number(out.toPrecision(10))));
      setSciError(null);
    } catch {
      setSciError(isAm ? 'የተሳሳተ ስሌት' : 'Invalid expression');
    }
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    setTasks((prev) => [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title: taskTitle.trim(),
        category: taskCategory,
        date: taskDate || new Date().toISOString().slice(0, 10),
        time: taskTime || '09:00',
        done: false,
      },
      ...prev,
    ]);
    setTaskTitle('');
  };

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item)));
  };

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((item) => item.id !== id));
  };

  const totalCredits = courses.reduce((acc, c) => acc + (Number(c.credit) || 0), 0);
  const totalPoints = courses.reduce(
    (acc, c) => acc + (Number(c.credit) || 0) * (Number(c.gradePoint) || 0),
    0
  );
  const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';

  const checklist = isAm
    ? [
        'የመታወቂያ ወይም የፓስፖርት ቅጂ',
        'የትምህርት ማስረጃ (Transcript)',
        'CV / Motivation Letter',
        'የማመልከቻ ማብቂያ ቀን ተመዝግቧል',
      ]
    : [
        'ID or passport copy ready',
        'Academic transcript ready',
        'CV / motivation letter ready',
        'Application deadline recorded',
      ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900 flex flex-col">
      <header className="bg-slate-950 text-white border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.navHome}</span>
            </Link>
            <div className="h-4 w-px bg-slate-700" />
            <span className="font-black text-sm sm:text-base uppercase">{t.navDashboard}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {SUPPORTED_LANGUAGES.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setLang(item.code)}
                  className={`px-2 py-1 text-xs font-bold cursor-pointer ${
                    lang === item.code ? 'bg-red-700 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {item.native}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-extrabold uppercase cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isAm ? 'ውጣ / Logout' : 'Log Out'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {loading ? (
          <p className="text-sm text-slate-600">{t.loadingText}</p>
        ) : (
          <>
            <div className="border-b border-slate-200 pb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-950">
                  {isAm ? 'የመለያ ዳሽቦርድ' : 'Member Dashboard'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600">{userEmail}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/hub"
                  className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-extrabold uppercase"
                >
                  {t.ctaExploreHub}
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold uppercase cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{isAm ? 'ውጣ' : 'Log Out'}</span>
                </button>
              </div>
            </div>

            {/* Summary Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200 p-4 flex items-center gap-3">
                <Bookmark className="w-5 h-5 text-red-700" />
                <div>
                  <p className="text-xs font-bold text-slate-500">
                    {isAm ? 'የተቀመጡ እድሎች' : 'Saved Opportunities'}
                  </p>
                  <p className="text-xl font-black text-slate-950">{savedCount}</p>
                </div>
              </div>
              <div className="bg-white border border-slate-200 p-4 flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-red-700" />
                <div>
                  <p className="text-xs font-bold text-slate-500">
                    {isAm ? 'የአገልግሎት ጥያቄዎች' : 'My Service Requests'}
                  </p>
                  <p className="text-xl font-black text-slate-950">{myRequests.length}</p>
                </div>
              </div>
              <div className="bg-white border border-slate-200 p-4 flex items-center gap-3">
                <Calculator className="w-5 h-5 text-red-700" />
                <div>
                  <p className="text-xs font-bold text-slate-500">
                    {isAm ? 'የተሰላ GPA' : 'Calculated GPA'}
                  </p>
                  <p className="text-xl font-black text-slate-950">{gpa} / 4.00</p>
                </div>
              </div>
            </div>

            {/* Account-Only Student Privileges: GPA Calculator & Document Checklist */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <section className="bg-white border border-slate-200 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-black text-slate-950 flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-red-700" />
                    <span>{isAm ? 'GPA ማስያ (የመለያ ጥቅም)' : 'GPA Calculator (Account Tool)'}</span>
                  </h2>
                  <span className="px-2.5 py-1 bg-slate-950 text-white text-xs font-black">
                    {gpa}
                  </span>
                </div>

                <div className="space-y-2">
                  {courses.map((c) => (
                    <div key={c.id} className="grid grid-cols-12 gap-2 items-center text-xs">
                      <input
                        type="text"
                        value={c.name}
                        onChange={(e) =>
                          setCourses((prev) =>
                            prev.map((row) =>
                              row.id === c.id ? { ...row, name: e.target.value } : row
                            )
                          )
                        }
                        className="col-span-5 border border-slate-300 px-2.5 py-1.5"
                      />
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={c.credit}
                        onChange={(e) =>
                          setCourses((prev) =>
                            prev.map((row) =>
                              row.id === c.id ? { ...row, credit: Number(e.target.value) } : row
                            )
                          )
                        }
                        className="col-span-2 border border-slate-300 px-2 py-1.5"
                      />
                      <select
                        value={c.gradePoint}
                        onChange={(e) =>
                          setCourses((prev) =>
                            prev.map((row) =>
                              row.id === c.id
                                ? { ...row, gradePoint: Number(e.target.value) }
                                : row
                            )
                          )
                        }
                        className="col-span-4 border border-slate-300 px-2 py-1.5"
                      >
                        {GRADE_OPTIONS.map((g) => (
                          <option key={g.label} value={g.value}>
                            {g.label}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() =>
                          setCourses((prev) =>
                            prev.length > 1 ? prev.filter((row) => row.id !== c.id) : prev
                          )
                        }
                        className="col-span-1 text-slate-400 hover:text-red-700 flex justify-center cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setCourses((prev) => [
                      ...prev,
                      {
                        id: String(Date.now()),
                        name: `Course ${prev.length + 1}`,
                        credit: 3,
                        gradePoint: 4.0,
                      },
                    ])
                  }
                  className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-300 text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAm ? 'ኮርስ ጨምር' : 'Add Course'}</span>
                </button>
              </section>

              <section className="bg-white border border-slate-200 p-6 space-y-4">
                <h2 className="text-base font-black text-slate-950 flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4 text-red-700" />
                  <span>
                    {isAm
                      ? 'የማመልከቻ ዝግጅት ዝርዝር (የመለያ ጥቅም)'
                      : 'Readiness Checklist (Account Tool)'}
                  </span>
                </h2>
                <ul className="space-y-2.5 text-sm text-slate-700">
                  {checklist.map((item) => (
                    <li key={item}>
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!checkedDocs[item]}
                          onChange={() =>
                            setCheckedDocs((prev) => ({ ...prev, [item]: !prev[item] }))
                          }
                          className="w-4 h-4 accent-red-700"
                        />
                        <span className={checkedDocs[item] ? 'line-through text-slate-400' : ''}>
                          {item}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Scientific Calculator & Program Scheduler */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <section className="bg-white border border-slate-200 p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-black text-slate-950 flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-red-700" />
                    <span>{isAm ? 'ሳይንሳዊ ማስያ' : 'Scientific Calculator'}</span>
                  </h2>
                  <button
                    type="button"
                    onClick={() => setAngleMode((m) => (m === 'DEG' ? 'RAD' : 'DEG'))}
                    className="px-2.5 py-1 bg-slate-950 text-white text-xs font-extrabold cursor-pointer"
                  >
                    {angleMode}
                  </button>
                </div>

                <div className="border border-slate-300 bg-[#FAF9F6] p-3 space-y-1">
                  <input
                    type="text"
                    value={sciExpr}
                    onChange={(e) => {
                      setSciExpr(e.target.value);
                      setSciError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        evaluateSci(sciExpr);
                      }
                    }}
                    placeholder="sin(30) + sqrt(16)"
                    className="w-full bg-transparent text-xs font-mono text-slate-800 focus:outline-none"
                  />
                  <div className="text-right text-xl font-black font-mono text-slate-950">
                    {sciError ? <span className="text-xs text-red-700">{sciError}</span> : sciResult}
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-1.5 text-xs font-bold">
                  {[
                    { label: 'sin(', val: 'sin(' },
                    { label: 'cos(', val: 'cos(' },
                    { label: 'tan(', val: 'tan(' },
                    { label: 'log(', val: 'log10(' },
                    { label: 'ln(', val: 'ln(' },
                    { label: '√', val: 'sqrt(' },
                    { label: 'xʸ', val: '^' },
                    { label: 'π', val: 'π' },
                    { label: 'e', val: 'E' },
                    { label: '|x|', val: 'abs(' },
                  ].map((b) => (
                    <button
                      key={b.label}
                      type="button"
                      onClick={() => appendSci(b.val)}
                      className="py-1.5 bg-[#FAF9F6] hover:bg-slate-200 border border-slate-300 cursor-pointer"
                    >
                      {b.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-4 gap-1.5 text-xs font-bold">
                  {['7', '8', '9', '+', '4', '5', '6', '-', '1', '2', '3', '*', '0', '.', '(', ')'].map(
                    (k) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => appendSci(k)}
                        className="py-2 bg-white hover:bg-slate-100 border border-slate-300 cursor-pointer"
                      >
                        {k === '*' ? '×' : k}
                      </button>
                    )
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setSciExpr('');
                      setSciResult('0');
                      setSciError(null);
                    }}
                    className="py-2 bg-slate-200 font-bold cursor-pointer"
                  >
                    C
                  </button>
                  <button
                    type="button"
                    onClick={() => setSciExpr((p) => p.slice(0, -1))}
                    className="py-2 bg-slate-200 font-bold cursor-pointer"
                  >
                    ⌫
                  </button>
                  <button
                    type="button"
                    onClick={() => appendSci('/')}
                    className="py-2 bg-slate-200 font-bold cursor-pointer"
                  >
                    ÷
                  </button>
                  <button
                    type="button"
                    onClick={() => evaluateSci(sciExpr)}
                    className="py-2 bg-red-700 hover:bg-red-800 text-white font-extrabold cursor-pointer"
                  >
                    =
                  </button>
                </div>
              </section>

              <section className="bg-white border border-slate-200 p-6 space-y-3">
                <h2 className="text-base font-black text-slate-950 flex items-center gap-2">
                  <CalendarClock className="w-4 h-4 text-red-700" />
                  <span>{isAm ? 'የፕሮግራም መርሐግብር' : 'Program Scheduler'}</span>
                </h2>

                <form onSubmit={addTask} className="space-y-2 text-xs">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      placeholder={
                        isAm ? 'የጥናት ወይም የፕሮግራም መርሐግብር ያክሉ...' : 'Add study or program task...'
                      }
                      className="flex-1 border border-slate-300 px-3 py-2"
                    />
                    <select
                      value={taskCategory}
                      onChange={(e) => setTaskCategory(e.target.value as ScheduleTask['category'])}
                      className="border border-slate-300 px-2.5 py-2 font-bold"
                    >
                      <option value="Study">Study</option>
                      <option value="Application">Application</option>
                      <option value="Program">Program</option>
                      <option value="Personal">Personal</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={taskDate}
                      onChange={(e) => setTaskDate(e.target.value)}
                      className="border border-slate-300 px-2.5 py-1.5"
                    />
                    <input
                      type="time"
                      value={taskTime}
                      onChange={(e) => setTaskTime(e.target.value)}
                      className="border border-slate-300 px-2.5 py-1.5"
                    />
                    <button
                      type="submit"
                      className="ml-auto inline-flex items-center gap-1 px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white font-extrabold uppercase cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isAm ? 'ጨምር' : 'Add'}</span>
                    </button>
                  </div>
                </form>

                {tasks.length === 0 ? (
                  <p className="text-xs text-slate-500 pt-2">
                    {isAm ? 'ምንም የተመዘገበ መርሐግብር የለም።' : 'No scheduled items yet.'}
                  </p>
                ) : (
                  <ul className="space-y-2 max-h-56 overflow-y-auto pt-1">
                    {tasks.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center justify-between gap-2 border border-slate-200 bg-[#FAF9F6] px-3 py-2 text-xs"
                      >
                        <button
                          type="button"
                          onClick={() => toggleTask(item.id)}
                          className="flex items-center gap-2 text-left flex-1 cursor-pointer"
                        >
                          {item.done ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                          ) : (
                            <Clock className="w-4 h-4 text-red-700 shrink-0" />
                          )}
                          <div>
                            <p
                              className={`font-bold ${
                                item.done ? 'line-through text-slate-400' : 'text-slate-950'
                              }`}
                            >
                              {item.title}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {item.category} • {item.date} {item.time}
                            </p>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => removeTask(item.id)}
                          className="text-slate-400 hover:text-red-700 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>

            {/* Password Change / Reset Section */}
            <section className="bg-white border border-slate-200 p-6 space-y-4">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-red-700" />
                <span>{isAm ? 'የይለፍ ቃል መቀየሪያ / ማደሻ' : 'Change or Reset Password'}</span>
              </h2>

              {pwFeedback && (
                <p
                  className={`text-xs font-bold px-3 py-2 border ${
                    pwFeedback.ok
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                      : 'bg-red-50 text-red-900 border-red-300'
                  }`}
                >
                  {pwFeedback.text}
                </p>
              )}

              <form onSubmit={handleChangePassword} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={isAm ? 'አዲስ የይለፍ ቃል' : 'New password'}
                  className="border border-slate-300 bg-[#FAF9F6] px-3 py-2 text-xs"
                />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={isAm ? 'አዲሱን የይለፍ ቃል ያረጋግጡ' : 'Confirm new password'}
                  className="border border-slate-300 bg-[#FAF9F6] px-3 py-2 text-xs"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={pwSaving}
                    className="flex-1 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-extrabold uppercase cursor-pointer"
                  >
                    {pwSaving
                      ? isAm
                        ? 'በመቀየር ላይ...'
                        : 'Saving...'
                      : isAm
                      ? 'ቀይር'
                      : 'Update'}
                  </button>
                  <button
                    type="button"
                    onClick={handleSendResetLink}
                    disabled={pwSaving || !userEmail}
                    className="px-3 py-2 border border-slate-300 bg-[#FAF9F6] hover:bg-slate-200 text-xs font-bold cursor-pointer"
                  >
                    {isAm ? 'የማደሻ ሊንክ' : 'Reset Link'}
                  </button>
                </div>
              </form>
            </section>

            {/* Interests Selection */}
            <section className="bg-white border border-slate-200 p-6 space-y-3">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-800">
                {isAm ? 'የፍላጎት ርዕሶች' : 'My Interests'}
              </h2>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((slug) => {
                  const active = interests.includes(slug);
                  return (
                    <button
                      key={slug}
                      type="button"
                      onClick={() => toggleInterest(slug)}
                      className={`px-3 py-1 text-xs font-bold border cursor-pointer ${
                        active
                          ? 'bg-slate-950 text-white border-slate-950'
                          : 'bg-[#FAF9F6] text-slate-700 border-slate-300'
                      }`}
                    >
                      {slug.replace('_', ' ')}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Service Requests Tracking */}
            <section className="bg-white border border-slate-200 p-6 space-y-3">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-800">
                {isAm ? 'የእኔ የአገልግሎት ጥያቄዎች' : 'My Service Requests'}
              </h2>
              {myRequests.length === 0 ? (
                <p className="text-sm text-slate-500">{t.emptyText}</p>
              ) : (
                <div className="divide-y divide-slate-200 text-sm">
                  {myRequests.map((r) => (
                    <div key={r.id} className="py-3 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-bold text-slate-950">{r.service_type}</p>
                        {r.customer_update && (
                          <p className="text-xs text-slate-600">{r.customer_update}</p>
                        )}
                      </div>
                      <span className="text-xs font-bold uppercase text-red-700">
                        {r.workflow_stage || 'request'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}