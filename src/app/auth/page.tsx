'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import {
  LangCode,
  SUPPORTED_LANGUAGES,
  INTEREST_OPTIONS,
  TRANSLATIONS,
} from '../lib/i18n';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  ArrowLeft,
  Check,
  X,
  Globe,
  KeyRound,
} from 'lucide-react';

interface PasswordCheck {
  id: string;
  test: (pw: string) => boolean;
  labelByLang: Record<LangCode, string>;
}

const PASSWORD_CHECKS: PasswordCheck[] = [
  {
    id: 'length',
    test: (pw) => pw.length >= 10,
    labelByLang: {
      en: 'At least 10 characters',
      am: 'ቢያንስ 10 ፊደላት',
      ti: 'ብውሑድ 10 ፊደላት',
      om: 'Yoo xiqqaate qubee 10',
    },
  },
  {
    id: 'upper',
    test: (pw) => /[A-Z]/.test(pw),
    labelByLang: {
      en: 'Uppercase letter (A-Z)',
      am: 'ትልቅ የእንግሊዝኛ ፊደል (A-Z)',
      ti: 'ዓብይ ፊደል (A-Z)',
      om: 'Qubee guddaa (A-Z)',
    },
  },
  {
    id: 'lower',
    test: (pw) => /[a-z]/.test(pw),
    labelByLang: {
      en: 'Lowercase letter (a-z)',
      am: 'ትንሽ የእንግሊዝኛ ፊደል (a-z)',
      ti: 'ንእሽቶ ፊደል (a-z)',
      om: 'Qubee xiqqaa (a-z)',
    },
  },
  {
    id: 'number',
    test: (pw) => /[0-9]/.test(pw),
    labelByLang: {
      en: 'Number (0-9)',
      am: 'ቁጥር (0-9)',
      ti: 'ቁጽሪ (0-9)',
      om: 'Lakkoofsa (0-9)',
    },
  },
  {
    id: 'symbol',
    test: (pw) => /[^A-Za-z0-9]/.test(pw),
    labelByLang: {
      en: 'Symbol (!@#$%^&*)',
      am: 'ምልክት (!@#$%^&*)',
      ti: 'ምልክት (!@#$%^&*)',
      om: 'Mallattoo (!@#$%^&*)',
    },
  },
];

const AUTH_COPY: Record<
  LangCode,
  {
    passwordLabel: string;
    confirmPasswordLabel: string;
    passwordMismatch: string;
    emailLabel: string;
    usernameLabel: string;
    fullNameLabel: string;
    phoneLabel: string;
    countryLabel: string;
    universityLabel: string;
    departmentLabel: string;
    studyLevelLabel: string;
    professionLabel: string;
    bioLabel: string;
    interestsLabel: string;
    optionalBadge: string;
    forgotPasswordLink: string;
    backToAuth: string;
    sendResetBtn: string;
    resetSentMsg: string;
    benefitsList: string[];
  }
