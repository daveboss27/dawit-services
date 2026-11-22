'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { isAllowedAdminEmail } from '../lib/adminGuard';
import { supabase } from '../lib/supabase';
import {
  LangCode,
  SUPPORTED_LANGUAGES,
  SERVICE_WORKFLOW_STAGES,
  USER_ROLES,
  OPPORTUNITY_TYPES,
} from '../lib/i18n';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FilePlus2,
  Newspaper,
  Award,
  Bell,
  ShieldAlert,
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Search,
  Globe,
  Lock,
  KeyRound,
  ImagePlus,
  Video,
  Pencil,
  Save,
  X,
  LogOut,
  UserCheck,
} from 'lucide-react';

const SEVEN_PHOTOS = [
  { src: '/hero-1.jpg', alt: 'Dawit Services admin backdrop 1' },
  { src: '/hero-2.jpg', alt: 'Dawit Services admin backdrop 2' },
  { src: '/hero-3.jpg', alt: 'Dawit Services admin backdrop 3' },
  { src: '/hero-4.jpg', alt: 'Dawit Services admin backdrop 4' },
  { src: '/hero-5.jpg', alt: 'Dawit Services admin backdrop 5' },
  { src: '/hero-6.jpg', alt: 'Dawit Services admin backdrop 6' },
  { src: '/hero-7.jpg', alt: 'Dawit Services admin backdrop 7' },
];

const PHOTO_GROUPS = [
  [SEVEN_PHOTOS[0], SEVEN_PHOTOS[1], SEVEN_PHOTOS[2]],
  [SEVEN_PHOTOS[3], SEVEN_PHOTOS[4], SEVEN_PHOTOS[5]],
  [SEVEN_PHOTOS[6], SEVEN_PHOTOS[0], SEVEN_PHOTOS[1]],
];

const ADMIN_LOCK_STORAGE_KEY = 'dawit_admin_lock_v1';
const FORGOT_RESET_PHRASE = 'RESET DAWIT ADMIN';

interface StoredAdminLock {
  salt: string;
  hash: string;
}

function evaluatePasswordStrength(pw: string) {
  const checks = {
    length: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    number: /\d/.test(pw),
    symbol: /[^A-Za-z0-9]/.test(pw),
  };
  const score = Object.values(checks).filter(Boolean).length;
  return { checks, score, isStrong: score >= 4 && checks.length };
}

