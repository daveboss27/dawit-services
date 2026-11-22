export type LangCode = 'en' | 'am' | 'ti' | 'om';

export const SUPPORTED_LANGUAGES: { code: LangCode; native: string; english: string }[] = [
  { code: 'en', native: 'English', english: 'English' },
  { code: 'am', native: 'አማርኛ', english: 'Amharic' },
  { code: 'ti', native: 'ትግርኛ', english: 'Tigrinya' },
  { code: 'om', native: 'Afaan Oromo', english: 'Afaan Oromo' },
];

export const INTEREST_OPTIONS = [
  'scholarships',
  'jobs',
  'internships',
  'education',
  'technology',
  'business',
  'international_news',
  'ethiopian_news',
  'science',
  'sports',
  'events',
  'other',
] as const;

export type InterestSlug = (typeof INTEREST_OPTIONS)[number];

export const HUB_CATEGORIES = [
  'international',
  'national',
  'local',
  'university',
  'education',
  'technology',
  'business',
  'science',
  'health',
  'sports',
  'culture',
  'scholarships',
  'jobs',
  'internships',
  'events',
  'announcements',
  'other',
] as const;

export const OPPORTUNITY_TYPES = [
  'scholarship',
  'internship',
  'job',
  'fellowship',
  'competition',
  'conference',
  'training',
  'volunteer',
  'grant',
] as const;

export const SERVICE_WORKFLOW_STAGES = [
  'request',
  'review',
  'discussion',
  'agreed',
  'deposit_paid',
  'in_progress',
  'completed',
  'cancelled',
] as const;

export const USER_ROLES = [
  'super_admin',
  'admin',
  'editor',
  'moderator',
  'contributor',
  'user',
] as const;

export interface LocalizedBundle {
  brandName: string;
  tagline: string;
  navHome: string;
  navServices: string;
  navHub: string;
  navOpportunities: string;
  navSearch: string;
  navDashboard: string;
  navAccount: string;
  navAdmin: string;
  ctaRequestService: string;
  ctaExploreHub: string;
  svcPassportTitle: string;
  svcPassportDesc: string;
  svcApplicationTitle: string;
  svcApplicationDesc: string;
  svcFlightTitle: string;
  svcFlightDesc: string;
  guestRequestNotice: string;
  depositPolicyNote: string;
  createAccountBenefitsTitle: string;
  authChooseLangFirst: string;
  authRegister: string;
  authLogin: string;
  authResetPassword: string;
  authEmailVerified: string;
  authPasswordWeak: string;
  authPasswordStrong: string;
  authSubmitSuccess: string;
  loadingText: string;
  emptyText: string;
  errorText: string;
}