> = {
  en: {
    passwordLabel: 'Password',
    confirmPasswordLabel: 'Confirm Password',
    passwordMismatch: 'Passwords do not match.',
    emailLabel: 'Email Address',
    usernameLabel: 'Username',
    fullNameLabel: 'Full Name',
    phoneLabel: 'Phone (Optional)',
    countryLabel: 'Country',
    universityLabel: 'University',
    departmentLabel: 'Department',
    studyLevelLabel: 'Study Level',
    professionLabel: 'Profession',
    bioLabel: 'Short Bio',
    interestsLabel: 'Topics of Interest',
    optionalBadge: 'Optional',
    forgotPasswordLink: 'Forgot password?',
    backToAuth: 'Back to Sign In / Register',
    sendResetBtn: 'Send Password Reset Link',
    resetSentMsg: 'Password reset link sent to your email address.',
    benefitsList: [
      'Save scholarships, jobs, internships, and opportunities',
      'Receive deadline alerts, updates, and service progress notifications',
      'Personalize recommendations by interest without hiding other content',
      'Connect in community and direct messaging',
    ],
  },
  am: {
    passwordLabel: 'የይለፍ ቃል',
    confirmPasswordLabel: 'የይለፍ ቃል ያረጋግጡ',
    passwordMismatch: 'የይለፍ ቃላቱ አይመሳሰሉም።',
    emailLabel: 'ኢሜይል',
    usernameLabel: 'የተጠቃሚ ስም',
    fullNameLabel: 'ሙሉ ስም',
    phoneLabel: 'ስልክ (አማራጭ)',
    countryLabel: 'ሀገር',
    universityLabel: 'ዩኒቨርሲቲ',
    departmentLabel: 'ክፍል / ዲፓርትመንት',
    studyLevelLabel: 'የትምህርት ደረጃ',
    professionLabel: 'ሙያ',
    bioLabel: 'አጭር መግለጫ',
    interestsLabel: 'የፍላጎት ርዕሶች',
    optionalBadge: 'አማራጭ',
    forgotPasswordLink: 'የይለፍ ቃል ረሱ?',
    backToAuth: 'ወደ መግቢያ / ምዝገባ ይመለሱ',
    sendResetBtn: 'የይለፍ ቃል ማደሻ አገናኝ ይላኩ',
    resetSentMsg: 'የይለፍ ቃል ማደሻ አገናኝ ወደ ኢሜይልዎ ተልኳል።',
    benefitsList: [
      'ስኮላርሺፖችን፣ ስራዎችን፣ ኢንተርንሺፖችን እና እድሎችን ያስቀምጡ',
      'የማብቂያ ቀን ማሳሰቢያዎችን እና የአገልግሎት ሂደት ማሳወቂያዎችን ያግኙ',
      'ሌሎች ይዘቶችን ሳይደብቁ በፍላጎትዎ የተመከሩ እድሎችን ያግኙ',
      'በማህበረሰብ እና በቀጥታ መልዕክት ይሳተፉ',
    ],
  },
  ti: {
    passwordLabel: 'መሕለፊ ቃል',
    confirmPasswordLabel: 'መሕለፊ ቃል ደግም',
    passwordMismatch: 'መሕለፊ ቃላት ኣይሰማማዕን።',
    emailLabel: 'ኢመይል',
    usernameLabel: 'ስም ተጠቃሚ',
    fullNameLabel: 'ምሉእ ስም',
    phoneLabel: 'ስልኪ (ኣማራጺ)',
    countryLabel: 'ሃገር',
    universityLabel: 'ዩኒቨርሲቲ',
    departmentLabel: 'ክፍሊ',
    studyLevelLabel: 'ደረጃ ትምህርቲ',
    professionLabel: 'ሞያ',
    bioLabel: 'ሓጺር መግለጺ',
    interestsLabel: 'ርእስታት ፍትወት',
    optionalBadge: 'ኣማራጺ',
    forgotPasswordLink: 'መሕለፊ ቃል ረሲዕካ?',
    backToAuth: 'ናብ መእተዊ / ምዝገባ ተመለስ',
    sendResetBtn: 'መላግቦ መቐየሪ መሕለፊ ቃል ስደድ',
    resetSentMsg: 'ናብ ኢመይልካ መላግቦ መቐየሪ መሕለፊ ቃል ተሰዲዱ ኣሎ።',
    benefitsList: [
      'ስኮላርሺፓት፣ ስራሓት፣ ኢንተርንሺፓትን ዕድላትን ዓቅብ',
      'መዘኻኸሪ ናይ መወዳእታ ዕለትን ሓበሬታ ኣገልግሎትን ርከብ',
      'ካልእ ትሕዝቶ ከይሓባእካ ብፍትወትካ ዝተመርጹ ዕድላት ርአይ',
      'ኣብ ማሕበረሰብን ቀጥታ መልእኽትን ተሳተፍ',
    ],
  },
  om: {
    passwordLabel: 'Jecha Darbi',
    confirmPasswordLabel: 'Jecha Darbi Mirkaneessi',
    passwordMismatch: 'Jechoonni darbi wal hin simne.',
    emailLabel: 'Imeelii',
    usernameLabel: 'Maqaa Fayyadamaa',
    fullNameLabel: 'Maqaa Guutuu',
    phoneLabel: 'Bilbila (Filannoo)',
    countryLabel: 'Biyya',
    universityLabel: 'Yuunivarsiitii',
    departmentLabel: 'Mummee',
    studyLevelLabel: 'Sadarkaa Barnootaa',
    professionLabel: 'Ogummaa',
    bioLabel: 'Waa’ee Keessan Gabaabsee',
    interestsLabel: 'Mata Duree Fedhii',
    optionalBadge: 'Filannoo',
    forgotPasswordLink: 'Jecha darbi irraanfattanii?',
    backToAuth: 'Gara Seensa / Galmee Deebi’i',
    sendResetBtn: 'Geessituu Jecha Darbi Haaromsaa Ergi',
    resetSentMsg: 'Geessituun jecha darbi haaromsaa imeelii keessanitti ergameera.',
    benefitsList: [
      'Iskolaarshii, hojii, internshiippii fi carraawwan olkaa’i',
      'Yaadachiisa guyyaa xumuraa fi odeeffannoo tajaajilaa argadhu',
      'Qabiyyee biroo utuu hin dhoksiin fedhii keetiin wal simsiisi',
      'Hawaasa fi ergaa kallattii keessatti hirmaadhu',
    ],
  },
};