async function hashPasswordWithSalt(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function generateSalt(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function extractMediaFromPost(post: {
  media_url?: string | null;
  media_type?: string | null;
  source_name?: string | null;
}): { url: string | null; isVideo: boolean } {
  let url = post.media_url?.trim() || null;
  if (!url && post.source_name && post.source_name.includes(' | Media: ')) {
    url = post.source_name.split(' | Media: ')[1]?.trim() || null;
  }
  if (!url) return { url: null, isVideo: false };

  const lower = url.toLowerCase();
  const isVideo =
    post.media_type === 'video' ||
    lower.endsWith('.mp4') ||
    lower.endsWith('.webm') ||
    lower.endsWith('.mov') ||
    lower.endsWith('.ogg');

  return { url, isVideo };
}

type AdminTab =
  | 'overview'
  | 'forms'
  | 'services'
  | 'users'
  | 'posts'
  | 'opportunities'
  | 'notifications'
  | 'reports';

type LockScreenMode = 'setup' | 'unlock' | 'change' | 'forgot';

interface ProfileRow {
  id: string;
  username: string | null;
  full_name: string | null;
  phone: string | null;
  country: string | null;
  university: string | null;
  role: string;
  status: string;
  created_at: string;
}

interface ServiceRequestRow {
  id: string;
  service_type: string;
  full_name: string;
  contact: string;
  details: string | null;
  status: string | null;
  workflow_stage: string;
  agreed_fee_etb: number | null;
  deposit_paid: boolean;
  internal_notes: string | null;
  customer_update: string | null;
  created_at: string;
}

interface CustomFormField {
  id: string;
  label_am: string;
  label_en: string;
  type: 'text' | 'textarea' | 'select';
  required: boolean;
  options?: string[];
}

interface CustomFormRow {
  id: string;
  title_am: string;
  title_en: string;
  description_am: string | null;
  description_en: string | null;
  audience_tag: string | null;
  fields: CustomFormField[];
  is_published: boolean;
  deadline_at: string | null;
  created_at: string;
}

interface FormSubmissionRow {
  id: string;
  form_id: string;
  submitter_name: string | null;
  submitter_contact: string | null;
  answers: Record<string, string>;
  status: string;
  created_at: string;
}

interface PostTranslationItem {
  lang_code: string;
  title: string;
  body?: string;
}

interface HubPostRow {
  id: string;
  post_type: string | null;
  status: string | null;
  is_breaking: boolean | null;
  source_name: string | null;
  media_url?: string | null;
  media_type?: string | null;
  created_at: string;
  hub_post_translations?: PostTranslationItem[];
}

interface OpportunityRow {
  id: string;
  opportunity_type: string;
  organization: string | null;
  country: string | null;
  deadline_at: string | null;
  is_active: boolean | null;
  media_url?: string | null;
  opportunity_translations?: { lang_code: string; title: string }[];
}

interface ReportRow {
  id: string;
  target_type: string;
  target_id: string;
  reason: string;
  status: string;
  created_at: string;
}

export default function AdminPortalPage() {
  const [adminChecked, setAdminChecked] = useState(false);
  const [isAuthorizedAdmin, setIsAuthorizedAdmin] = useState(false);
  const [activeSessionEmail, setActiveSessionEmail] = useState<string | null>(null);
  const [signingOutSession, setSigningOutSession] = useState(false);

  const [lang, setLang] = useState<LangCode>('am');
  const [groupIndex, setGroupIndex] = useState(0);
  const [tab, setTab] = useState<AdminTab>('overview');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; isError?: boolean } | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Password Lock State
  const [storedLock, setStoredLock] = useState<StoredAdminLock | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [lockReady, setLockReady] = useState(false);
  const [lockMode, setLockMode] = useState<LockScreenMode>('setup');
  const [showPassword, setShowPassword] = useState(false);

  const [currentPwInput, setCurrentPwInput] = useState('');
  const [newPwInput, setNewPwInput] = useState('');
  const [confirmPwInput, setConfirmPwInput] = useState('');
  const [unlockPwInput, setUnlockPwInput] = useState('');
  const [forgotPhraseInput, setForgotPhraseInput] = useState('');
  const [lockError, setLockError] = useState<string | null>(null);

  // Media Upload State (Photos & Videos)
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [postMediaFile, setPostMediaFile] = useState<File | null>(null);
  const [postMediaUrl, setPostMediaUrl] = useState('');
  const [oppMediaFile, setOppMediaFile] = useState<File | null>(null);
  const [oppMediaUrl, setOppMediaUrl] = useState('');

  // Edit Post State
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editPostTitleAm, setEditPostTitleAm] = useState('');
  const [editPostTitleEn, setEditPostTitleEn] = useState('');
  const [editPostBodyAm, setEditPostBodyAm] = useState('');
  const [editPostBodyEn, setEditPostBodyEn] = useState('');
  const [editPostMediaUrl, setEditPostMediaUrl] = useState('');
  const [editPostMediaFile, setEditPostMediaFile] = useState<File | null>(null);
  const [editPostBreaking, setEditPostBreaking] = useState(false);

  // Admin Data Collections
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [requests, setRequests] = useState<ServiceRequestRow[]>([]);
  const [forms, setForms] = useState<CustomFormRow[]>([]);
  const [submissions, setSubmissions] = useState<FormSubmissionRow[]>([]);
  const [posts, setPosts] = useState<HubPostRow[]>([]);
  const [opportunities, setOpportunities] = useState<OpportunityRow[]>([]);
  const [reports, setReports] = useState<ReportRow[]>([]);

  // Form builder state
  const [formTitleAm, setFormTitleAm] = useState('');
  const [formTitleEn, setFormTitleEn] = useState('');
  const [formDescAm, setFormDescAm] = useState('');
  const [formDescEn, setFormDescEn] = useState('');
  const [formAudience, setFormAudience] = useState('University Students');
  const [formDeadline, setFormDeadline] = useState('');
  const [formPublished, setFormPublished] = useState(true);
  const [builderFields, setBuilderFields] = useState<CustomFormField[]>([
    {
      id: 'university',
      label_am: 'ዩኒቨርሲቲ / ተቋም',
      label_en: 'University / Organization',
      type: 'text',
      required: true,
    },
  ]);

  // Post publisher state
  const [postTitleAm, setPostTitleAm] = useState('');
  const [postTitleEn, setPostTitleEn] = useState('');
  const [postBodyAm, setPostBodyAm] = useState('');
  const [postBodyEn, setPostBodyEn] = useState('');
  const [postSource, setPostSource] = useState('Dawit Hub');
  const [postBreaking, setPostBreaking] = useState(false);

  // Opportunity publisher state
  const [oppType, setOppType] = useState('scholarship');
  const [oppTitleAm, setOppTitleAm] = useState('');
  const [oppTitleEn, setOppTitleEn] = useState('');
  const [oppOrg, setOppOrg] = useState('');
  const [oppCountry, setOppCountry] = useState('');
  const [oppUrl, setOppUrl] = useState('');
  const [oppDeadline, setOppDeadline] = useState('');
  const [oppDescAm, setOppDescAm] = useState('');
  const [oppDescEn, setOppDescEn] = useState('');

  // Broadcast notification state
  const [notifTitle, setNotifTitle] = useState('');
  const [notifBody, setNotifBody] = useState('');
  const [notifLink, setNotifLink] = useState('/hub');

  const isAm = lang === 'am';

  useEffect(() => {
    let active = true;
    const verifyAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!active) return;
      const email = user?.email ?? null;
      setActiveSessionEmail(email);
      setIsAuthorizedAdmin(Boolean(user && isAllowedAdminEmail(email)));
      setAdminChecked(true);
    };

    void verifyAdmin();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      const email = session?.user?.email ?? null;
      setActiveSessionEmail(email);
      setIsAuthorizedAdmin(Boolean(session?.user && isAllowedAdminEmail(email)));
      setAdminChecked(true);
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOutCurrentSession = async () => {
    setSigningOutSession(true);
    try {
      await supabase.auth.signOut();
      setActiveSessionEmail(null);
      setIsAuthorizedAdmin(false);
    } finally {
      setSigningOutSession(false);
    }
  };

  const notify = (msg: string, isError = false) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast({ msg, isError });
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setGroupIndex((prev) => (prev + 1) % PHOTO_GROUPS.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(ADMIN_LOCK_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredAdminLock;
        if (parsed?.salt && parsed?.hash) {
          setStoredLock(parsed);
          setIsUnlocked(false);
          setLockMode('unlock');
        } else {
          setLockMode('setup');
        }
      } else {
        setLockMode('setup');
      }
    } finally {
      setLockReady(true);
    }
  }, []);

  const saveNewPasswordAndLock = async (rawNewPw: string, successMessage: string) => {
    setLockError(null);
    const strength = evaluatePasswordStrength(rawNewPw);
    if (!strength.isStrong) {
      setLockError(
        isAm
          ? 'ጠንካራ የይለፍ ቃል ያስገቡ (ቢያንስ 8 ፊደላት፣ ታላቅ/ትንሽ ፊደል፣ ቁጥር እና ምልክት)።'
          : 'Enter a strong password (at least 8 characters, uppercase, lowercase, number, and symbol).'
      );
      return;
    }

    if (rawNewPw !== confirmPwInput) {
      setLockError(isAm ? 'የይለፍ ቃሎቹ አይመሳሰሉም።' : 'New passwords do not match.');
      return;
    }

    const salt = generateSalt();
    const hash = await hashPasswordWithSalt(rawNewPw, salt);
    const nextLock: StoredAdminLock = { salt, hash };

    localStorage.setItem(ADMIN_LOCK_STORAGE_KEY, JSON.stringify(nextLock));
    setStoredLock(nextLock);
    setCurrentPwInput('');
    setNewPwInput('');
    setConfirmPwInput('');
    setUnlockPwInput('');
    setForgotPhraseInput('');
    setIsUnlocked(false);
    setLockMode('unlock');
    notify(successMessage);
  };

  const handleInitialSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveNewPasswordAndLock(
      newPwInput,
      isAm
        ? 'ጠንካራ የይለፍ ቃል ተቀምጧል እና አስተዳዳሪ ገጹ ተቆልፏል።'
        : 'Strong password created and admin portal locked.'
    );
  };

  const handleUnlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLockError(null);
    if (!storedLock) {
      setLockMode('setup');
      return;
    }

    const attemptHash = await hashPasswordWithSalt(unlockPwInput, storedLock.salt);
    if (attemptHash === storedLock.hash) {
      setIsUnlocked(true);
      setUnlockPwInput('');
    } else {
      setLockError(isAm ? 'የተሳሳተ የይለፍ ቃል።' : 'Incorrect password.');
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLockError(null);
    if (!storedLock) {
      setLockMode('setup');
      return;
    }

    const currentHash = await hashPasswordWithSalt(currentPwInput, storedLock.salt);
    if (currentHash !== storedLock.hash) {
      setLockError(
        isAm ? 'የአሁኑ የይለፍ ቃል ትክክል አይደለም።' : 'Current password is incorrect.'
      );
      return;
    }

    await saveNewPasswordAndLock(
      newPwInput,
      isAm
        ? 'የይለፍ ቃል ተቀይሯል እና ገጹ ተቆልፏል።'
        : 'Password changed and admin portal locked.'
    );
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLockError(null);

    if (forgotPhraseInput.trim() !== FORGOT_RESET_PHRASE) {
      setLockError(
        isAm
          ? `እባክዎ ማረጋገጫ ቃሉን በትክክል ይጻፉ፡ ${FORGOT_RESET_PHRASE}`
          : `Type the exact confirmation phrase: ${FORGOT_RESET_PHRASE}`
      );
      return;
    }

    await saveNewPasswordAndLock(
      newPwInput,
      isAm
        ? 'አዲስ ጠንካራ የይለፍ ቃል ተቀምጧል እና ገጹ ተቆልፏል።'
        : 'New strong password set and admin portal locked.'
    );
  };

  const handleLockNow = () => {
    setIsUnlocked(false);
    setUnlockPwInput('');
    setLockError(null);
    setLockMode(storedLock ? 'unlock' : 'setup');
  };

  const openChangePassword = () => {
    setLockError(null);
    setCurrentPwInput('');
    setNewPwInput('');
    setConfirmPwInput('');
    setIsUnlocked(false);
    setLockMode(storedLock ? 'change' : 'setup');
  };

  const openForgotPassword = () => {
    setLockError(null);
    setForgotPhraseInput('');
    setNewPwInput('');
    setConfirmPwInput('');
    setIsUnlocked(false);
    setLockMode('forgot');
  };

  const uploadMediaToBucket = async (file: File, folder: string): Promise<string | null> => {
    setUploadingMedia(true);
    try {
      const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = `${folder}/${Date.now()}-${cleanName}`;

      const { error: uploadError } = await supabase.storage
        .from('hub-media')
        .upload(filePath, file, { upsert: false });

      if (uploadError) {
        notify(uploadError.message, true);
        return null;
      }

      const { data } = supabase.storage.from('hub-media').getPublicUrl(filePath);
      return data?.publicUrl || null;
    } finally {
      setUploadingMedia(false);
    }
  };

  const loadAllAdminData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        profilesRes,
        reqsRes,
        formsRes,
        subsRes,
        postsRes,
        oppsRes,
        reportsRes,
      ] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('service_requests').select('*').order('created_at', { ascending: false }),
        supabase.from('custom_forms').select('*').order('created_at', { ascending: false }),
        supabase
          .from('custom_form_submissions')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase.from('hub_posts').select('*').order('created_at', { ascending: false }),
        supabase.from('opportunities').select('*').order('created_at', { ascending: false }),
        supabase.from('content_reports').select('*').order('created_at', { ascending: false }),
      ]);

      if (profilesRes.data) setProfiles(profilesRes.data as ProfileRow[]);
      if (reqsRes.data) setRequests(reqsRes.data as ServiceRequestRow[]);
      if (formsRes.data) setForms(formsRes.data as CustomFormRow[]);
      if (subsRes.data) setSubmissions(subsRes.data as FormSubmissionRow[]);
      if (postsRes.data) {
        const { data: trData } = await supabase
          .from('hub_post_translations')
          .select('post_id, lang_code, title, body');
        const grouped: Record<string, PostTranslationItem[]> = {};
        for (const row of trData || []) {
          const r = row as { post_id: string; lang_code: string; title: string; body?: string };
          if (!grouped[r.post_id]) grouped[r.post_id] = [];
          grouped[r.post_id].push({ lang_code: r.lang_code, title: r.title, body: r.body });
        }
        setPosts(
          (postsRes.data as HubPostRow[]).map((p) => ({
            ...p,
            hub_post_translations: grouped[p.id] || [],
          }))
        );
      }
      if (oppsRes.data) {
        const { data: oppTrData } = await supabase
          .from('opportunity_translations')
          .select('opportunity_id, lang_code, title');
        const groupedOpp: Record<string, { lang_code: string; title: string }[]> = {};
        for (const row of oppTrData || []) {
          const r = row as { opportunity_id: string; lang_code: string; title: string };
          if (!groupedOpp[r.opportunity_id]) groupedOpp[r.opportunity_id] = [];
          groupedOpp[r.opportunity_id].push({ lang_code: r.lang_code, title: r.title });
        }
        setOpportunities(
          (oppsRes.data as OpportunityRow[]).map((o) => ({
            ...o,
            opportunity_translations: groupedOpp[o.id] || [],
          }))
        );
      }
      if (reportsRes.data) setReports(reportsRes.data as ReportRow[]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthorizedAdmin || !isUnlocked) return;

    let active = true;

    const runInitialLoad = async () => {
      setLoading(true);
      try {
        const [
          profilesRes,
          reqsRes,
          formsRes,
          subsRes,
          postsRes,
          oppsRes,
          reportsRes,
        ] = await Promise.all([
          supabase.from('profiles').select('*').order('created_at', { ascending: false }),
          supabase.from('service_requests').select('*').order('created_at', { ascending: false }),
          supabase.from('custom_forms').select('*').order('created_at', { ascending: false }),
          supabase
            .from('custom_form_submissions')
            .select('*')
            .order('created_at', { ascending: false }),
          supabase.from('hub_posts').select('*').order('created_at', { ascending: false }),
          supabase.from('opportunities').select('*').order('created_at', { ascending: false }),
          supabase.from('content_reports').select('*').order('created_at', { ascending: false }),
        ]);

        if (!active) return;

        if (profilesRes.data) setProfiles(profilesRes.data as ProfileRow[]);
        if (reqsRes.data) setRequests(reqsRes.data as ServiceRequestRow[]);
        if (formsRes.data) setForms(formsRes.data as CustomFormRow[]);
        if (subsRes.data) setSubmissions(subsRes.data as FormSubmissionRow[]);
        if (postsRes.data) {
          const { data: trData } = await supabase
            .from('hub_post_translations')
            .select('post_id, lang_code, title, body');
          if (!active) return;

          const grouped: Record<string, PostTranslationItem[]> = {};
          for (const row of trData || []) {
            const r = row as { post_id: string; lang_code: string; title: string; body?: string };
            if (!grouped[r.post_id]) grouped[r.post_id] = [];
            grouped[r.post_id].push({ lang_code: r.lang_code, title: r.title, body: r.body });
          }
          setPosts(
            (postsRes.data as HubPostRow[]).map((p) => ({
              ...p,
              hub_post_translations: grouped[p.id] || [],
            }))
          );
        }
        if (oppsRes.data) {
          const { data: oppTrData } = await supabase
            .from('opportunity_translations')
            .select('opportunity_id, lang_code, title');
          if (!active) return;

          const groupedOpp: Record<string, { lang_code: string; title: string }[]> = {};
          for (const row of oppTrData || []) {
            const r = row as { opportunity_id: string; lang_code: string; title: string };
            if (!groupedOpp[r.opportunity_id]) groupedOpp[r.opportunity_id] = [];
            groupedOpp[r.opportunity_id].push({ lang_code: r.lang_code, title: r.title });
          }
          setOpportunities(
            (oppsRes.data as OpportunityRow[]).map((o) => ({
              ...o,
              opportunity_translations: groupedOpp[o.id] || [],
            }))
          );
        }
        if (reportsRes.data) setReports(reportsRes.data as ReportRow[]);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void runInitialLoad();

    return () => {
      active = false;
    };
  }, [isAuthorizedAdmin, isUnlocked]);

  const handleCreateCustomForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('custom_forms').insert({
      title_am: formTitleAm.trim(),
      title_en: formTitleEn.trim() || formTitleAm.trim(),
      description_am: formDescAm.trim() || null,
      description_en: formDescEn.trim() || null,
      audience_tag: formAudience.trim() || 'general',
      fields: builderFields,
      is_published: formPublished,
      deadline_at: formDeadline ? new Date(formDeadline).toISOString() : null,
    });

    if (!error) {
      setFormTitleAm('');
      setFormTitleEn('');
      setFormDescAm('');
      setFormDescEn('');
      setFormDeadline('');
      notify(isAm ? 'ቅጹ ተፈጥሯል እና በተጠቃሚ ገጽ ላይ ታይቷል።' : 'Form created and synced.');
      void loadAllAdminData();
    } else {
      notify(error.message, true);
    }
  };

  const toggleFormVisibility = async (form: CustomFormRow) => {
    const { error } = await supabase
      .from('custom_forms')
      .update({ is_published: !form.is_published })
      .eq('id', form.id);
    if (!error) {
      notify(!form.is_published ? 'Visible on UI.' : 'Hidden from UI.');
      void loadAllAdminData();
    } else {
      notify(error.message, true);
    }
  };

  const deleteCustomForm = async (id: string) => {
    const { error } = await supabase.from('custom_forms').delete().eq('id', id);
    if (!error) {
      notify('Form removed.');
      void loadAllAdminData();
    } else {
      notify(error.message, true);
    }
  };

  const updateSubmissionStatus = async (id: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('custom_form_submissions')
      .update({ status })
      .eq('id', id);
    if (!error) {
      notify(`Submission ${status}.`);
      void loadAllAdminData();
    } else {
      notify(error.message, true);
    }
  };

  const deleteSubmission = async (id: string) => {
    const { error } = await supabase.from('custom_form_submissions').delete().eq('id', id);
    if (!error) {
      notify('Submission removed.');
      void loadAllAdminData();
    } else {
      notify(error.message, true);
    }
  };

  const updateServiceRequest = async (id: string, patch: Record<string, unknown>) => {
    const { error } = await supabase
      .from('service_requests')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (!error) {
      notify('Service request updated.');
      void loadAllAdminData();
    } else {
      notify(error.message, true);
    }
  };

  const deleteServiceRequest = async (id: string) => {
    const { error } = await supabase.from('service_requests').delete().eq('id', id);
    if (!error) {
      notify('Service request removed.');
      void loadAllAdminData();
    } else {
      notify(error.message, true);
    }
  };

  const updateUserProfile = async (id: string, patch: Partial<ProfileRow>) => {
    const { error } = await supabase.from('profiles').update(patch).eq('id', id);
    if (!error) {
      notify('User updated.');
      void loadAllAdminData();
    } else {
      notify(error.message, true);
    }
  };

  const deleteUserProfile = async (id: string) => {
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (!error) {
      notify('User profile removed.');
      void loadAllAdminData();
    } else {
      notify(error.message, true);
    }
  };

  const handlePublishPost = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalMediaUrl = postMediaUrl.trim();
    if (postMediaFile) {
      const uploaded = await uploadMediaToBucket(postMediaFile, 'posts');
      if (!uploaded) return;
      finalMediaUrl = uploaded;
    }

    const mediaKind = postMediaFile?.type.startsWith('video/')
      ? 'video'
      : finalMediaUrl
      ? 'image'
      : null;

    const cleanSource = postSource.trim() || 'Dawit Hub';
    const fullPayload: Record<string, unknown> = {
      post_type: 'news',
      status: 'published',
      is_breaking: postBreaking,
      source_name: cleanSource,
      publish_at: new Date().toISOString(),
    };
    if (finalMediaUrl) {
      fullPayload.media_url = finalMediaUrl;
      if (mediaKind) fullPayload.media_type = mediaKind;
    }

    let { data: postData, error } = await supabase
      .from('hub_posts')
      .insert(fullPayload)
      .select('id')
      .single();

    if (error && finalMediaUrl) {
      const fallback = await supabase
        .from('hub_posts')
        .insert({
          post_type: 'news',
          status: 'published',
          is_breaking: postBreaking,
          source_name: `${cleanSource} | Media: ${finalMediaUrl}`,
          publish_at: new Date().toISOString(),
        })
        .select('id')
        .single();
      postData = fallback.data;
      error = fallback.error;
    }

    if (!error && postData) {
      await supabase.from('hub_post_translations').insert([
        {
          post_id: postData.id,
          lang_code: 'am',
          title: postTitleAm.trim(),
          body: postBodyAm.trim(),
        },
        {
          post_id: postData.id,
          lang_code: 'en',
          title: postTitleEn.trim() || postTitleAm.trim(),
          body: postBodyEn.trim() || postBodyAm.trim(),
        },
      ]);
      setPostTitleAm('');
      setPostTitleEn('');
      setPostBodyAm('');
      setPostBodyEn('');
      setPostMediaFile(null);
      setPostMediaUrl('');
      setPostBreaking(false);
      notify(isAm ? 'ልጥፉ ከሚዲያ ጋር ታትሟል።' : 'Post published.');
      void loadAllAdminData();
    } else if (error) {
      notify(error.message, true);
    }
  };

  const beginEditPost = (post: HubPostRow) => {
    const amTr = post.hub_post_translations?.find((t) => t.lang_code === 'am');
    const enTr = post.hub_post_translations?.find((t) => t.lang_code === 'en');
    const mediaInfo = extractMediaFromPost(post);

    setEditingPostId(post.id);
    setEditPostTitleAm(amTr?.title || '');
    setEditPostTitleEn(enTr?.title || '');
    setEditPostBodyAm(amTr?.body || '');
    setEditPostBodyEn(enTr?.body || '');
    setEditPostMediaUrl(mediaInfo.url || '');
    setEditPostMediaFile(null);
    setEditPostBreaking(Boolean(post.is_breaking));
  };

  const cancelEditPost = () => {
    setEditingPostId(null);
    setEditPostMediaFile(null);
  };

  const handleSaveEditedPost = async (post: HubPostRow) => {
    let finalMediaUrl = editPostMediaUrl.trim() || null;
    if (editPostMediaFile) {
      const uploaded = await uploadMediaToBucket(editPostMediaFile, 'posts');
      if (!uploaded) return;
      finalMediaUrl = uploaded;
    }

    const mediaKind = editPostMediaFile?.type.startsWith('video/')
      ? 'video'
      : finalMediaUrl
      ? 'image'
      : null;

    const updatePayload: Record<string, unknown> = {
      is_breaking: editPostBreaking,
      media_url: finalMediaUrl,
      media_type: mediaKind,
    };

    const { error: postErr } = await supabase
      .from('hub_posts')
      .update(updatePayload)
      .eq('id', post.id);

    if (postErr) {
      notify(postErr.message, true);
      return;
    }

    if (editPostTitleAm.trim() || editPostBodyAm.trim()) {
      await supabase
        .from('hub_post_translations')
        .upsert(
          {
            post_id: post.id,
            lang_code: 'am',
            title: editPostTitleAm.trim() || editPostTitleEn.trim() || 'Untitled',
            body: editPostBodyAm.trim() || editPostBodyEn.trim() || '',
          },
          { onConflict: 'post_id,lang_code' }
        );
    }

    if (editPostTitleEn.trim() || editPostBodyEn.trim()) {
      await supabase
        .from('hub_post_translations')
        .upsert(
          {
            post_id: post.id,
            lang_code: 'en',
            title: editPostTitleEn.trim() || editPostTitleAm.trim() || 'Untitled',
            body: editPostBodyEn.trim() || editPostBodyAm.trim() || '',
          },
          { onConflict: 'post_id,lang_code' }
        );
    }

    setEditingPostId(null);
    setEditPostMediaFile(null);
    notify(isAm ? 'ልጥፉ ተሻሽሏል።' : 'Post updated.');
    void loadAllAdminData();
  };

  const togglePostStatus = async (post: HubPostRow) => {
    const nextStatus = post.status === 'published' ? 'draft' : 'published';
    const { error } = await supabase
      .from('hub_posts')
      .update({ status: nextStatus })
      .eq('id', post.id);
    if (!error) {
      notify(`Post ${nextStatus}.`);
      void loadAllAdminData();
    } else {
      notify(error.message, true);
    }
  };

  const deletePost = async (id: string) => {
    const { error: trErr } = await supabase
      .from('hub_post_translations')
      .delete()
      .eq('post_id', id);
    if (trErr) {
      notify(trErr.message, true);
      return;
    }

    const { error } = await supabase.from('hub_posts').delete().eq('id', id);
    if (!error) {
      if (editingPostId === id) setEditingPostId(null);
      notify(isAm ? 'ልጥፉ ተወግዷል።' : 'Post deleted.');
      void loadAllAdminData();
    } else {
      notify(error.message, true);
    }
  };

  const handlePublishOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalMediaUrl = oppMediaUrl.trim();
    if (oppMediaFile) {
      const uploaded = await uploadMediaToBucket(oppMediaFile, 'opportunities');
      if (!uploaded) return;
      finalMediaUrl = uploaded;
    }

    const oppPayload: Record<string, unknown> = {
      opportunity_type: oppType,
      organization: oppOrg.trim() || null,
      country: oppCountry.trim() || null,
      application_url: oppUrl.trim() || null,
      deadline_at: oppDeadline ? new Date(oppDeadline).toISOString() : null,
      is_active: true,
    };
    if (finalMediaUrl) {
      oppPayload.media_url = finalMediaUrl;
    }

    let { data: oppData, error } = await supabase
      .from('opportunities')
      .insert(oppPayload)
      .select('id')
      .single();

    if (error && finalMediaUrl) {
      const fallback = await supabase
        .from('opportunities')
        .insert({
          opportunity_type: oppType,
          organization: oppOrg.trim() || null,
          country: oppCountry.trim() || null,
          application_url: oppUrl.trim() || finalMediaUrl,
          deadline_at: oppDeadline ? new Date(oppDeadline).toISOString() : null,
          is_active: true,
        })
        .select('id')
        .single();
      oppData = fallback.data;
      error = fallback.error;
    }

    if (!error && oppData) {
      await supabase.from('opportunity_translations').insert([
        {
          opportunity_id: oppData.id,
          lang_code: 'am',
          title: oppTitleAm.trim(),
          description: oppDescAm.trim(),
        },
        {
          opportunity_id: oppData.id,
          lang_code: 'en',
          title: oppTitleEn.trim() || oppTitleAm.trim(),
          description: oppDescEn.trim() || oppDescAm.trim(),
        },
      ]);
      setOppTitleAm('');
      setOppTitleEn('');
      setOppOrg('');
      setOppCountry('');
      setOppUrl('');
      setOppDeadline('');
      setOppDescAm('');
      setOppDescEn('');
      setOppMediaFile(null);
      setOppMediaUrl('');
      notify(isAm ? 'እድሉ ተጨምሯል።' : 'Opportunity published.');
      void loadAllAdminData();
    } else if (error) {
      notify(error.message, true);
    }
  };

  const toggleOpportunityActive = async (opp: OpportunityRow) => {
    const { error } = await supabase
      .from('opportunities')
      .update({ is_active: !opp.is_active })
      .eq('id', opp.id);
    if (!error) {
      notify(!opp.is_active ? 'Opportunity approved & active.' : 'Opportunity paused.');
      void loadAllAdminData();
    } else {
      notify(error.message, true);
    }
  };

  const deleteOpportunity = async (id: string) => {
    const { error } = await supabase.from('opportunities').delete().eq('id', id);
    if (!error) {
      notify('Opportunity removed.');
      void loadAllAdminData();
    } else {
      notify(error.message, true);
    }
  };

  const updateReportStatus = async (id: string, status: 'resolved' | 'dismissed') => {
    const { error } = await supabase
      .from('content_reports')
      .update({ status })
      .eq('id', id);
    if (!error) {
      notify(`Report ${status}.`);
      void loadAllAdminData();
    } else {
      notify(error.message, true);
    }
  };

  const deleteReport = async (id: string) => {
    const { error } = await supabase.from('content_reports').delete().eq('id', id);
    if (!error) {
      notify('Report removed.');
      void loadAllAdminData();
    } else {
      notify(error.message, true);
    }
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('notifications').insert({
      user_id: null,
      category: 'announcement',
      title: notifTitle.trim(),
      message: notifBody.trim(),
      link_url: notifLink.trim() || '/hub',
    });

    if (!error) {
      setNotifTitle('');
      setNotifBody('');
      notify('Notification broadcast sent.');
    } else {
      notify(error.message, true);
    }
  };

  const navItems: { id: AdminTab; labelAm: string; labelEn: string; icon: React.ReactNode }[] = [
    {
      id: 'overview',
      labelAm: 'አጠቃላይ እይታ',
      labelEn: 'Overview',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'forms',
      labelAm: 'የፕሮግራም ቅጾች እና ምዝገባ',
      labelEn: 'Forms & Submissions',
      icon: <FilePlus2 className="w-4 h-4" />,
    },
    {
      id: 'services',
      labelAm: 'የአገልግሎት ጥያቄዎች',
      labelEn: 'Service Requests',
      icon: <Briefcase className="w-4 h-4" />,
    },
    {
      id: 'users',
      labelAm: 'ተጠቃሚዎች',
      labelEn: 'Users & Roles',
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: 'posts',
      labelAm: 'ዜና እና ልጥፎች',
      labelEn: 'Hub Posts',
      icon: <Newspaper className="w-4 h-4" />,
    },
    {
      id: 'opportunities',
      labelAm: 'እድሎች',
      labelEn: 'Opportunities',
      icon: <Award className="w-4 h-4" />,
    },
    {
      id: 'notifications',
      labelAm: 'ማሳወቂያዎች',
      labelEn: 'Notifications',
      icon: <Bell className="w-4 h-4" />,
    },
    {
      id: 'reports',
      labelAm: 'ሪፖርቶች',
      labelEn: 'Reports',
      icon: <ShieldAlert className="w-4 h-4" />,
    },
  ];

  const visiblePhotos = PHOTO_GROUPS[groupIndex];
  const q = searchTerm.trim().toLowerCase();

  const renderPhotoBackdrop = () => (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none bg-slate-950 flex flex-col justify-center"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 w-full h-full">
        {visiblePhotos.map((photo, idx) => (
          <div
            key={`${groupIndex}-${photo.src}-${idx}`}
            className="relative w-full h-full border-r border-white/10 last:border-r-0 flex items-center justify-center bg-slate-950"
          >
            <img
              src={photo.src}
              alt={photo.alt}
              loading={idx === 0 ? 'eager' : 'lazy'}
              className="w-full h-full object-contain opacity-60 transition-opacity duration-700"
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-slate-950/60" />
    </div>
  );

  const renderStrengthChecklist = (pwValue: string) => {
    const strength = evaluatePasswordStrength(pwValue);
    return (
      <div className="text-xs text-slate-300 space-y-1">
        <p className="font-bold text-amber-300">
          {isAm ? 'ጠንካራ የይለፍ ቃል መስፈርቶች፡' : 'Strong password checklist:'}
        </p>
        <p>
          {strength.checks.length ? '✓' : '•'}{' '}
          {isAm ? 'ቢያንስ 8 ፊደላት' : 'At least 8 characters'}
        </p>
        <p>
          {strength.checks.upper && strength.checks.lower ? '✓' : '•'}{' '}
          {isAm ? 'ታላቅ እና ትንሽ ፊደል (A-z)' : 'Uppercase & lowercase letters (A-z)'}
        </p>
        <p>
          {strength.checks.number && strength.checks.symbol ? '✓' : '•'}{' '}
          {isAm ? 'ቁጥር እና ምልክት (0-9, !@#)' : 'Number & symbol (0-9, !@#)'}
        </p>
      </div>
    );
  };

  if (!adminChecked) {
    return (
      <div className="relative min-h-screen text-white flex items-center justify-center px-4">
        {renderPhotoBackdrop()}
        <p className="relative z-10 text-sm text-slate-200">
          {isAm ? 'የአስተዳዳሪ ፈቃድ በመፈተሽ ላይ...' : 'Verifying admin access...'}
        </p>
      </div>
    );
  }

  if (!isAuthorizedAdmin) {
    return (
      <div className="relative min-h-screen text-white flex items-center justify-center px-4">
        {renderPhotoBackdrop()}
        <div className="relative z-10 w-full max-w-md bg-slate-950/85 backdrop-blur-md border border-red-500/40 p-6 sm:p-8 space-y-4 text-center">
          <h1 className="text-xl font-black text-red-400">
            {isAm ? 'ለአስተዳዳሪ ብቻ' : 'Admin Official Only'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {isAm
              ? 'ይህ ገጽ ለዋናው አስተዳዳሪ ብቻ ነው፤ ለእርስዎ የተፈቀደ አይደለም። እባክዎ በአስተዳዳሪ መለያ ይግቡ።'
              : 'This page is for the official administrator only, not for you. Please sign in with an official admin account.'}
          </p>
          <div className="bg-slate-900/80 border border-white/15 px-3 py-2 text-xs text-slate-300">
            <span>{isAm ? 'የአሁኑ ኢሜይል፡ ' : 'Current session: '}</span>
            <span className="font-mono text-amber-300">
              {activeSessionEmail || (isAm ? 'ምንም መለያ አልገባም' : 'No active session')}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/auth"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold uppercase"
            >
              {isAm ? 'ይግቡ' : 'Sign In'}
            </Link>
            {activeSessionEmail && (
              <button
                type="button"
                disabled={signingOutSession}
                onClick={handleSignOutCurrentSession}
                className="inline-flex items-center gap-1 px-4 py-2 bg-amber-600/90 hover:bg-amber-600 disabled:opacity-60 text-white text-xs font-extrabold uppercase cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{isAm ? 'ውጣ / ቀይር' : 'Sign Out'}</span>
              </button>
            )}
            <Link
              href="/"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white text-xs font-bold uppercase"
            >
              {isAm ? 'ዋና ገጽ' : 'Home'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!lockReady) {
    return null;
  }

  if (!isUnlocked) {
    return (
      <div className="relative min-h-screen text-white flex items-center justify-center px-4 py-10">
        {renderPhotoBackdrop()}

        <div className="relative z-10 w-full max-w-md bg-slate-950/80 backdrop-blur-md border border-white/25 p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-300">
              <Lock className="w-3.5 h-3.5" />
              <span>
                {lockMode === 'setup'
                  ? isAm
                    ? 'የይለፍ ቃል ይፍጠሩ'
                    : 'Create Admin Password'
                  : lockMode === 'change'
                  ? isAm
                    ? 'የይለፍ ቃል ቀይር'
                    : 'Change Password'
                  : lockMode === 'forgot'
                  ? isAm
                    ? 'የተረሳ የይለፍ ቃል መልሶ ማቋቋሚያ'
                    : 'Forgot Password Reset'
                  : isAm
                  ? 'አስተዳዳሪ ተቆልፏል'
                  : 'Admin Locked'}
              </span>
            </span>

            <Link href="/" className="text-xs text-slate-300 hover:text-white underline">
              {isAm ? 'ዋና ገጽ' : 'Home'}
            </Link>
          </div>

          {activeSessionEmail && (
            <div className="flex items-center justify-between gap-2 bg-emerald-950/40 border border-emerald-400/25 px-3 py-1.5 text-xs text-emerald-200">
              <span className="inline-flex items-center gap-1.5 truncate">
                <UserCheck className="w-3.5 h-3.5 shrink-0 text-emerald-300" />
                <span className="truncate font-mono">{activeSessionEmail}</span>
              </span>
            </div>
          )}

          {lockError && (
            <p className="text-xs font-bold text-red-300 bg-red-950/70 border border-red-500/40 p-2.5">
              {lockError}
            </p>
          )}

          {lockMode === 'setup' && (
            <form onSubmit={handleInitialSetupSubmit} className="space-y-4">
              <h1 className="text-2xl font-black text-white">
                {isAm ? 'ጠንካራ የይለፍ ቃል ያክሉ እና ይቆልፉ' : 'Add Strong Password & Lock'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {isAm
                  ? 'የአስተዳዳሪ ገጹን ለመጠበቅ ጠንካራ የይለፍ ቃል ያስገቡ። ካስቀመጡ በኋላ ወዲያውኑ ይቆለፋል።'
                  : 'Create a strong password for the admin portal. It locks immediately once saved.'}
              </p>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPwInput}
                  onChange={(e) => setNewPwInput(e.target.value)}
                  placeholder={isAm ? 'ጠንካራ የይለፍ ቃል *' : 'Strong password *'}
                  className="w-full bg-slate-900/85 border border-white/25 px-3.5 py-2.5 pr-10 text-sm text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPwInput}
                onChange={(e) => setConfirmPwInput(e.target.value)}
                placeholder={isAm ? 'የይለፍ ቃሉን እንደገና ያስገቡ *' : 'Confirm password *'}
                className="w-full bg-slate-900/85 border border-white/25 px-3.5 py-2.5 text-sm text-white"
              />

              {renderStrengthChecklist(newPwInput)}

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider cursor-pointer"
              >
                {isAm ? 'አስቀምጥ እና ቆልፍ' : 'Save & Lock'}
              </button>
            </form>
          )}

          {lockMode === 'unlock' && (
            <form onSubmit={handleUnlockSubmit} className="space-y-4">
              <h1 className="text-2xl font-black text-white">
                {isAm ? 'የይለፍ ቃል ያስገቡ' : 'Enter Admin Password'}
              </h1>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={unlockPwInput}
                  onChange={(e) => setUnlockPwInput(e.target.value)}
                  placeholder={isAm ? 'የይለፍ ቃል *' : 'Password *'}
                  className="w-full bg-slate-900/85 border border-white/25 px-3.5 py-2.5 pr-10 text-sm text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider cursor-pointer"
              >
                {isAm ? 'ክፈት' : 'Unlock Portal'}
              </button>

              <div className="flex items-center justify-between pt-2 border-t border-white/15 text-xs">
                <button
                  type="button"
                  onClick={openChangePassword}
                  className="text-slate-200 hover:text-amber-300 underline cursor-pointer"
                >
                  {isAm ? 'የይለፍ ቃል ቀይር' : 'Change Password'}
                </button>
                <button
                  type="button"
                  onClick={openForgotPassword}
                  className="text-amber-300 hover:underline cursor-pointer"
                >
                  {isAm ? 'የይለፍ ቃል ረሳሁ?' : 'Forgot Password?'}
                </button>
              </div>
            </form>
          )}

          {lockMode === 'change' && (
            <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
              <h1 className="text-2xl font-black text-white">
                {isAm ? 'የይለፍ ቃል ይቀይሩ' : 'Change Admin Password'}
              </h1>

              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={currentPwInput}
                onChange={(e) => setCurrentPwInput(e.target.value)}
                placeholder={isAm ? 'የአሁኑ የይለፍ ቃል *' : 'Current password *'}
                className="w-full bg-slate-900/85 border border-white/25 px-3.5 py-2.5 text-sm text-white"
              />

              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={newPwInput}
                onChange={(e) => setNewPwInput(e.target.value)}
                placeholder={isAm ? 'አዲስ ጠንካራ የይለፍ ቃል *' : 'New strong password *'}
                className="w-full bg-slate-900/85 border border-white/25 px-3.5 py-2.5 text-sm text-white"
              />

              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPwInput}
                onChange={(e) => setConfirmPwInput(e.target.value)}
                placeholder={isAm ? 'አዲሱን የይለፍ ቃል ያረጋግጡ *' : 'Confirm new password *'}
                className="w-full bg-slate-900/85 border border-white/25 px-3.5 py-2.5 text-sm text-white"
              />

              {renderStrengthChecklist(newPwInput)}

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider cursor-pointer"
              >
                {isAm ? 'ቀይር እና ቆልፍ' : 'Update & Lock'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setLockError(null);
                  setLockMode('unlock');
                }}
                className="w-full text-xs text-slate-300 hover:text-white underline cursor-pointer"
              >
                {isAm ? 'ተመለስ' : 'Back to Unlock'}
              </button>
            </form>
          )}

          {lockMode === 'forgot' && (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <h1 className="text-2xl font-black text-white">
                {isAm ? 'የተረሳ የይለፍ ቃል ማደስ' : 'Recover Forgotten Password'}
              </h1>
              <p className="text-xs text-slate-200 leading-relaxed">
                {isAm
                  ? `ለማረጋገጥ "${FORGOT_RESET_PHRASE}" ይጻፉ እና አዲስ ጠንካራ የይለፍ ቃል ያስገቡ።`
                  : `Type "${FORGOT_RESET_PHRASE}" to confirm reset and set a new strong password.`}
              </p>

              <input
                type="text"
                required
                value={forgotPhraseInput}
                onChange={(e) => setForgotPhraseInput(e.target.value)}
                placeholder={FORGOT_RESET_PHRASE}
                className="w-full bg-slate-900/85 border border-white/25 px-3.5 py-2.5 text-xs text-white font-mono"
              />

              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={newPwInput}
                onChange={(e) => setNewPwInput(e.target.value)}
                placeholder={isAm ? 'አዲስ ጠንካራ የይለፍ ቃል *' : 'New strong password *'}
                className="w-full bg-slate-900/85 border border-white/25 px-3.5 py-2.5 text-sm text-white"
              />

              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPwInput}
                onChange={(e) => setConfirmPwInput(e.target.value)}
                placeholder={isAm ? 'አዲሱን የይለፍ ቃል ያረጋግጡ *' : 'Confirm new password *'}
                className="w-full bg-slate-900/85 border border-white/25 px-3.5 py-2.5 text-sm text-white"
              />

              {renderStrengthChecklist(newPwInput)}

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider cursor-pointer"
              >
                {isAm ? 'አዲስ የይለፍ ቃል አስቀምጥ እና ቆልፍ' : 'Reset & Lock'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setLockError(null);
                  setLockMode('unlock');
                }}
                className="w-full text-xs text-slate-300 hover:text-white underline cursor-pointer"
              >
                {isAm ? 'ተመለስ' : 'Back to Unlock'}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-white">
      {renderPhotoBackdrop()}

      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-slate-950/70 backdrop-blur-xs border-b border-white/15">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-200 hover:text-amber-300"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{isAm ? 'ዋና ገጽ' : 'Home'}</span>
              </Link>
              <div className="h-4 w-px bg-white/20" />
              <span className="font-black text-xs sm:text-sm uppercase text-white">
                {isAm ? 'ዳዊት አስተዳዳሪ ማዕከል' : 'DAWIT ADMIN PORTAL'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative hidden md:block w-48">
                <Search className="w-3.5 h-3.5 text-slate-300 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={isAm ? 'ፈጣን ፍለጋ...' : 'Filter...'}
                  className="w-full bg-slate-950/65 border border-white/20 pl-8 pr-3 py-1 text-xs text-white placeholder:text-slate-400"
                />
              </div>

              <button
                type="button"
                onClick={openChangePassword}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 border border-white/25 text-xs font-bold cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-300" />
                <span>{isAm ? 'ቀይር' : 'Change PW'}</span>
              </button>

              <button
                type="button"
                onClick={handleLockNow}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isAm ? 'ቆልፍ' : 'Lock'}</span>
              </button>

              <button
                type="button"
                disabled={signingOutSession}
                onClick={handleSignOutCurrentSession}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 border border-white/25 text-xs font-bold cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-200" />
                <span className="hidden sm:inline">{isAm ? 'ውጣ' : 'Sign Out'}</span>
              </button>

              <Globe className="w-3.5 h-3.5 text-amber-300 hidden sm:block" />
              <div className="flex items-center gap-1">
                {SUPPORTED_LANGUAGES.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => setLang(item.code)}
                    className={`px-2 py-0.5 text-xs font-bold cursor-pointer ${
                      lang === item.code ? 'bg-red-600 text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {item.native}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        {toast && (
          <div
            className={`${
              toast.isError
                ? 'bg-red-900/95 border-red-400/40'
                : 'bg-emerald-900/90 border-emerald-400/30'
            } border-b text-white text-xs font-bold px-4 py-2 text-center`}
          >
            <span className="inline-flex items-center gap-1.5">
              {toast.isError ? (
                <XCircle className="w-4 h-4" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>{toast.msg}</span>
            </span>
          </div>
        )}

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
          {activeSessionEmail && (
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-slate-950/60 border border-white/15 px-3.5 py-2">
              <span className="inline-flex items-center gap-1.5 text-emerald-300 font-semibold">
                <UserCheck className="w-4 h-4" />
                <span>{isAm ? 'የገባው አስተዳዳሪ፡' : 'Signed-in Admin:'}</span>
                <span className="font-mono text-white">{activeSessionEmail}</span>
              </span>
              <span className="text-slate-300">
                {isAm ? 'የቀጥታ ዳታቤዝ ግንኙነት ንቁ ነው' : 'Live Supabase session active'}
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-white/20 pb-6">
            <div>
              <p className="text-xs font-bold uppercase text-amber-300">
                {isAm ? 'ተጠቃሚዎች' : 'Users'}
              </p>
              <p className="text-2xl font-black text-white">{profiles.length}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-amber-300">
                {isAm ? 'የአገልግሎት ጥያቄዎች' : 'Service Requests'}
              </p>
              <p className="text-2xl font-black text-white">{requests.length}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-amber-300">
                {isAm ? 'ቅጾች / ምዝገባዎች' : 'Forms / Submissions'}
              </p>
              <p className="text-2xl font-black text-white">
                {forms.length} / {submissions.length}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-amber-300">
                {isAm ? 'ልጥፎች / እድሎች' : 'Posts / Opps'}
              </p>
              <p className="text-2xl font-black text-white">
                {posts.length} / {opportunities.length}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 border-b border-white/20 pb-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-extrabold uppercase tracking-wider border transition cursor-pointer ${
                  tab === item.id
                    ? 'bg-red-600 border-red-600 text-white'
                    : 'bg-slate-950/60 border-white/20 text-slate-200 hover:border-white'
                }`}
              >
                {item.icon}
                <span>{isAm ? item.labelAm : item.labelEn}</span>
              </button>
            ))}
          </div>

          {loading ? (
            <p className="text-sm text-slate-200">{isAm ? 'መረጃ በመጫን ላይ...' : 'Loading...'}</p>
          ) : (
            <>
              {tab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="border-t-2 border-amber-300 pt-4 space-y-3">
                    <h2 className="text-base font-black uppercase text-amber-300">
                      {isAm ? 'የቅርብ ጊዜ የአገልግሎት ጥያቄዎች' : 'Recent Service Requests'}
                    </h2>
                    {requests.slice(0, 6).map((r) => (
                      <div key={r.id} className="border-b border-white/10 pb-2 text-xs space-y-1">
                        <div className="flex justify-between font-bold text-white">
                          <span>{r.full_name}</span>
                          <span className="text-amber-300">{r.workflow_stage}</span>
                        </div>
                        <p className="text-slate-200">
                          {r.service_type} • {r.contact}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t-2 border-amber-300 pt-4 space-y-3">
                    <h2 className="text-base font-black uppercase text-amber-300">
                      {isAm ? 'የቅርብ ጊዜ ምዝገባዎች' : 'Recent Form Submissions'}
                    </h2>
                    {submissions.slice(0, 6).map((s) => (
                      <div key={s.id} className="border-b border-white/10 pb-2 text-xs space-y-1">
                        <div className="flex justify-between font-bold text-white">
                          <span>{s.submitter_name || 'Guest'}</span>
                          <span className="text-emerald-300">{s.status}</span>
                        </div>
                        <p className="text-slate-200">{s.submitter_contact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'forms' && (
                <div className="space-y-10">
                  <form
                    onSubmit={handleCreateCustomForm}
                    className="border-t-2 border-amber-300 pt-5 space-y-4 max-w-3xl"
                  >
                    <h2 className="text-xl font-black text-white">
                      {isAm ? 'አዲስ የፕሮግራም ቅጽ ይፍጠሩ' : 'Create Program Form'}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        value={formTitleAm}
                        onChange={(e) => setFormTitleAm(e.target.value)}
                        placeholder="የቅጹ ርዕስ (አማርኛ) *"
                        className="bg-slate-950/65 border border-white/25 px-3 py-2 text-sm text-white"
                      />
                      <input
                        type="text"
                        value={formTitleEn}
                        onChange={(e) => setFormTitleEn(e.target.value)}
                        placeholder="Form Title (English)"
                        className="bg-slate-950/65 border border-white/25 px-3 py-2 text-sm text-white"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <textarea
                        rows={2}
                        value={formDescAm}
                        onChange={(e) => setFormDescAm(e.target.value)}
                        placeholder="መግለጫ (አማርኛ)"
                        className="bg-slate-950/65 border border-white/25 px-3 py-2 text-sm text-white"
                      />
                      <textarea
                        rows={2}
                        value={formDescEn}
                        onChange={(e) => setFormDescEn(e.target.value)}
                        placeholder="Description (English)"
                        className="bg-slate-950/65 border border-white/25 px-3 py-2 text-sm text-white"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                      <input
                        type="text"
                        value={formAudience}
                        onChange={(e) => setFormAudience(e.target.value)}
                        placeholder="Audience"
                        className="bg-slate-950/65 border border-white/25 px-3 py-2 text-xs text-white"
                      />
                      <input
                        type="date"
                        value={formDeadline}
                        onChange={(e) => setFormDeadline(e.target.value)}
                        className="bg-slate-950/65 border border-white/25 px-3 py-2 text-xs text-white"
                      />
                      <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formPublished}
                          onChange={(e) => setFormPublished(e.target.checked)}
                        />
                        <span>{isAm ? 'በተጠቃሚ ገጽ ላይ ይታይ' : 'Show on UI'}</span>
                      </label>
                    </div>

                    <div className="space-y-2">
                      {builderFields.map((f, i) => (
                        <div key={f.id} className="grid grid-cols-12 gap-2 items-center">
                          <input
                            type="text"
                            value={f.label_am}
                            onChange={(e) =>
                              setBuilderFields((prev) =>
                                prev.map((item, idx) =>
                                  idx === i ? { ...item, label_am: e.target.value } : item
                                )
                              )
                            }
                            placeholder="ጥያቄ (አማርኛ)"
                            className="col-span-5 bg-slate-950/65 border border-white/25 px-2.5 py-1.5 text-xs text-white"
                          />
                          <input
                            type="text"
                            value={f.label_en}
                            onChange={(e) =>
                              setBuilderFields((prev) =>
                                prev.map((item, idx) =>
                                  idx === i ? { ...item, label_en: e.target.value } : item
                                )
                              )
                            }
                            placeholder="Question (English)"
                            className="col-span-6 bg-slate-950/65 border border-white/25 px-2.5 py-1.5 text-xs text-white"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setBuilderFields((prev) => prev.filter((_, idx) => idx !== i))
                            }
                            className="col-span-1 text-slate-300 hover:text-red-400 flex justify-center cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          setBuilderFields((prev) => [
                            ...prev,
                            {
                              id: `field_${Date.now()}`,
                              label_am: 'ተጨማሪ ጥያቄ',
                              label_en: 'Additional Question',
                              type: 'text',
                              required: false,
                            },
                          ])
                        }
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/10 border border-white/20 text-xs font-bold cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{isAm ? 'ጥያቄ ጨምር' : 'Add Field'}</span>
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold uppercase cursor-pointer"
                    >
                      {isAm ? 'ቅጹን አስቀምጥ' : 'Publish Form'}
                    </button>
                  </form>

                  <div className="space-y-3 border-t border-white/20 pt-6">
                    <h3 className="text-sm font-black uppercase text-amber-300">
                      {isAm ? 'ያሉ ቅጾች' : 'Existing Forms'}
                    </h3>
                    {forms.map((f) => (
                      <div
                        key={f.id}
                        className="border-b border-white/15 py-3 flex flex-wrap items-center justify-between gap-3"
                      >
                        <div>
                          <p className="font-bold text-sm text-white">
                            {f.title_am} / {f.title_en}
                          </p>
                          <p className="text-xs text-slate-300">
                            {f.is_published ? 'Visible on UI' : 'Hidden'} •{' '}
                            {submissions.filter((s) => s.form_id === f.id).length} submissions
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleFormVisibility(f)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/10 border border-white/25 text-xs font-bold cursor-pointer"
                          >
                            {f.is_published ? (
                              <>
                                <EyeOff className="w-3.5 h-3.5" />
                                <span>{isAm ? 'ደብቅ' : 'Hide'}</span>
                              </>
                            ) : (
                              <>
                                <Eye className="w-3.5 h-3.5" />
                                <span>{isAm ? 'አሳይ' : 'Show'}</span>
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteCustomForm(f.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600/80 hover:bg-red-600 text-xs font-bold cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{isAm ? 'አስወግድ' : 'Remove'}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 border-t border-white/20 pt-6">
                    <h3 className="text-sm font-black uppercase text-amber-300">
                      {isAm ? 'የተላኩ ምዝገባዎች (አጽድቅ / ውድቅ አድርግ / አስወግድ)' : 'Submissions'}
                    </h3>
                    {submissions.map((sub) => (
                      <div key={sub.id} className="border-b border-white/15 py-3 space-y-2 text-xs">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <span className="font-bold text-sm text-white">
                              {sub.submitter_name} ({sub.submitter_contact})
                            </span>
                            <span className="ml-2 text-amber-300 font-bold uppercase">
                              [{sub.status}]
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => updateSubmissionStatus(sub.id, 'approved')}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white font-bold cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{isAm ? 'አጽድቅ' : 'Approve'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => updateSubmissionStatus(sub.id, 'rejected')}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-700 hover:bg-amber-600 text-white font-bold cursor-pointer"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>{isAm ? 'ከልክል' : 'Deny'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteSubmission(sub.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-bold cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>{isAm ? 'አስወግድ' : 'Remove'}</span>
                            </button>
                          </div>
                        </div>
                        <pre className="bg-slate-950/65 border border-white/15 p-2.5 text-slate-200 overflow-x-auto">
                          {JSON.stringify(sub.answers, null, 2)}
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'services' && (
                <div className="space-y-4">
                  {requests
                    .filter(
                      (r) =>
                        !q ||
                        [r.full_name, r.contact, r.service_type, r.details, r.workflow_stage]
                          .filter(Boolean)
                          .join(' ')
                          .toLowerCase()
                          .includes(q)
                    )
                    .map((req) => (
                      <div key={req.id} className="border-b border-white/20 pb-5 space-y-3 text-xs">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <h3 className="font-black text-base text-white">{req.full_name}</h3>
                            <p className="text-slate-300">
                              {req.service_type} • {req.contact} • status: {req.status || 'pending'}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                updateServiceRequest(req.id, {
                                  status: 'approved',
                                  workflow_stage: 'agreed',
                                })
                              }
                              className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold cursor-pointer"
                            >
                              {isAm ? 'አጽድቅ' : 'Approve'}
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                updateServiceRequest(req.id, {
                                  status: 'denied',
                                  workflow_stage: 'cancelled',
                                })
                              }
                              className="px-2.5 py-1.5 bg-amber-700 hover:bg-amber-600 text-white font-bold cursor-pointer"
                            >
                              {isAm ? 'ከልክል' : 'Deny'}
                            </button>
                            <select
                              value={req.workflow_stage}
                              onChange={(e) =>
                                updateServiceRequest(req.id, { workflow_stage: e.target.value })
                              }
                              className="bg-slate-950/75 border border-white/25 px-2.5 py-1.5 font-bold text-white"
                            >
                              {SERVICE_WORKFLOW_STAGES.map((stage) => (
                                <option key={stage} value={stage}>
                                  {stage}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() =>
                                updateServiceRequest(req.id, {
                                  deposit_paid: !req.deposit_paid,
                                  deposit_paid_at: !req.deposit_paid
                                    ? new Date().toISOString()
                                    : null,
                                })
                              }
                              className={`px-2.5 py-1.5 font-bold border cursor-pointer ${
                                req.deposit_paid
                                  ? 'border-emerald-400 bg-emerald-950/70 text-emerald-200'
                                  : 'border-amber-300 bg-slate-950/70 text-amber-200'
                              }`}
                            >
                              {req.deposit_paid ? '200 ETB Paid' : 'Mark 200 ETB Paid'}
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteServiceRequest(req.id)}
                              className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold cursor-pointer"
                            >
                              {isAm ? 'አስወግድ' : 'Remove'}
                            </button>
                          </div>
                        </div>

                        {req.details && (
                          <p className="text-sm text-slate-100 bg-slate-950/55 border border-white/15 p-3">
                            {req.details}
                          </p>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            defaultValue={req.customer_update || ''}
                            onBlur={(e) =>
                              updateServiceRequest(req.id, { customer_update: e.target.value })
                            }
                            placeholder={
                              isAm ? 'ለተጠቃሚ የሚታይ ማስታወሻ' : 'Customer update (saves on blur)'
                            }
                            className="bg-slate-950/65 border border-white/25 px-3 py-2 text-white"
                          />
                          <input
                            type="text"
                            defaultValue={req.internal_notes || ''}
                            onBlur={(e) =>
                              updateServiceRequest(req.id, { internal_notes: e.target.value })
                            }
                            placeholder={
                              isAm ? 'የውስጥ ማስታወሻ' : 'Internal note (saves on blur)'
                            }
                            className="bg-slate-950/65 border border-white/25 px-3 py-2 text-white"
                          />
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {tab === 'users' && (
                <div className="divide-y divide-white/15">
                  {profiles
                    .filter(
                      (p) =>
                        !q ||
                        [p.full_name, p.username, p.university, p.country, p.role]
                          .filter(Boolean)
                          .join(' ')
                          .toLowerCase()
                          .includes(q)
                    )
                    .map((user) => (
                      <div
                        key={user.id}
                        className="py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <p className="font-black text-sm text-white">
                            {user.full_name || user.username || user.id}
                          </p>
                          <p className="text-slate-300">
                            @{user.username || 'user'} • {user.university || '-'} •{' '}
                            {user.country || '-'} • status: {user.status}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <select
                            value={user.role}
                            onChange={(e) => updateUserProfile(user.id, { role: e.target.value })}
                            className="bg-slate-950/75 border border-white/25 px-2.5 py-1.5 font-bold text-white"
                          >
                            {USER_ROLES.map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => updateUserProfile(user.id, { status: 'active' })}
                            className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold cursor-pointer"
                          >
                            {isAm ? 'አጽድቅ' : 'Approve'}
                          </button>
                          <button
                            type="button"
                            onClick={() => updateUserProfile(user.id, { status: 'suspended' })}
                            className="px-2.5 py-1.5 bg-amber-700 hover:bg-amber-600 text-white font-bold cursor-pointer"
                          >
                            {isAm ? 'ከልክል' : 'Suspend'}
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteUserProfile(user.id)}
                            className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold cursor-pointer"
                          >
                            {isAm ? 'አስወግድ' : 'Remove'}
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {tab === 'posts' && (
                <div className="space-y-8">
                  <form onSubmit={handlePublishPost} className="space-y-3 max-w-3xl">
                    <h3 className="text-lg font-black text-white">
                      {isAm
                        ? 'አዲስ ልጥፍ / ዜና (ከፎቶ ወይም ቪዲዮ ጋር)'
                        : 'Publish Hub Post (Photo or Video)'}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        value={postTitleAm}
                        onChange={(e) => setPostTitleAm(e.target.value)}
                        placeholder="ርዕስ (አማርኛ) *"
                        className="bg-slate-950/65 border border-white/25 px-3 py-2 text-sm text-white"
                      />
                      <input
                        type="text"
                        value={postTitleEn}
                        onChange={(e) => setPostTitleEn(e.target.value)}
                        placeholder="Title (English)"
                        className="bg-slate-950/65 border border-white/25 px-3 py-2 text-sm text-white"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <textarea
                        rows={3}
                        required
                        value={postBodyAm}
                        onChange={(e) => setPostBodyAm(e.target.value)}
                        placeholder="ጽሁፍ (አማርኛ) *"
                        className="bg-slate-950/65 border border-white/25 px-3 py-2 text-sm text-white"
                      />
                      <textarea
                        rows={3}
                        value={postBodyEn}
                        onChange={(e) => setPostBodyEn(e.target.value)}
                        placeholder="Body (English)"
                        className="bg-slate-950/65 border border-white/25 px-3 py-2 text-sm text-white"
                      />
                    </div>

                    <div className="space-y-2 border border-white/15 bg-slate-950/50 p-3">
                      <label className="flex items-center gap-2 text-xs font-bold text-amber-300">
                        <ImagePlus className="w-4 h-4" />
                        <Video className="w-4 h-4" />
                        <span>
                          {isAm
                            ? 'ፎቶ ወይም ቪዲዮ ይምረጡ (Photo or Video)'
                            : 'Upload Photo or Video File'}
                        </span>
                      </label>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) => setPostMediaFile(e.target.files?.[0] || null)}
                        className="w-full bg-slate-950/75 border border-white/25 px-3 py-2 text-xs text-white file:mr-3 file:py-1 file:px-3 file:border-0 file:bg-red-600 file:text-white file:font-bold file:cursor-pointer"
                      />
                      {postMediaFile && (
                        <p className="text-xs text-emerald-300 font-semibold">
                          {postMediaFile.name} ({Math.round(postMediaFile.size / 1024)} KB)
                        </p>
                      )}
                      <input
                        type="url"
                        value={postMediaUrl}
                        onChange={(e) => setPostMediaUrl(e.target.value)}
                        placeholder={
                          isAm
                            ? 'ወይም የፎቶ/ቪዲዮ ሊንክ ያስገቡ (አማራጭ)'
                            : 'Or paste photo/video URL (optional)'
                        }
                        className="w-full bg-slate-950/75 border border-white/25 px-3 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-xs font-bold">
                        <input
                          type="checkbox"
                          checked={postBreaking}
                          onChange={(e) => setPostBreaking(e.target.checked)}
                        />
                        <span>{isAm ? 'ዋና ማስታወቂያ' : 'Announcement / Breaking'}</span>
                      </label>
                      <button
                        type="submit"
                        disabled={uploadingMedia}
                        className="px-5 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-xs font-extrabold uppercase cursor-pointer"
                      >
                        {uploadingMedia
                          ? isAm
                            ? 'በመጫን ላይ...'
                            : 'Uploading...'
                          : isAm
                          ? 'አትም'
                          : 'Publish'}
                      </button>
                    </div>
                  </form>

                  <div className="divide-y divide-white/15 border-t border-white/20 pt-4 space-y-4">
                    {posts.map((p) => {
                      const mediaInfo = extractMediaFromPost(p);
                      const amTr = p.hub_post_translations?.find((t) => t.lang_code === 'am');
                      const enTr = p.hub_post_translations?.find((t) => t.lang_code === 'en');
                      const displayTitle =
                        (isAm ? amTr?.title || enTr?.title : enTr?.title || amTr?.title) || p.id;
                      const displayBody =
                        (isAm ? amTr?.body || enTr?.body : enTr?.body || amTr?.body) || '';
                      const isEditing = editingPostId === p.id;

                      return (
                        <div key={p.id} className="pt-4 space-y-3 text-xs">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="space-y-1 max-w-2xl">
                              <p className="font-bold text-sm text-white">{displayTitle}</p>
                              <p className="text-slate-300">
                                status: {p.status || 'draft'}
                                {mediaInfo.url ? ` • ${mediaInfo.isVideo ? 'video' : 'photo'}` : ''}
                              </p>
                              {displayBody && (
                                <p className="text-xs text-slate-200 whitespace-pre-line">
                                  {displayBody}
                                </p>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={() => (isEditing ? cancelEditPost() : beginEditPost(p))}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-amber-600/90 hover:bg-amber-600 text-white font-bold cursor-pointer"
                              >
                                {isEditing ? (
                                  <>
                                    <X className="w-3.5 h-3.5" />
                                    <span>{isAm ? 'ሰርዝ' : 'Cancel'}</span>
                                  </>
                                ) : (
                                  <>
                                    <Pencil className="w-3.5 h-3.5" />
                                    <span>{isAm ? 'አስተካክል' : 'Edit'}</span>
                                  </>
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => togglePostStatus(p)}
                                className="px-3 py-1 bg-white/10 border border-white/25 font-bold cursor-pointer"
                              >
                                {p.status === 'published'
                                  ? isAm
                                    ? 'ደብቅ / Draft'
                                    : 'Hide'
                                  : isAm
                                  ? 'አጽድቅ / Publish'
                                  : 'Approve'}
                              </button>

                              <button
                                type="button"
                                onClick={() => deletePost(p.id)}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>{isAm ? 'ሰርዝ / Delete' : 'Delete'}</span>
                              </button>
                            </div>
                          </div>

                          {mediaInfo.url && (
                            <div className="max-w-md border border-white/20 bg-slate-950/70 p-2">
                              {mediaInfo.isVideo ? (
                                <video
                                  src={mediaInfo.url}
                                  controls
                                  className="w-full max-h-64 object-contain"
                                />
                              ) : (
                                <img
                                  src={mediaInfo.url}
                                  alt={displayTitle}
                                  className="w-full max-h-64 object-contain"
                                />
                              )}
                            </div>
                          )}

                          {isEditing && (
                            <div className="border border-amber-300/40 bg-slate-950/80 p-4 space-y-3 max-w-3xl">
                              <p className="font-black text-amber-300 uppercase">
                                {isAm ? 'ልጥፉን ማስተካከያ' : 'Modify Post'}
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input
                                  type="text"
                                  value={editPostTitleAm}
                                  onChange={(e) => setEditPostTitleAm(e.target.value)}
                                  placeholder="ርዕስ (አማርኛ)"
                                  className="bg-slate-900 border border-white/25 px-3 py-2 text-xs text-white"
                                />
                                <input
                                  type="text"
                                  value={editPostTitleEn}
                                  onChange={(e) => setEditPostTitleEn(e.target.value)}
                                  placeholder="Title (English)"
                                  className="bg-slate-900 border border-white/25 px-3 py-2 text-xs text-white"
                                />
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <textarea
                                  rows={2}
                                  value={editPostBodyAm}
                                  onChange={(e) => setEditPostBodyAm(e.target.value)}
                                  placeholder="ጽሁፍ (አማርኛ)"
                                  className="bg-slate-900 border border-white/25 px-3 py-2 text-xs text-white"
                                />
                                <textarea
                                  rows={2}
                                  value={editPostBodyEn}
                                  onChange={(e) => setEditPostBodyEn(e.target.value)}
                                  placeholder="Body (English)"
                                  className="bg-slate-900 border border-white/25 px-3 py-2 text-xs text-white"
                                />
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input
                                  type="url"
                                  value={editPostMediaUrl}
                                  onChange={(e) => setEditPostMediaUrl(e.target.value)}
                                  placeholder="Media URL"
                                  className="bg-slate-900 border border-white/25 px-3 py-2 text-xs text-white"
                                />
                                <input
                                  type="file"
                                  accept="image/*,video/*"
                                  onChange={(e) => setEditPostMediaFile(e.target.files?.[0] || null)}
                                  className="bg-slate-900 border border-white/25 px-3 py-1.5 text-xs text-white file:mr-2 file:py-1 file:px-2 file:border-0 file:bg-red-600 file:text-white file:font-bold"
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-xs font-bold">
                                  <input
                                    type="checkbox"
                                    checked={editPostBreaking}
                                    onChange={(e) => setEditPostBreaking(e.target.checked)}
                                  />
                                  <span>{isAm ? 'ዋና ማስታወቂያ' : 'Breaking'}</span>
                                </label>
                                <button
                                  type="button"
                                  disabled={uploadingMedia}
                                  onClick={() => handleSaveEditedPost(p)}
                                  className="inline-flex items-center gap-1 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold uppercase cursor-pointer"
                                >
                                  <Save className="w-3.5 h-3.5" />
                                  <span>{isAm ? 'ለውጡን አስቀምጥ' : 'Save Changes'}</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {tab === 'opportunities' && (
                <div className="space-y-8">
                  <form onSubmit={handlePublishOpportunity} className="space-y-3 max-w-3xl">
                    <h3 className="text-lg font-black text-white">
                      {isAm ? 'አዲስ እድል ይጨምሩ' : 'Add Opportunity'}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <select
                        value={oppType}
                        onChange={(e) => setOppType(e.target.value)}
                        className="bg-slate-950/65 border border-white/25 px-3 py-2 text-xs font-bold text-white"
                      >
                        {OPPORTUNITY_TYPES.map((ot) => (
                          <option key={ot} value={ot}>
                            {ot}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={oppOrg}
                        onChange={(e) => setOppOrg(e.target.value)}
                        placeholder="Organization"
                        className="bg-slate-950/65 border border-white/25 px-3 py-2 text-xs text-white"
                      />
                      <input
                        type="date"
                        value={oppDeadline}
                        onChange={(e) => setOppDeadline(e.target.value)}
                        className="bg-slate-950/65 border border-white/25 px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        value={oppTitleAm}
                        onChange={(e) => setOppTitleAm(e.target.value)}
                        placeholder="ርዕስ (አማርኛ) *"
                        className="bg-slate-950/65 border border-white/25 px-3 py-2 text-sm text-white"
                      />
                      <input
                        type="text"
                        value={oppTitleEn}
                        onChange={(e) => setOppTitleEn(e.target.value)}
                        placeholder="Title (English)"
                        className="bg-slate-950/65 border border-white/25 px-3 py-2 text-sm text-white"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <textarea
                        rows={2}
                        required
                        value={oppDescAm}
                        onChange={(e) => setOppDescAm(e.target.value)}
                        placeholder="መግለጫ (አማርኛ) *"
                        className="bg-slate-950/65 border border-white/25 px-3 py-2 text-sm text-white"
                      />
                      <textarea
                        rows={2}
                        value={oppDescEn}
                        onChange={(e) => setOppDescEn(e.target.value)}
                        placeholder="Description (English)"
                        className="bg-slate-950/65 border border-white/25 px-3 py-2 text-sm text-white"
                      />
                    </div>

                    <div className="space-y-2 border border-white/15 bg-slate-950/50 p-3">
                      <label className="block text-xs font-bold text-amber-300">
                        {isAm ? 'ፎቶ ወይም ቪዲዮ ይጫኑ (አማራጭ)' : 'Upload Photo or Video (Optional)'}
                      </label>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) => setOppMediaFile(e.target.files?.[0] || null)}
                        className="w-full bg-slate-950/75 border border-white/25 px-3 py-1.5 text-xs text-white file:mr-3 file:py-1 file:px-3 file:border-0 file:bg-red-600 file:text-white file:font-bold file:cursor-pointer"
                      />
                      <input
                        type="url"
                        value={oppUrl}
                        onChange={(e) => setOppUrl(e.target.value)}
                        placeholder="Application URL (https://...)"
                        className="w-full bg-slate-950/75 border border-white/25 px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={uploadingMedia}
                      className="px-5 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-xs font-extrabold uppercase cursor-pointer"
                    >
                      {uploadingMedia
                        ? isAm
                          ? 'በመጫን ላይ...'
                          : 'Uploading...'
                        : isAm
                        ? 'ጨምር'
                        : 'Publish'}
                    </button>
                  </form>

                  <div className="divide-y divide-white/15 border-t border-white/20 pt-4">
                    {opportunities.map((o) => (
                      <div
                        key={o.id}
                        className="py-3 flex flex-wrap items-center justify-between gap-2 text-xs"
                      >
                        <div>
                          <p className="font-bold text-sm text-white">
                            {o.opportunity_translations?.[0]?.title || o.opportunity_type}
                          </p>
                          <p className="text-slate-300">
                            {o.opportunity_type} • {o.is_active ? 'Active' : 'Paused'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleOpportunityActive(o)}
                            className="px-3 py-1 bg-white/10 border border-white/25 font-bold cursor-pointer"
                          >
                            {o.is_active
                              ? isAm
                                ? 'አቁም / Pause'
                                : 'Pause'
                              : isAm
                              ? 'አጽድቅ / Activate'
                              : 'Approve'}
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteOpportunity(o.id)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold cursor-pointer"
                          >
                            {isAm ? 'አስወግድ' : 'Remove'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'notifications' && (
                <form onSubmit={handleSendNotification} className="space-y-4 max-w-2xl">
                  <h3 className="text-lg font-black text-white">
                    {isAm ? 'ማሳወቂያ ይላኩ' : 'Send Broadcast Notification'}
                  </h3>
                  <input
                    type="text"
                    required
                    value={notifTitle}
                    onChange={(e) => setNotifTitle(e.target.value)}
                    placeholder="Title"
                    className="w-full bg-slate-950/65 border border-white/25 px-3 py-2 text-sm text-white"
                  />
                  <textarea
                    rows={3}
                    required
                    value={notifBody}
                    onChange={(e) => setNotifBody(e.target.value)}
                    placeholder="Message"
                    className="w-full bg-slate-950/65 border border-white/25 px-3 py-2 text-sm text-white"
                  />
                  <input
                    type="text"
                    value={notifLink}
                    onChange={(e) => setNotifLink(e.target.value)}
                    placeholder="/hub"
                    className="w-full bg-slate-950/65 border border-white/25 px-3 py-2 text-xs text-white"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold uppercase cursor-pointer"
                  >
                    {isAm ? 'ላክ' : 'Broadcast'}
                  </button>
                </form>
              )}

              {tab === 'reports' && (
                <div className="divide-y divide-white/15">
                  {reports.length === 0 ? (
                    <p className="text-sm text-slate-300">
                      {isAm ? 'ምንም ሪፖርት የለም።' : 'No reports.'}
                    </p>
                  ) : (
                    reports.map((rep) => (
                      <div
                        key={rep.id}
                        className="py-3.5 flex flex-wrap items-center justify-between gap-2 text-xs"
                      >
                        <div>
                          <p className="font-bold text-sm text-white">
                            {rep.target_type} ({rep.status})
                          </p>
                          <p className="text-slate-200">{rep.reason}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateReportStatus(rep.id, 'resolved')}
                            className="px-2.5 py-1 bg-emerald-700 text-white font-bold cursor-pointer"
                          >
                            {isAm ? 'አጽድቅ' : 'Resolve'}
                          </button>
                          <button
                            type="button"
                            onClick={() => updateReportStatus(rep.id, 'dismissed')}
                            className="px-2.5 py-1 bg-amber-700 text-white font-bold cursor-pointer"
                          >
                            {isAm ? 'ከልክል' : 'Dismiss'}
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteReport(rep.id)}
                            className="px-2.5 py-1 bg-red-600 text-white font-bold cursor-pointer"
                          >
                            {isAm ? 'አስወግድ' : 'Remove'}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}