export const TRANSLATIONS: Record<LangCode, LocalizedBundle> = {
  en: {
    brandName: 'DAWIT SERVICES',
    tagline:
      'Practical assistance for passports, applications, and flights alongside DAWIT HUB—verified global briefings, opportunities, and community.',
    navHome: 'Home',
    navServices: 'Services',
    navHub: 'Dawit Hub',
    navOpportunities: 'Opportunities',
    navSearch: 'Search',
    navDashboard: 'Dashboard',
    navAccount: 'Account',
    navAdmin: 'Admin',
    ctaRequestService: 'Request a Service',
    ctaExploreHub: 'Explore Dawit Hub',
    svcPassportTitle: 'Passport Appointment Assistance',
    svcPassportDesc:
      'Clear guidance, document checklists, and appointment scheduling support without upfront form fees.',
    svcApplicationTitle: 'Application & Digital Assistance',
    svcApplicationDesc:
      'Structured support for academic, scholarship, program, and online portal submissions.',
    svcFlightTitle: 'Flight / Ticket Assistance',
    svcFlightDesc:
      'Itinerary options, routing guidance, and booking coordination tailored to your travel timeline.',
    guestRequestNotice:
      'No account required to submit a request. After submitting, you can optionally create an account to track progress.',
    depositPolicyNote:
      'Workflow: Request → Review → Initial Discussion → Agreement → 200 ETB Deposit → Service Begins → Completion. The 200 ETB deposit is collected only after agreement, deducted from the final fee, and governed by our refund policy if no agreement is reached.',
    createAccountBenefitsTitle: 'Why Create an Account?',
    authChooseLangFirst: 'Select your language before registering or signing in',
    authRegister: 'Create Account',
    authLogin: 'Sign In',
    authResetPassword: 'Reset Password',
    authEmailVerified: 'Email verification link sent. Please check your inbox and spam folder.',
    authPasswordWeak: 'Use a stronger password (10+ characters, uppercase, lowercase, number, symbol).',
    authPasswordStrong: 'Strong password',
    authSubmitSuccess: 'Your request was submitted successfully.',
    loadingText: 'Loading...',
    emptyText: 'No records found.',
    errorText: 'Something went wrong. Please try again.',
  },
  am: {
    brandName: 'ዳዊት ሰርቪስ',
    tagline:
      'ለፓስፖርት ቀጠሮ፣ ለማመልከቻ እና ዲጂታል ድጋፍ፣ እንዲሁም ለበረራ ትኬት አገልግሎት—ከዳዊት ሃብ (የተረጋገጡ ዜናዎች፣ እድሎች እና ማህበረሰብ) ጋር።',
    navHome: 'መነሻ',
    navServices: 'አገልግሎቶች',
    navHub: 'ዳዊት ሃብ',
    navOpportunities: 'እድሎች',
    navSearch: 'ፍለጋ',
    navDashboard: 'ዳሽቦርድ',
    navAccount: 'መለያ',
    navAdmin: 'አስተዳዳሪ',
    ctaRequestService: 'አገልግሎት ይጠይቁ',
    ctaExploreHub: 'ዳዊት ሃብን ይጎብኙ',
    svcPassportTitle: 'የፓስፖርት ቀጠሮ ድጋፍ',
    svcPassportDesc:
      'ግልጽ መመሪያ፣ የሰነድ ዝርዝር እና የቀጠሮ ማመቻቸት ድጋፍ—በመጀመሪያ ጥያቄ ላይ ክፍያ አይጠየቅም።',
    svcApplicationTitle: 'የማመልከቻ እና ዲጂታል ድጋፍ',
    svcApplicationDesc:
      'ለትምህርት፣ ለስኮላርሺፕ፣ ለፕሮግራሞች እና ለኦንላይን ቅጾች የተደራጀ ድጋፍ።',
    svcFlightTitle: 'የበረራ / ትኬት ድጋፍ',
    svcFlightDesc:
      'ለጉዞ ጊዜዎ የተስማሙ የበረራ አማራጮች፣ የመስመር መረጃ እና የትኬት ማስተባበሪያ።',
    guestRequestNotice:
      'ጥያቄ ለማቅረብ መለያ አያስፈልግም። ካስገቡ በኋላ ሂደቱን ለመከታተል መለያ መፍጠር ይችላሉ።',
    depositPolicyNote:
      'የአሰራር ሂደት፡ ጥያቄ → ግምገማ → የመጀመሪያ ውይይት → ስምምነት → 200 ብር ቅድመ ክፍያ (ዲፖዚት) → አገልግሎት መጀመር → ማጠናቀቅ። የ200 ብር ዲፖዚት የሚሰበሰበው ከስምምነት በኋላ ብቻ ሲሆን ከመጨረሻው ክፍያ ይቀነሳል፤ ስምምነት ካልተደረሰ እንደ ተመላሽ ገንዘብ ፖሊሲ ይስተናገዳል።',
    createAccountBenefitsTitle: 'መለያ መፍጠር ለምን ይጠቅማል?',
    authChooseLangFirst: 'ከመመዝገብዎ ወይም ከመግባትዎ በፊት ቋንቋ ይምረጡ',
    authRegister: 'መለያ ይፍጠሩ',
    authLogin: 'ይግቡ',
    authResetPassword: 'የይለፍ ቃል ዳግም ያስጀምሩ',
    authEmailVerified: 'የኢሜይል ማረጋገጫ አገናኝ ተልኳል። እባክዎ ኢሜይልዎን ያረጋግጡ።',
    authPasswordWeak: 'ጠንካራ የይለፍ ቃል ይጠቀሙ (ቢያንስ 10 ፊደላት፣ ትልቅ/ትንሽ ፊደል፣ ቁጥር እና ምልክት)።',
    authPasswordStrong: 'ጠንካራ የይለፍ ቃል',
    authSubmitSuccess: 'ጥያቄዎ በተሳካ ሁኔታ ገብቷል።',
    loadingText: 'በመጫን ላይ...',
    emptyText: 'ምንም መረጃ አልተገኘም።',
    errorText: 'ችግር ተፈጥሯል። እባክዎ እንደገና ይሞክሩ።',
  },
  ti: {
    brandName: 'ዳዊት ሰርቪስ',
    tagline:
      'ንቆጽሮ ፓስፖርት፣ ንመመልከቲታትን ዲጂታላዊ ሓገዝን፣ ከምኡውን ንትኬት በረራ ሓገዝ—ምስ ዳዊት ሃብ (ዜናታት፣ ዕድላትን ማሕበረሰብን)።',
    navHome: 'መበገሲ',
    navServices: 'ኣገልግሎታት',
    navHub: 'ዳዊት ሃብ',
    navOpportunities: 'ዕድላት',
    navSearch: 'ምድላይ',
    navDashboard: 'ዳሽቦርድ',
    navAccount: 'ሕሳብ',
    navAdmin: 'ኣመሓዳሪ',
    ctaRequestService: 'ኣገልግሎት ሕተት',
    ctaExploreHub: 'ዳዊት ሃብ ርአይ',
    svcPassportTitle: 'ናይ ቆጽሮ ፓስፖርት ሓገዝ',
    svcPassportDesc:
      'ንጹር መምርሒ፣ ዝርዝር ሰነዳትን ናይ ቆጽሮ ምምችቻውን—ኣብ ፈለማ ሕቶ ክፍሊት ኣይሕተትን።',
    svcApplicationTitle: 'ናይ መመልከቲን ዲጂታላዊ ሓገዝን',
    svcApplicationDesc:
      'ንትምህርቲ፣ ንስኮላርሺፕ፣ ንፕሮግራማትን ኦንላይን ቅጥዕታትን ዝተወደበ ሓገዝ።',
    svcFlightTitle: 'ናይ በረራ / ትኬት ሓገዝ',
    svcFlightDesc:
      'ንግዜ መገሻኻ ዝሰማማዕ ናይ በረራ ኣማራጽታት፣ መስመርን ምትሕብባር ትኬትን።',
    guestRequestNotice:
      'ሕቶ ንምቕራብ ሕሳብ ኣየድልን። ድሕሪ ምእታው ኩነታት ንምክትታል ሕሳብ ክትከፍት ትኽእል።',
    depositPolicyNote:
      'ቅደም ሰዓብ ኣሰራርሓ፡ ሕቶ → ምርመራ → ናይ መጀመሪያ ዘተ → ስምምዕ → 200 ቅርሺ ቅድመ ክፍሊት → ኣገልግሎት ምጅማር → ምዝዛም። እቲ 200 ቅርሺ ድሕሪ ስምምዕ ጥራይ ይኽፈል፣ ካብ ጠቕላላ ክፍሊት ይቅነስ።',
    createAccountBenefitsTitle: 'ሕሳብ ምኽፋት እንታይ ረብሓ ኣለዎ?',
    authChooseLangFirst: 'ቅድሚ ምምዝጋብ ወይ ምእታው ቋንቋ ምረጽ',
    authRegister: 'ሕሳብ ክፈት',
    authLogin: 'እቶ',
    authResetPassword: 'መሕለፊ ቃል ቀይር',
    authEmailVerified: 'ናይ ኢመይል መረጋገጺ መላግቦ ተሰዲዱ ኣሎ። ኢመይልካ ርአ።',
    authPasswordWeak: 'ዝያዳ ጽኑዕ መሕለፊ ቃል ተጠቐም (10+ ፊደላት፣ ዓብይ/ንእሽቶ ፊደል፣ ቁጽሪን ምልክትን)።',
    authPasswordStrong: 'ጽኑዕ መሕለፊ ቃል',
    authSubmitSuccess: 'ሕቶኻ ብዓወት ቀሪቡ ኣሎ።',
    loadingText: 'ይጽዕን ኣሎ...',
    emptyText: 'ዝኾነ ሓበሬታ ኣይተረኽበን።',
    errorText: 'ጸገም ኣጋጢሙ። በጃኻ ደጊምካ ፈትን።',
  },
  om: {
    brandName: 'DAWIT SERVICES',
    tagline:
      'Deeggarsa beellama paaspoortii, iyyannoo fi tikeeta balallii, akkasumas DAWIT HUB—odeeffannoo, carraa fi hawaasa waliin.',
    navHome: 'Fuula Jalqabaa',
    navServices: 'Tajaajiloota',
    navHub: 'Dawit Hub',
    navOpportunities: 'Carraawwan',
    navSearch: 'Barbaadi',
    navDashboard: 'Daashboordii',
    navAccount: 'Herrega',
    navAdmin: 'Bulchaa',
    ctaRequestService: 'Tajaajila Gaafadhu',
    ctaExploreHub: 'Dawit Hub Daa’adhu',
    svcPassportTitle: 'Deeggarsa Beellama Paaspoortii',
    svcPassportDesc:
      'Qajeelfama ifaa, tarreeffama sanadaa fi mijeessuu beellamaa—iyyannoo jalqabaa irratti kaffaltiin hin gaafatamu.',
    svcApplicationTitle: 'Deeggarsa Iyyannoo fi Diijitaalaa',
    svcApplicationDesc:
      'Deeggarsa barnootaa, iskolaarshii, sagantaawwanii fi foormiiwwan toora intarneetii.',
    svcFlightTitle: 'Deeggarsa Balallii / Tikeetaa',
    svcFlightDesc:
      'Filannoo balallii, qajeelfama imalaa fi qindeessuu tikeetaa yeroo imala keessaniif mijatu.',
    guestRequestNotice:
      'Gaaffii tajaajilaa dhiyeessuuf herregni hin barbaachisu. Erga galchitanii booda hordofuuf herrega uumuu dandeessu.',
    depositPolicyNote:
      'Adeemsa hojii: Gaaffii → Sakatta’a → Marii jalqabaa → Waliigaltee → Kaffaltii dursaa qarshii 200 → Tajaajila eegaluu → Xumura. Qarshiin 200 waliigaltee booda qofa kan kaffalamu yoo ta’u, kaffaltii xumuraa irraa hir’ifama.',
    createAccountBenefitsTitle: 'Herrega Uumuun Maaliif Fayyada?',
    authChooseLangFirst: 'Galmaa’uu ykn seenuu keessan dura afaan filadhaa',
    authRegister: 'Herrega Uumi',
    authLogin: 'Seeni',
    authResetPassword: 'Jecha Darbi Deebisii Uumi',
    authEmailVerified: 'Geessituun mirkaneessa imeelii ergameera. Imeelii keessan ilaalaa.',
    authPasswordWeak: 'Jecha darbi cimaa fayyadamaa (qubee 10+, guddina/xiqqina, lakkoofsa fi mallattoo).',
    authPasswordStrong: 'Jecha darbi cimaa',
    authSubmitSuccess: 'Gaaffiin keessan milkaa’inaan ergameera.',
    loadingText: 'Fe’aa jira...',
    emptyText: 'Ragaan tokkollee hin argamne.',
    errorText: 'Dogoggorri uumameera. Maaloo irra deebi’ii yaalaa.',
  },
};