export default function AuthPage() {
  const router = useRouter();

  // Step 1: Choose language first before registration / login
  const [lang, setLang] = useState<LangCode>('en');
  const [mode, setMode] = useState<'signup' | 'signin' | 'reset'>('signup');

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Optional profile fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [university, setUniversity] = useState('');
  const [department, setDepartment] = useState('');
  const [studyLevel, setStudyLevel] = useState('');
  const [profession, setProfession] = useState('');
  const [bio, setBio] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const t = TRANSLATIONS[lang];
  const c = AUTH_COPY[lang];

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (active && data.user) {
        router.replace('/dashboard');
      }
    });
    return () => {
      active = false;
    };
  }, [router]);

  const checkResults = useMemo(
    () =>
      PASSWORD_CHECKS.map((item) => ({
        ...item,
        passed: item.test(password),
        label: item.labelByLang[lang],
      })),
    [password, lang]
  );

  const passedCount = checkResults.filter((r) => r.passed).length;

  const toggleInterest = (slug: string) => {
    setSelectedInterests((prev) =>
      prev.includes(slug) ? prev.filter((item) => item !== slug) : [...prev, slug]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setErrorMsg(null);

    try {
      if (mode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
        if (error) {
          setErrorMsg(error.message);
          return;
        }
        setMessage(c.resetSentMsg);
        return;
      }

      if (mode === 'signup') {
        if (!username.trim()) {
          setErrorMsg(`${c.usernameLabel} is required.`);
          return;
        }
        if (password !== confirmPassword) {
          setErrorMsg(c.passwordMismatch);
          return;
        }
        if (passedCount < 4) {
          setErrorMsg(t.authPasswordWeak);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              username: username.trim(),
              full_name: fullName.trim() || null,
              preferred_lang: lang,
            },
          },
        });

        if (error) {
          setErrorMsg(error.message);
          return;
        }

        if (data.user) {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            username: username.trim(),
            full_name: fullName.trim() || null,
            phone: phone.trim() || null,
            country: country.trim() || null,
            university: university.trim() || null,
            department: department.trim() || null,
            study_level: studyLevel.trim() || null,
            profession: profession.trim() || null,
            bio: bio.trim() || null,
            preferred_lang: lang,
            role: 'user',
            status: 'active',
          });

          if (selectedInterests.length > 0) {
            await supabase.from('user_interests').upsert(
              selectedInterests.map((slug) => ({
                user_id: data.user!.id,
                interest_slug: slug,
              })),
              { onConflict: 'user_id,interest_slug' }
            );
          }
        }

        if (data.session) {
          router.replace('/dashboard');
          return;
        }

        setMessage(t.authEmailVerified);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          setErrorMsg(error.message);
          return;
        }

        router.replace('/dashboard');
      }
    } catch {
      setErrorMsg(t.errorText);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900 flex flex-col">
      {/* Top Bar with Language Selector First */}
      <div className="bg-slate-950 text-white text-xs border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 min-h-11 py-1.5 flex flex-wrap items-center justify-between gap-2">
          <span className="font-semibold tracking-wide text-slate-200">
            {t.authChooseLangFirst}
          </span>

          <div className="flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-amber-400 mr-1 hidden sm:block" />
            {SUPPORTED_LANGUAGES.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => setLang(item.code)}
                className={`px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                  lang === item.code
                    ? 'bg-red-700 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.native}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="inline-block w-2.5 h-7 bg-red-700" />
            <span className="text-lg sm:text-xl font-black tracking-tight text-slate-950 uppercase">
              {t.brandName}
            </span>
          </Link>

          <div className="flex items-center gap-4 text-xs sm:text-sm font-bold">
            <Link href="/hub" className="text-slate-700 hover:text-red-700">
              {t.navHub}
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-slate-700 hover:text-slate-950"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.navHome}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Security & Account Value */}
        <section className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-950 text-white text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>{t.brandName}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 leading-tight">
            {mode === 'signup'
              ? t.authRegister
              : mode === 'signin'
              ? t.authLogin
              : t.authResetPassword}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{t.tagline}</p>

          <div className="bg-white border border-slate-200 border-l-4 border-l-red-700 p-5 space-y-3">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-950">
              {t.createAccountBenefitsTitle}
            </h2>
            <ul className="space-y-2 text-sm text-slate-700">
              {c.benefitsList.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Right Column: Auth Form */}
        <section className="lg:col-span-7 bg-white border border-slate-200 p-6 sm:p-8 space-y-6">
          {mode !== 'reset' && (
            <div className="grid grid-cols-2 border border-slate-300 bg-[#FAF9F6] p-1">
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setMessage(null);
                  setErrorMsg(null);
                }}
                className={`py-2.5 text-xs sm:text-sm font-extrabold uppercase tracking-wide transition cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-slate-950 text-white'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                {t.authRegister}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setMessage(null);
                  setErrorMsg(null);
                }}
                className={`py-2.5 text-xs sm:text-sm font-extrabold uppercase tracking-wide transition cursor-pointer ${
                  mode === 'signin'
                    ? 'bg-slate-950 text-white'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                {t.authLogin}
              </button>
            </div>
          )}

          {message && (
            <div className="border-l-4 border-emerald-700 bg-emerald-50 p-4 text-sm text-emerald-950 font-medium">
              {message}
            </div>
          )}

          {errorMsg && (
            <div className="border-l-4 border-red-700 bg-red-50 p-4 text-sm text-red-950 font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                {c.emailLabel} *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-slate-300 bg-[#FAF9F6] pl-10 pr-3.5 py-2.5 text-sm text-slate-950 focus:outline-none focus:border-slate-950"
                />
              </div>
            </div>

            {/* Required Username on Registration */}
            {mode === 'signup' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                    {c.usernameLabel} *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full border border-slate-300 bg-[#FAF9F6] pl-10 pr-3.5 py-2.5 text-sm text-slate-950 focus:outline-none focus:border-slate-950"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                    {c.fullNameLabel} ({c.optionalBadge})
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full border border-slate-300 bg-[#FAF9F6] px-3.5 py-2.5 text-sm text-slate-950 focus:outline-none focus:border-slate-950"
                  />
                </div>
              </div>
            )}

            {/* Password & Confirmation */}
            {mode !== 'reset' && (
              <>
                <div
                  className={`grid grid-cols-1 ${
                    mode === 'signup' ? 'sm:grid-cols-2' : ''
                  } gap-4`}
                >
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                      {c.passwordLabel} *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-slate-300 bg-[#FAF9F6] pl-10 pr-3.5 py-2.5 text-sm text-slate-950 focus:outline-none focus:border-slate-950"
                      />
                    </div>
                  </div>

                  {mode === 'signup' && (
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                        {c.confirmPasswordLabel} *
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full border border-slate-300 bg-[#FAF9F6] pl-10 pr-3.5 py-2.5 text-sm text-slate-950 focus:outline-none focus:border-slate-950"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Strong Password Guidance & Live Checklist */}
                {mode === 'signup' && (
                  <div className="bg-[#FAF9F6] border border-slate-200 p-4 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span
                        className={
                          passedCount >= 4
                            ? 'font-bold text-emerald-800'
                            : 'font-semibold text-slate-700'
                        }
                      >
                        {passedCount >= 4 ? t.authPasswordStrong : t.authPasswordWeak}
                      </span>
                      <span className="font-bold text-slate-600">
                        {passedCount}/{checkResults.length}
                      </span>
                    </div>

                    <div className="h-2 w-full bg-slate-200 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-200 ${
                          passedCount <= 2
                            ? 'bg-red-700'
                            : passedCount <= 3
                            ? 'bg-amber-500'
                            : 'bg-emerald-700'
                        }`}
                        style={{ width: `${(passedCount / checkResults.length) * 100}%` }}
                      />
                    </div>

                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                      {checkResults.map((item) => (
                        <li
                          key={item.id}
                          className={`flex items-center gap-1.5 ${
                            item.passed ? 'text-emerald-800 font-semibold' : 'text-slate-500'
                          }`}
                        >
                          {item.passed ? (
                            <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          ) : (
                            <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          )}
                          <span>{item.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Optional Profile & Background Fields on Registration */}
                {mode === 'signup' && (
                  <div className="pt-2 border-t border-slate-200 space-y-4">
                    <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                      {c.optionalBadge}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={c.phoneLabel}
                        className="border border-slate-300 bg-[#FAF9F6] px-3 py-2 text-xs text-slate-950 focus:outline-none focus:border-slate-950"
                      />
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder={`${c.countryLabel} (${c.optionalBadge})`}
                        className="border border-slate-300 bg-[#FAF9F6] px-3 py-2 text-xs text-slate-950 focus:outline-none focus:border-slate-950"
                      />
                      <input
                        type="text"
                        value={profession}
                        onChange={(e) => setProfession(e.target.value)}
                        placeholder={`${c.professionLabel} (${c.optionalBadge})`}
                        className="border border-slate-300 bg-[#FAF9F6] px-3 py-2 text-xs text-slate-950 focus:outline-none focus:border-slate-950"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                        placeholder={`${c.universityLabel} (${c.optionalBadge})`}
                        className="border border-slate-300 bg-[#FAF9F6] px-3 py-2 text-xs text-slate-950 focus:outline-none focus:border-slate-950"
                      />
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder={`${c.departmentLabel} (${c.optionalBadge})`}
                        className="border border-slate-300 bg-[#FAF9F6] px-3 py-2 text-xs text-slate-950 focus:outline-none focus:border-slate-950"
                      />
                      <input
                        type="text"
                        value={studyLevel}
                        onChange={(e) => setStudyLevel(e.target.value)}
                        placeholder={`${c.studyLevelLabel} (${c.optionalBadge})`}
                        className="border border-slate-300 bg-[#FAF9F6] px-3 py-2 text-xs text-slate-950 focus:outline-none focus:border-slate-950"
                      />
                    </div>

                    <textarea
                      rows={2}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder={`${c.bioLabel} (${c.optionalBadge})`}
                      className="w-full border border-slate-300 bg-[#FAF9F6] px-3 py-2 text-xs text-slate-950 focus:outline-none focus:border-slate-950"
                    />

                    <div className="space-y-1.5">
                      <span className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        {c.interestsLabel} ({c.optionalBadge})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {INTEREST_OPTIONS.map((slug) => {
                          const active = selectedInterests.includes(slug);
                          return (
                            <button
                              key={slug}
                              type="button"
                              onClick={() => toggleInterest(slug)}
                              className={`px-2.5 py-1 text-xs font-semibold border transition cursor-pointer ${
                                active
                                  ? 'border-slate-950 bg-slate-950 text-white'
                                  : 'border-slate-300 bg-[#FAF9F6] text-slate-700 hover:border-slate-950'
                              }`}
                            >
                              {slug.replace('_', ' ')}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-700 hover:bg-red-800 disabled:opacity-60 text-white text-sm font-extrabold uppercase tracking-wider transition cursor-pointer"
            >
              {loading
                ? t.loadingText
                : mode === 'signup'
                ? t.authRegister
                : mode === 'signin'
                ? t.authLogin
                : c.sendResetBtn}
            </button>

            <div className="flex items-center justify-between pt-1 text-xs font-semibold text-slate-600">
              {mode !== 'reset' ? (
                <button
                  type="button"
                  onClick={() => {
                    setMode('reset');
                    setMessage(null);
                    setErrorMsg(null);
                  }}
                  className="hover:text-red-700 underline cursor-pointer"
                >
                  {c.forgotPasswordLink}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setMessage(null);
                    setErrorMsg(null);
                  }}
                  className="hover:text-red-700 underline cursor-pointer"
                >
                  {c.backToAuth}
                </button>
              )}
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}