export type ServiceKey = 'passport' | 'application' | 'flight';
export type LangKey = 'am' | 'en' | 'ti' | 'om';

export interface ServiceConfig {
  key: ServiceKey;
  title: string;
  requestButtonLabel: string;
  startingPriceEtb: number | null;
  description: string;
  highlights: string[];
  disclaimer: string;
  feeNote: string;
  prominent?: boolean;
}

export interface StepItem {
  step: string;
  title: string;
  detail: string;
}

export interface TrustItem {
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface LocalizedContent {
  nav: {
    home: string;
    services: string;
    howItWorks: string;
    about: string;
    faq: string;
    contact: string;
  };
  langBannerBadge: string;
  langBannerText: string;
  heroBadge: string;
  heroHeadline: string;
  heroSubtext: string;
  requestBtn: string;
  exploreBtn: string;
  servicesHeading: string;
  servicesSubheading: string;
  services: ServiceConfig[];
  howItWorksHeading: string;
  howItWorksSubheading: string;
  howItWorksSteps: StepItem[];
  depositBadge: string;
  depositHeading: string;
  depositParagraphs: string[];
  depositHighlight: string;
  depositFlowLabel: string;
  pricingHeading: string;
  pricingSubheading: string;
  depositCardTitle: string;
  depositCardText: string;
  agreedAfterReviewLabel: string;
  startingFromLabel: string;
  thirdPartyCardTitle: string;
  thirdPartyServiceFeeText: string;
  thirdPartyOtherFeesText: string;
  formHeading: string;
  formSubheading: string;
  formModalNote: string;
  aboutBadge: string;
  aboutHeading: string;
  aboutRole: string;
  aboutBio: string;
  trustHeading: string;
  trustPillars: TrustItem[];
  disclaimerHeading: string;
  disclaimerParagraphs: string[];
  faqHeading: string;
  faqItems: FaqItem[];
  contactHeading: string;
  contactSubheading: string;
  phoneLabel: string;
  telegramLabel: string;
  standardEmailLabel: string;
  vipTitle: string;
  vipTextPrefix: string;
  vipTextSuffix: string;
  vipNote: string;
  copyLabel: string;
  copiedLabel: string;
  footerBrand: string;
  topLabel: string;
  privacyLink: string;
  termsLink: string;
  refundLink: string;
  adminLink: string;
}

export const DEPOSIT_AMOUNT_ETB = 200;

export const CONTACT_INFO = {
  phone: '+251985076136',
  telegram: '@daveisenough',
  standardEmail: 'dawiittesfay@gmail.com',
  vipEmail: 'dawittesfay2724@gmail.com',
};

export const LANGUAGES: { key: LangKey; label: string; native: string }[] = [
  { key: 'am', label: 'Amharic', native: 'አማርኛ' },
  { key: 'en', label: 'English', native: 'English' },
  { key: 'ti', label: 'Tigrigna', native: 'ትግርኛ' },
  { key: 'om', label: 'Afaan Oromo', native: 'Afaan Oromo' },
];

export const SITE_CONTENT: Record<LangKey, LocalizedContent> = {
  am: {
    nav: {
      home: 'መነሻ',
      services: 'አገልግሎቶች',
      howItWorks: 'አሰራር',
      about: 'ስለ ዳዊት',
      faq: 'ጥያቄዎች',
      contact: 'ያግኙን',
    },
    langBannerBadge: '4 ቋንቋዎች ይገኛሉ',
    langBannerText:
      'ይህ ድረ-ገጽ በ4 ቋንቋዎች (አማርኛ፣ English፣ ትግርኛ፣ Afaan Oromo) ይሰራል። መጀመሪያ በአማርኛ ተከፍቷል፤ የሚመችዎትን ቋንቋ ይምረጡ።',
    heroBadge: 'ዳዊት ሰርቪስስ • ዲጂታል እና አስተዳደራዊ እገዛ',
    heroHeadline:
      'የፓስፖርት ቀጠሮ፣ የኦንላይን ማመልከቻ ወይም የበረራ ትኬት ጉዳይ ግራ አጋብቶዎታል?',
    heroSubtext:
      'ማመልከቻ መሙላት፣ የኦንላይን ሲስተም መጠቀም፣ የፓስፖርት ሂደት መከታተል ወይም በረራ ማመቻቸት ለሚያስፈልጋቸው ሰዎች ጥርት ያለ እና ተግባራዊ እገዛ እንሰጣለን።',
    requestBtn: 'አገልግሎት ይጠይቁ',
    exploreBtn: 'አገልግሎቶችን ይመልከቱ',
    servicesHeading: 'የምንሰጣቸው ሶስት አገልግሎቶች',
    servicesSubheading:
      'ስራችን በሶስት ነገሮች ላይ ብቻ ያተኮረ ነው፡ የማመልከቻ እና ዲጂታል እገዛ፣ የፓስፖርት ቀጠሮ እገዛ፣ እና የበረራ ትኬት እገዛ።',
    services: [
      {
        key: 'application',
        title: 'የማመልከቻ እና ዲጂታል እገዛ',
        requestButtonLabel: 'የዲጂታል እገዛ ይጠይቁ',
        startingPriceEtb: null,
        prominent: true,
        description:
          'የሀገር ውስጥም ሆነ የውጭ ኦንላይን ማመልከቻ ለመሙላት፣ ለማስተካከል፣ ለመላክ ወይም አሰራሩን ለመረዳት ተቸግረዋል? በሂደቱ እናግዝዎታለን።',
        highlights: [
          'የዩኒቨርሲቲ ማመልከቻዎች',
          'የስኮላርሺፕ ማመልከቻዎች',
          'የዓለም አቀፍ ድርጅት ማመልከቻዎች',
          'የኢትዮጵያ ኦንላይን ሲስተሞች',
          'ከመንግስት ጋር የተያያዙ የኦንላይን አገልግሎቶች',
          'የኦንላይን ቅጾች',
          'የአካውንት ወይም የማመልከቻ ችግሮች',
          'ሰነድ መጫን (Document upload)',
          'የተሞላ ማመልከቻ ማስተካከል',
          'ድረ-ገጽ እና ሲስተም መጠቀም',
          'ማስረከብ ሲያስቸግር',
        ],
        disclaimer:
          'ዳዊት ሰርቪስስ መመሪያ እና ቴክኒካዊ/አስተዳደራዊ እገዛ ይሰጣል። ትክክለኛ መረጃ እና እውነተኛ ሰነድ የማቅረብ ሃላፊነት የደንበኛው ነው።',
        feeNote:
          'የዳዊት ሰርቪስስ የእገዛ ክፍያ ከማመልከቻ፣ ከፈተና፣ ከዩኒቨርሲቲ ወይም ከሌላ ሶስተኛ ወገን ክፍያ የተለየ ነው።',
      },
      {
        key: 'passport',
        title: 'የፓስፖርት ቀጠሮ እገዛ',
        requestButtonLabel: 'የፓስፖርት እገዛ ይጠይቁ',
        startingPriceEtb: null,
        description:
          'የፓስፖርት ማመልከቻ ወይም ቀጠሮ ሂደት ሲያስቸግርዎ፣ በኦንላይን እርምጃዎች፣ በቅጽ አሞላል፣ በቀጠሮ አወጣጥ እና በተለመዱ ችግሮች ላይ ተግባራዊ እገዛ እንሰጣለን።',
        highlights: [
          'የኦንላይን ማመልከቻ መመሪያ',
          'የቀጠሮ እገዛ',
          'ቅጽ ለመሙላት እገዛ',
          'ሂደቱን በቀላሉ መረዳት',
          'በተለመዱ ችግሮች ጊዜ እገዛ',
        ],
        disclaimer:
          'ዳዊት ሰርቪስስ በሂደቱ ላይ እገዛ ያደርጋል። ፓስፖርት መስጠት እና ውሳኔ የሚመለከተው የመንግስት አካል ሃላፊነት ነው።',
        feeNote:
          'የዳዊት ሰርቪስስ ክፍያ ከመንግስት የፓስፖርት እና ተያያዥ ኦፊሴላዊ ክፍያዎች የተለየ ነው።',
      },
      {
        key: 'flight',
        title: 'የበረራ እና ትኬት እገዛ',
        requestButtonLabel: 'የበረራ እገዛ ይጠይቁ',
        startingPriceEtb: null,
        description:
          'ወደ ሌላ ሀገር ወይም መዳረሻ መብረር ከፈለጉ፣ መቼ እና ወዴት መሄድ እንደሚፈልጉ ይንገሩን፤ ተስማሚ የበረራ አማራጮችን ለማየት እና የቦኪንግ ሂደቱን ለመከታተል እናግዝዎታለን።',
        highlights: [
          'በረራ መፈለግ እገዛ',
          'አማራጮችን ማነጻጸር',
          'የመነሻ እና መድረሻ መመሪያ',
          'የጉዞ ቀን ማመቻቸት',
          'የቦኪንግ እርምጃ እገዛ',
        ],
        disclaimer:
          'የአየር መንገድ ትኬት ዋጋ እና ሌሎች ክፍያዎች በግልጽ ካልተባሉ በስተቀር ከዳዊት ሰርቪስስ የእገዛ ክፍያ የተለዩ ናቸው።',
        feeNote:
          'ዳዊት ሰርቪስስ በግልጽ ካልተገለጸ በስተቀር አየር መንገድ ወይም የተፈቀደ የጉዞ ወኪል አይደለም።',
      },
    ],
    howItWorksHeading: 'አገልግሎቱ እንዴት ይሰራል',
    howItWorksSubheading: 'እያንዳንዱ ጥያቄ ከመነሻው ጀምሮ እስከ ስምምነት እና አገልግሎት ድረስ በግልጽ ስድስት እርምጃዎችን ይከተላል።',
    howItWorksSteps: [
      {
        step: '01',
        title: 'የሚፈልጉትን ይንገሩን',
        detail: 'በድረ-ገጹ በኩል የአገልግሎት ጥያቄ ያስገቡ።',
      },
      {
        step: '02',
        title: 'ጥያቄዎን እንመረምራለን',
        detail: 'ሁኔታዎን አይተን ምን አይነት እገዛ እንደሚያስፈልግ እንለያለን።',
      },
      {
        step: '03',
        title: 'እንነጋገራለን እና እንስማማለን',
        detail: 'አብረን ተነጋግረን የስራውን ወሰን፣ የሁለቱንም ሃላፊነት፣ ዋጋውን እና የሚፈጀውን ጊዜ እንስማማለን።',
      },
      {
        step: '04',
        title: 'የ200 ብር ተቀማጭ ይክፈሉ',
        detail: 'ከመነሻ ውይይት እና ለመቀጠል ከተስማማን በኋላ ደንበኛው የ200 ብር የአገልግሎት ተቀማጭ ይከፍላል።',
      },
      {
        step: '05',
        title: 'ተቀማጩ ከዋጋው ይቀነሳል',
        detail: 'ደንበኛው በስምምነቱ ከቀጠለ፣ የተከፈለው 200 ብር ከጠቅላላ የአገልግሎት ክፍያ ይቀነሳል።',
      },
      {
        step: '06',
        title: 'የተስማማነውን ስራ እንሰራለን',
        detail: 'የተስማማነውን እገዛ ጀምረን አስፈላጊ ሲሆን ከደንበኛው ጋር እንገናኛለን።',
      },
    ],
    depositBadge: 'የተቀማጭ ህግ',
    depositHeading: 'የ200 ብር የአገልግሎት ተቀማጭ (Deposit)',
    depositParagraphs: [
      'አገልግሎት መስጠት ከመጀመራችን በፊት፣ ከመነሻ ውይይት እና ለመቀጠል ከተስማማን በኋላ የ200 ብር የአገልግሎት ተቀማጭ ያስፈልጋል።',
      'በተስማማነው አገልግሎት ከቀጠሉ፣ የ200 ብር ተቀማጭ ከጠቅላላ የአገልግሎት ክፍያ ተቀንሶ ይሰላል።',
      'በመነሻ ድርድር ወቅት ስምምነት ላይ ካልደረስን፣ የ200 ብር ተቀማጭ ተመላሽ ይደረጋል።',
    ],
    depositHighlight:
      'ስለዚህ ይህ 200 ብር ተጨማሪ ክፍያ አይደለም፤ ደንበኛው ሲቀጥል ከተስማማነው የአገልግሎት ክፍያ ውስጥ የሚካተት ነው።',
    depositFlowLabel:
      'ቅደም ተከተል፡ ጥያቄ ማስገባት → የመነሻ ውይይት → በአገልግሎት እና በዋጋ መስማማት → የ200 ብር ተቀማጭ → ስራ ይጀምራል',
    pricingHeading: 'ግልጽ የዋጋ አሰጣጥ',
    pricingSubheading:
      'የአገልግሎት ክፍያ እንደ ጥያቄው አይነት እና ውስብስብነት ይለያያል። ስራ ከመጀመሩ በፊት የስራውን ወሰን እና ዋጋ ተነጋግረን እንስማማለን።',
    depositCardTitle: '200 ብር የአገልግሎት ተቀማጭ',
    depositCardText: 'ደንበኛው በስምምነቱ ሲቀጥል ከመጨረሻው የአገልግሎት ክፍያ ይቀነሳል።',
    agreedAfterReviewLabel: 'ከውይይት በኋላ በስምምነት',
    startingFromLabel: 'ከ ___ ብር ጀምሮ',
    thirdPartyCardTitle: 'የአገልግሎት ክፍያ እና የሶስተኛ ወገን ክፍያዎች',
    thirdPartyServiceFeeText:
      'የዳዊት ሰርቪስስ ክፍያ ስራ ከመጀመሩ በፊት ለተስማማንበት የእገዛ እና የመመሪያ ጊዜ የሚከፈል ነው።',
    thirdPartyOtherFeesText:
      'የመንግስት፣ የዩኒቨርሲቲ፣ የአየር መንገድ ወይም የሌላ ሶስተኛ ወገን ክፍያዎች በግልጽ ካልተጠቀሱ በስተቀር የተለዩ ናቸው።',
    formHeading: 'አገልግሎት ይጠይቁ',
    formSubheading:
      'መረጃዎን ያስገቡ እና የሚፈልጉትን አገልግሎት ይምረጡ። ጥያቄዎን አይተን ለመነሻ ውይይት እናገኝዎታለን።',
    formModalNote: 'ማንኛውም የ200 ብር ተቀማጭ ከመነሻ ውይይት እና ስምምነት በኋላ ነው።',
    aboutBadge: 'ዳዊትን ይወቁ',
    aboutHeading: 'ዳዊት ተስፋይ',
    aboutRole:
      'የBSc ኮምፒውተር ሳይንስ እና የBA ማኔጅመንት የመጀመሪያ ዲግሪ ተማሪ | ከ3 ዓመት በላይ የላቀ እንግሊዝኛ ማስተማር ልምድ',
    aboutBio:
      'ዳዊት ተስፋይ በአሁኑ ወቅት በBSc ኮምፒውተር ሳይንስ እና በBA ማኔጅመንት የመጀመሪያ ዲግሪ ተማሪ ሲሆን ከ3 ዓመት በላይ የላቀ እንግሊዝኛ የማስተማር ልምድ አለው። በኦንላይን ማመልከቻዎች፣ በዲጂታል ቅጾች እና በአስተዳደራዊ እርምጃዎች ግልጽ እና ተግባራዊ እገዛ ይሰጣል።',
    trustHeading: 'ለምን ዳዊት ሰርቪስስ?',
    trustPillars: [
      {
        title: 'ግልጽ ግንኙነት',
        description: 'ስራ ከመጀመሩ በፊት ሂደቱን እና የሚያስፈልጉ ነገሮችን በግልጽ እናስረዳለን።',
      },
      {
        title: 'ግልጽ ዋጋ',
        description: 'አገልግሎቱ ከመጀመሩ በፊት ደንበኛው የተስማማውን የአገልግሎት ክፍያ ያውቃል።',
      },
      {
        title: 'ቀጥተኛ ድጋፍ',
        description: 'ደንበኞች በቀጥታ ከዳዊት ሰርቪስስ ጋር ይነጋገራሉ።',
      },
      {
        title: 'ተግባራዊ እገዛ',
        description: 'አስቸጋሪ የሚመስሉ የዲጂታል እና የአስተዳደር ሂደቶችን በቀላሉ እንዲያልፉ እናግዛለን።',
      },
    ],
    disclaimerHeading: 'ጠቃሚ ማሳሰቢያ',
    disclaimerParagraphs: [
      'ዳዊት ሰርቪስስ ዲጂታላዊ፣ አስተዳደራዊ እና የመረጃ እገዛ ይሰጣል። በመንግስት አካላት፣ በዩኒቨርሲቲዎች፣ በኤምባሲዎች፣ በአየር መንገዶች፣ በኢሚግሬሽን ወይም በሌሎች ሶስተኛ ወገኖች የሚሰጡ ውሳኔዎችን አንቆጣጠርም።',
      'ፓስፖርት መውጣትን፣ የዩኒቨርሲቲ መግቢያን፣ የስኮላርሺፕ እድልን፣ የቪዛ መጽደቅን፣ የበረራ ቦታ መገኘትን ወይም ሌሎች የሶስተኛ ወገን ውሳኔዎችን ዋስትና አንሰጥም።',
      'ትክክለኛ መረጃ እና እውነተኛ ሰነድ ማቅረብ የደንበኛው ሃላፊነት ነው።',
    ],
    faqHeading: 'በተደጋጋሚ የሚጠየቁ ጥያቄዎች',
    faqItems: [
      {
        question: 'ዳዊት ማን ነው?',
        answer:
          'ዳዊት ተስፋይ በአሁኑ ወቅት በBSc ኮምፒውተር ሳይንስ እና በBA ማኔጅመንት የመጀመሪያ ዲግሪ ተማሪ ሲሆን ከ3 ዓመት በላይ የላቀ እንግሊዝኛ የማስተማር እና ሰዎችን በኦንላይን ቅጾች፣ ሲስተሞች እና አስተዳደራዊ ሂደቶች የመርዳት ልምድ አለው።',
      },
      {
        question: 'ምን አይነት አገልግሎቶችን ትሰጣላችሁ?',
        answer:
          'የፓስፖርት ቀጠሮ እገዛ፣ የማመልከቻ እና ዲጂታል እገዛ፣ እንዲሁም የበረራ እና ትኬት እገዛ እንሰጣለን።',
      },
      {
        question: 'ስለ ጥያቄዬ ከመነጋገራችን በፊት 200 ብር መክፈል አለብኝ?',
        answer:
          'የለም። መጀመሪያ ጥያቄ ቀርቦ እንነጋገራለን። የ200 ብር ተቀማጭ የሚከፈለው ስለ አገልግሎቱ እና ስለ ዋጋው ተነጋግረን ለመቀጠል ከተስማማን በኋላ ነው።',
      },
      {
        question: '200 ብር ተጨማሪ ክፍያ ነው?',
        answer:
          'አይደለም። በተስማማነው አገልግሎት ከቀጠሉ፣ ከጠቅላላ የአገልግሎት ክፍያ ይቀነሳል።',
      },
      {
        question: '200 ብር መቼ ተመላሽ ይሆናል?',
        answer:
          'በመነሻ ድርድር ወቅት ስምምነት ላይ ካልደረስን ይመለሳል።',
      },
      {
        question: 'ዳዊት ሰርቪስስ የቪዛ መጽደቅ ወይም የዩኒቨርሲቲ መግቢያ ዋስትና ይሰጣል?',
        answer:
          'አይሰጥም። ዳዊት ሰርቪስስ እገዛ እና መመሪያ ይሰጣል፤ የመጨረሻ ውሳኔ የሚመለከታቸው ተቋማት እና አካላት ነው።',
      },
      {
        question: 'የመንግስት፣ የዩኒቨርሲቲ፣ የአየር መንገድ ወይም ሌሎች ክፍያዎች ውስጥ ተካተዋል?',
        answer:
          'በግልጽ ካልተባሉ በስተቀር አልተካተቱም። ከዳዊት ሰርቪስስ የእገዛ ክፍያ የተለዩ ናቸው።',
      },
      {
        question: 'ለውጭ ሀገር ማመልከቻዎች ማገዝ ትችላላችሁ?',
        answer:
          'አዎ፣ ማመልከቻን በመረዳት፣ በመሙላት፣ በማስተካከል ወይም በማስረከብ ላይ ህጋዊ እገዛ በሚያስፈልግበት ጊዜ እናግዛለን። የመረጃ እና የሰነድ ትክክለኛነት ሃላፊነት የደንበኛው ነው።',
      },
    ],
    contactHeading: 'ዳዊት ሰርቪስስን ያግኙ',
    contactSubheading: 'ለመደበኛ ጥያቄዎች በቀጥታ ያግኙን ወይም በድረ-ገጹ የአገልግሎት ጥያቄ ያስገቡ።',
    phoneLabel: 'ስልክ',
    telegramLabel: 'ቴሌግራም',
    standardEmailLabel: 'መደበኛ ኢሜይል',
    vipTitle: 'ለአስቸኳይ (Emergency) ወይም ለVIP / ፕሪሚየም አገልግሎት ኢሜይል',
    vipTextPrefix: 'አስቸኳይ ጉዳይ ካለዎት ወይም የVIP / ፕሪሚየም አገልግሎት ከፈለጉ በዚህ ኢሜይል ይላኩ፡ ',
    vipTextSuffix: '።',
    vipNote:
      'ማሳሰቢያ (N.B.)፡ ይህ ኢሜይል ለአስቸኳይ (Emergency) እና ለVIP ጥያቄዎች ብቻ ነው። ለመደበኛ አገልግሎት በዚህ ኢሜይል የሚላክ መልስ አይሰጠውም፤ እንዲሁም የEmergency ወይም VIP ኢሜይል ሲልኩ በSubject ላይ "Emergency" ወይም "VIP" ብለው መጻፍ አለብዎት።',
    copyLabel: 'ቅዳ',
    copiedLabel: 'ተቀድቷል',
    footerBrand: 'ዳዊት ሰርቪስስ — ዲጂታል እና አስተዳደራዊ እገዛ',
    topLabel: 'ወደ ላይ',
    privacyLink: 'የግላዊነት ፖሊሲ',
    termsLink: 'የአገልግሎት ውሎች',
    refundLink: 'የተመላሽ ገንዘብ ፖሊሲ',
    adminLink: 'አድሚን',
  },
  en: {
    nav: {
      home: 'Home',
      services: 'Services',
      howItWorks: 'How It Works',
      about: 'About',
      faq: 'FAQ',
      contact: 'Contact',
    },
    langBannerBadge: '4 Languages Available',
    langBannerText:
      'This website is available in 4 languages (Amharic, English, Tigrigna, Afaan Oromo). Amharic is selected first by default—choose your preferred language.',
    heroBadge: 'DAWIT SERVICES • Digital & Administrative Assistance',
    heroHeadline: 'Need help navigating a passport process, online application, or flight booking?',
    heroSubtext:
      'We provide practical assistance to individuals who need help using digital platforms, completing applications, navigating passport processes, or arranging flights.',
    requestBtn: 'Request a Service',
    exploreBtn: 'Explore Services',
    servicesHeading: 'Core Services',
    servicesSubheading:
      'Focused practical support across three clear areas: application & digital assistance, passport appointment assistance, and flight/ticket assistance.',
    services: [
      {
        key: 'application',
        title: 'Application & Digital Assistance',
        requestButtonLabel: 'Request Digital Assistance',
        startingPriceEtb: null,
        prominent: true,
        description:
          'Having difficulty using, completing, modifying, submitting, or understanding an Ethiopian or international online application? We can help you navigate the process.',
        highlights: [
          'University applications',
          'Scholarship applications',
          'International organization applications',
          'Ethiopian online platforms',
          'Government-related online services',
          'Online forms',
          'Account/application difficulties',
          'Document uploads',
          'Application modifications',
          'Website/platform navigation',
          'Submission difficulties',
        ],
        disclaimer:
          'Dawit Services provides guidance and technical/administrative assistance. Clients remain responsible for providing truthful information and authentic documents.',
        feeNote:
          'Dawit Services assistance fees are separate from application, testing, university, or third-party fees unless explicitly stated.',
      },
      {
        key: 'passport',
        title: 'Passport Appointment Assistance',
        requestButtonLabel: 'Request Passport Assistance',
        startingPriceEtb: null,
        description:
          'Need help navigating the passport application or appointment process? We can provide practical assistance with the online process, forms, appointment steps, and common difficulties.',
        highlights: [
          'Online application guidance',
          'Appointment assistance',
          'Form-filling guidance',
          'Help understanding the process',
          'Assistance with common application difficulties',
        ],
        disclaimer:
          'Dawit Services provides assistance with the process. Passport issuance and decisions remain the responsibility of the relevant government authority.',
        feeNote:
          'Dawit Services service fees are separate from government passport and related official fees.',
      },
      {
        key: 'flight',
        title: 'Flight & Ticket Assistance',
        requestButtonLabel: 'Request Flight Assistance',
        startingPriceEtb: null,
        description:
          'Looking for a flight to another country or destination? Tell us where and when you want to travel, and we can help you identify suitable flight options and navigate the booking process.',
        highlights: [
          'Flight search assistance',
          'Comparing available options',
          'Departure/destination guidance',
          'Travel-date assistance',
          'Booking assistance',
        ],
        disclaimer:
          'Airline ticket costs and third-party charges are separate from the Dawit Services assistance fee unless explicitly stated.',
        feeNote:
          'Dawit Services is not an airline or an authorized travel agency unless explicitly stated.',
      },
    ],
    howItWorksHeading: 'How It Works',
    howItWorksSubheading: 'Every request follows a clear six-step flow from initial inquiry to agreed assistance.',
    howItWorksSteps: [
      {
        step: '01',
        title: 'Tell us what you need',
        detail: 'Submit a service request through the website.',
      },
      {
        step: '02',
        title: 'We review your request',
        detail: 'We look at your situation and determine what assistance is appropriate.',
      },
      {
        step: '03',
        title: 'We discuss the service',
        detail:
          'We communicate with you and agree on the scope of the service, responsibilities, price, and expected timeline.',
      },
      {
        step: '04',
        title: 'Pay the 200 ETB deposit',
        detail: 'After the initial discussion and agreement to proceed, the customer pays a 200 ETB service deposit.',
      },
      {
        step: '05',
        title: 'Deposit is deducted',
        detail: 'If the customer proceeds, the 200 ETB deposit is deducted from the final service fee.',
      },
      {
        step: '06',
        title: 'We provide the agreed service',
        detail: 'We begin the agreed work and communicate with the customer as necessary.',
      },
    ],
    depositBadge: 'Deposit Policy',
    depositHeading: '200 ETB Service Deposit',
    depositParagraphs: [
      'Before we begin providing a service, a 200 ETB service deposit is required after the initial discussion and agreement to proceed.',
      'If you proceed with the agreed service, the 200 ETB deposit will be deducted from the total service fee.',
      'If we do not reach an agreement during the initial negotiation, the 200 ETB deposit will be refunded.',
    ],
    depositHighlight:
      'The deposit is therefore not an additional charge. It forms part of the agreed service fee when the customer proceeds.',
    depositFlowLabel:
      'Flow: Request → Initial discussion → Agreement on service/price → 200 ETB deposit → Service begins',
    pricingHeading: 'Transparent Pricing',
    pricingSubheading:
      'Service fees depend on the type and complexity of the request. We discuss and agree on the service scope and price before work begins.',
    depositCardTitle: '200 ETB Service Deposit',
    depositCardText: 'Deducted from the final service fee when the customer proceeds.',
    agreedAfterReviewLabel: 'Agreed after discussion',
    startingFromLabel: 'Starting from',
    thirdPartyCardTitle: 'Service Fee vs. Third-Party Costs',
    thirdPartyServiceFeeText:
      'Dawit Services fee covers our guidance, review, and assistance time as agreed before work begins.',
    thirdPartyOtherFeesText:
      'Government / university / airline / third-party fees are separate unless explicitly stated.',
    formHeading: 'Request a Service',
    formSubheading:
      'Share your details and select the assistance you need. We will review your request and reach out for an initial discussion.',
    formModalNote: 'Initial discussion comes before any 200 ETB service deposit.',
    aboutBadge: 'Meet Dawit',
    aboutHeading: 'Dawit Tesfay',
    aboutRole:
      'Undergraduate Student in BSc Computer Science & BA Management | 3+ Years Teaching Advanced English',
    aboutBio:
      'Dawit Tesfay is currently an undergraduate student pursuing a BSc in Computer Science and a BA in Management, with over 3 years of experience teaching advanced English. He provides clear, practical guidance with online applications, digital platforms, and administrative steps.',
    trustHeading: 'Why Dawit Services?',
    trustPillars: [
      {
        title: 'Clear Communication',
        description: 'We explain the process and requirements before work begins.',
      },
      {
        title: 'Transparent Pricing',
        description: 'Customers know the agreed service fee before the service starts.',
      },
      {
        title: 'Personal Support',
        description: 'Customers communicate directly with Dawit Services.',
      },
      {
        title: 'Practical Assistance',
        description: 'We help customers navigate confusing digital and administrative processes.',
      },
    ],
    disclaimerHeading: 'Important Disclaimer',
    disclaimerParagraphs: [
      'Dawit Services provides digital, administrative and informational assistance. We do not control decisions made by government authorities, universities, embassies, airlines, immigration authorities, or other third parties.',
      'We do not guarantee passport issuance, university admission, scholarship awards, visa approval, flight availability, or other third-party decisions.',
      'Customers are responsible for providing accurate information and authentic documents.',
    ],
    faqHeading: 'Frequently Asked Questions',
    faqItems: [
      {
        question: 'Who is Dawit?',
        answer:
          'Dawit Tesfay is currently an undergraduate student pursuing a BSc in Computer Science and a BA in Management, with over 3 years of experience teaching advanced English and assisting individuals with online forms, digital platforms, and administrative processes.',
      },
      {
        question: 'What services do you provide?',
        answer:
          'Passport appointment assistance, application & digital assistance, and flight/ticket assistance.',
      },
      {
        question: 'Do I have to pay 200 ETB before discussing my request?',
        answer:
          'No. The initial request and discussion come first. The 200 ETB deposit is paid after the service and price have been discussed and the customer agrees to proceed.',
      },
      {
        question: 'Is the 200 ETB an additional fee?',
        answer: 'No. If you proceed with the agreed service, it is deducted from the total service fee.',
      },
      {
        question: 'When is the 200 ETB refunded?',
        answer: 'If we do not reach an agreement during the initial negotiation.',
      },
      {
        question: 'Does Dawit Services guarantee visa approval or university admission?',
        answer:
          'No. Dawit Services provides guidance and assistance, while admissions, visas, passports, and other third-party decisions remain with the relevant institutions and authorities.',
      },
      {
        question: 'Are government, university, airline, or other third-party fees included?',
        answer:
          'Not unless explicitly stated. These should be clearly separated from the Dawit Services service fee.',
      },
      {
        question: 'Can you help with international applications?',
        answer:
          'Yes, where the request involves legitimate assistance with navigating, understanding, completing, modifying, or submitting an application. The customer remains responsible for the truthfulness and authenticity of their information and documents.',
      },
    ],
    contactHeading: 'Contact Dawit Services',
    contactSubheading: 'Reach out directly for standard inquiries or submit a service request online.',
    phoneLabel: 'Phone',
    telegramLabel: 'Telegram',
    standardEmailLabel: 'Standard Email',
    vipTitle: 'Emergency or VIP / Premium Service Email',
    vipTextPrefix: 'If you have an emergency or need VIP / premium service, you can email ',
    vipTextSuffix: '.',
    vipNote:
      'N.B. This email is strictly for Emergency and VIP requests. Standard service requests will not receive a reply at this address, and anyone emailing for Emergency or VIP support must state "Emergency" or "VIP" in the subject line.',
    copyLabel: 'Copy',
    copiedLabel: 'Copied',
    footerBrand: 'DAWIT SERVICES — Digital & Administrative Assistance',
    topLabel: 'Top',
    privacyLink: 'Privacy Policy',
    termsLink: 'Terms of Service',
    refundLink: 'Refund Policy',
    adminLink: 'Admin',
  },
  ti: {
    nav: {
      home: 'መበገሲ',
      services: 'ኣገልግሎታት',
      howItWorks: 'ኣሰራርሓ',
      about: 'ብዛዕባ ዳዊት',
      faq: 'ሕቶታት',
      contact: 'ርከቡና',
    },
    langBannerBadge: '4 ቋንቋታት ይርከቡ',
    langBannerText:
      'እዚ መርበብ ሓበሬታ ብ4 ቋንቋታት (አማርኛ፣ English፣ ትግርኛ፣ Afaan Oromo) ይሰርሕ። መጀመርታ ብአማርኛ ተኸፊቱ ኣሎ፤ ዝደለኹምዎ ቋንቋ ይምረጡ።',
    heroBadge: 'ዳዊት ሰርቪስስ • ዲጂታላውን ምምሕዳራውን ሓገዝ',
    heroHeadline:
      'ቆጸራ ፓስፖርት፣ ናይ ኦንላይን መመልከቲ ወይ ናይ በረራ ትኬት ጉዳይ ኣሸጊሩኩም ዶ?',
    heroSubtext:
      'መመልከቲ ንምምላእ፣ ናይ ኦንላይን ሲስተም ንምጥቃም፣ መስርሕ ፓስፖርት ንምክትታል ወይ በረራ ንምድላው ሓገዝ ንዝደልዩ ሰባት ንጹርን ግብራውን ሓገዝ ንህብ።',
    requestBtn: 'ኣገልግሎት ሕተት',
    exploreBtn: 'ኣገልግሎታት ርአ',
    servicesHeading: 'ቀንዲ ሰለስተ ኣገልግሎታትና',
    servicesSubheading:
      'ስራሕና ኣብ ሰለስተ ነገራት ጥራይ ዘተኮረ እዩ፡ መመልከትን ዲጂታላዊ ሓገዝን፣ ቆጸራ ፓስፖርት ሓገዝ፣ ከምኡውን በረራን ትኬትን ሓገዝ።',
    services: [
      {
        key: 'application',
        title: 'ናይ መመልከቲን ዲጂታላዊን ሓገዝ',
        requestButtonLabel: 'ዲጂታላዊ ሓገዝ ሕተት',
        startingPriceEtb: null,
        prominent: true,
        description:
          'ናይ ሃገር ውሽጢ ይኹን ናይ ወጻኢ ናይ ኦንላይን መመልከቲ ንምምላእ፣ ንምዕራይ፣ ንምስዳድ ወይ ኣሰራርሑ ንምርዳእ ተጸጊምኩም? ኣብቲ መስርሕ ክንሕግዘኩም ንኽእል ኢና።',
        highlights: [
          'መመልከቲ ዩኒቨርሲቲ',
          'መመልከቲ ስኮላርሺፕ',
          'መመልከቲ ዓለምለኸ ትካላት',
          'ናይ ኢትዮጵያ ናይ ኦንላይን ሲስተማት',
          'ምስ መንግስቲ ዝተኣሳሰሩ ናይ ኦንላይን ኣገልግሎታት',
          'ናይ ኦንላይን ቅጥዕታት',
          'ናይ ኣካውንት ወይ መመልከቲ ጸገማት',
          'ሰነድ ምጽዓን (Document upload)',
          'ዝተመልአ መመልከቲ ምዕራይ',
          'መርበብ ሓበሬታን ሲስተምን ምጥቃም',
          'ምስዳድ ምስ ዘጸግም',
        ],
        disclaimer:
          'ዳዊት ሰርቪስስ መምርሕን ቴክኒካዊ/ምምሕዳራዊ ሓገዝን ይህብ። ቅኑዕ ሓበሬታን ሕጋዊ ሰነድን ምቕራብ ናይ ዓሚል ሓላፊነት እዩ።',
        feeNote:
          'ክፍሊት ሓገዝ ዳዊት ሰርቪስስ ብንጹር እንተዘይተገሊጹ ካብ ክፍሊት መመልከቲ፣ ፈተና፣ ዩኒቨርሲቲ ወይ ካልእ ሳልሳይ ወገን ፍሉይ እዩ።',
      },
      {
        key: 'passport',
        title: 'ናይ ቆጸራ ፓስፖርት ሓገዝ',
        requestButtonLabel: 'ናይ ፓስፖርት ሓገዝ ሕተት',
        startingPriceEtb: null,
        description:
          'መስርሕ መመልከቲ ወይ ቆጸራ ፓስፖርት ምስ ዘጸግመኩም፣ ኣብ ናይ ኦንላይን ስጉምቲታት፣ ምምላእ ቅጥዒ፣ ምውጻእ ቆጸራን ልሙዳት ጸገማትን ግብራዊ ሓገዝ ንህብ።',
        highlights: [
          'ናይ ኦንላይን መመልከቲ መምርሒ',
          'ናይ ቆጸራ ሓገዝ',
          'ቅጥዒ ንምምላእ ሓገዝ',
          'መስርሕ ብቀሊሉ ምርዳእ',
          'ኣብ ልሙዳት ጸገማት ሓገዝ',
        ],
        disclaimer:
          'ዳዊት ሰርቪስስ ኣብቲ መስርሕ ሓገዝ ይገብር። ምሃብ ፓስፖርትን ውሳነን ናይ ዝምልከቶ ኣካል መንግስቲ ሓላፊነት እዩ።',
        feeNote:
          'ክፍሊት ዳዊት ሰርቪስስ ካብ ክፍሊት ፓስፖርት መንግስትን ተዛመድቲ ኦፊሴላዊ ክፍሊታትን ፍሉይ እዩ።',
      },
      {
        key: 'flight',
        title: 'ናይ በረራን ትኬትን ሓገዝ',
        requestButtonLabel: 'ናይ በረራ ሓገዝ ሕተት',
        startingPriceEtb: null,
        description:
          'ናብ ካልእ ሃገር ወይ መዕለቢ ክትበሩ እንተደሊኹም፣ መዓስን ናበይን ክትከዱ ከም እትደልዩ ንገሩና፤ ዝሰማማዕ ናይ በረራ ኣማራጺታት ንምርኣይን መስርሕ ቦኪንግ ንምክትታልን ክንሕግዘኩም ንኽእል ኢና።',
        highlights: [
          'በረራ ምድላይ ሓገዝ',
          'ኣማራጺታት ምንጽጻር',
          'መበገስን መዕለብን መምርሒ',
          'ዕለት ጉዕዞ ምምችቻው',
          'ስጉምቲ ቦኪንግ ሓገዝ',
        ],
        disclaimer:
          'ዋጋ ትኬት ነፋሪትን ካልኦት ክፍሊታትን ብንጹር እንተዘይተባሂሉ ካብ ክፍሊት ሓገዝ ዳዊት ሰርቪስስ ፍሉይ እዩ።',
        feeNote:
          'ዳዊት ሰርቪስስ ብንጹር እንተዘይተገሊጹ መገዲ ኣየር ወይ ፍቓድ ዘለዎ ወኪል ጉዕዞ ኣይኮነን።',
      },
    ],
    howItWorksHeading: 'ኣገልግሎቱ ከመይ ይሰርሕ',
    howItWorksSubheading: 'ነፍሲ ወከፍ ሕቶ ካብ መጀመርታ ክሳብ ስምምዕን ኣገልግሎትን ሽዱሽተ ንጹራት ስጉምቲታት ይሓልፍ።',
    howItWorksSteps: [
      {
        step: '01',
        title: 'ዝደለኹምዎ ንገሩና',
        detail: 'ብመርበብ ሓበሬታ ኣቢልኩም ሕቶ ኣገልግሎት ኣእትዉ።',
      },
      {
        step: '02',
        title: 'ሕቶኹም ንምርምር',
        detail: 'ኩነታትኩም ርኢና እንታይ ዓይነት ሓገዝ ከም ዘድሊ ንውስን።',
      },
      {
        step: '03',
        title: 'ንዘራረብን ንሰማማዕን',
        detail: 'ተዘራሪብና ወሰን ስራሕ፣ ሓላፊነት ክልቴና፣ ዋጋን ዝወስዶ ግዜን ንሰማማዕ።',
      },
      {
        step: '04',
        title: 'ናይ 200 ብር ዲፖዚት ይኽፈሉ',
        detail: 'ድሕሪ መጀመርታ ዘተን ንምቕጻል ምስ ተሰማማዕና፣ ዓሚል ናይ 200 ብር ዲፖዚት ኣገልግሎት ይኸፍል።',
      },
      {
        step: '05',
        title: 'ዲፖዚት ካብ ዋጋ ይቕነስ',
        detail: 'ዓሚል ብስምምዕ እንተቐጺሉ፣ ዝተኸፍለ 200 ብር ካብ ጠቕላላ ክፍሊት ኣገልግሎት ይቕነስ።',
      },
      {
        step: '06',
        title: 'ዝተሰማማዕናሉ ስራሕ ንሰርሕ',
        detail: 'ዝተሰማማዕናሉ ሓገዝ ጀሚርና ኣድላዪ እንተኾይኑ ምስ ዓሚል ንራኸብ።',
      },
    ],
    depositBadge: 'ሕጊ ዲፖዚት',
    depositHeading: 'ናይ 200 ብር ናይ ኣገልግሎት ዲፖዚት',
    depositParagraphs: [
      'ኣገልግሎት ምሃብ ቅድሚ ምጅማርና፣ ድሕሪ መጀመርታ ዘተን ንምቕጻል ምስ ተሰማማዕና ናይ 200 ብር ዲፖዚት ኣገልግሎት የድሊ።',
      'ብተሰማማዕናሉ ኣገልግሎት እንተቐጺልኩም፣ ናይ 200 ብር ዲፖዚት ካብ ጠቕላላ ክፍሊት ኣገልግሎት ተቐንሱ ይሕሰብ።',
      'ኣብ መጀመርታ ድርድር ስምምዕ እንተዘይበጺሕና፣ ናይ 200 ብር ዲፖዚት ይምለስ።',
    ],
    depositHighlight:
      'ስለዚ እዚ 200 ብር ተወሳኺ ክፍሊት ኣይኮነን፤ ዓሚል ምስ ዝቕጽል ካብ ዝተሰማማዕናሉ ክፍሊት ኣገልግሎት ዝሕሰብ እዩ።',
    depositFlowLabel:
      'ቅደም ተከተል፡ ሕቶ ምእታው → መጀመርታ ዘተ → ኣብ ኣገልግሎትን ዋጋን ምስምማዕ → 200 ብር ዲፖዚት → ስራሕ ይጅምር',
    pricingHeading: 'ግልጽ ኣከፋፍላ ዋጋ',
    pricingSubheading:
      'ክፍሊት ኣገልግሎት ከከም ዓይነትን ጽንኩርነትን ሕቶ ይፈላለ እዩ። ስራሕ ቅድሚ ምጅማሩ ወሰን ስራሕን ዋጋን ተዘራሪብና ንሰማማዕ።',
    depositCardTitle: '200 ብር ናይ ኣገልግሎት ዲፖዚት',
    depositCardText: 'ዓሚል ብስምምዕ እንተቐጺሉ ካብ ናይ መወዳእታ ክፍሊት ኣገልግሎት ይቕነስ።',
    agreedAfterReviewLabel: 'ድሕሪ ዘተ ብስምምዕ',
    startingFromLabel: 'ካብ ___ ብር ጀሚሩ',
    thirdPartyCardTitle: 'ክፍሊት ኣገልግሎትን ክፍሊታት ሳልሳይ ወገንን',
    thirdPartyServiceFeeText:
      'ክፍሊት ዳዊት ሰርቪስስ ስራሕ ቅድሚ ምጅማሩ ንዝተሰማማዕናሉ ግዜ ሓገዝን መምርሕን እዩ።',
    thirdPartyOtherFeesText:
      'ክፍሊታት መንግስቲ፣ ዩኒቨርሲቲ፣ መገዲ ኣየር ወይ ካልእ ሳልሳይ ወገን ብንጹር እንተዘይተገሊጹ ፍሉይ እዮም።',
    formHeading: 'ኣገልግሎት ሕተት',
    formSubheading:
      'ሓበሬታኹም ኣእትዉ እሞ ዝደለኹምዎ ኣገልግሎት ምረጹ። ሕቶኹም ርኢና ንመጀመርታ ዘተ ክንረኽበኩም ኢና።',
    formModalNote: 'መጀመርታ ዘተ ቅድሚ ዝኾነ ናይ 200 ብር ዲፖዚት እዩ።',
    aboutBadge: 'ዳዊት ይፍለጡ',
    aboutHeading: 'ዳዊት ተስፋይ',
    aboutRole:
      'ተምሃራይ ቀዳማይ ዲግሪ BSc ኮምፒውተር ሳይንስን BA ማኔጅመንትን | ልዕሊ 3 ዓመት ላዕለዋይ እንግሊዝኛ ምምሃር ተመኩሮ',
    aboutBio:
      'ዳዊት ተስፋይ ሕጂ ተምሃራይ ቀዳማይ ዲግሪ BSc ኮምፒውተር ሳይንስን BA ማኔጅመንትን ኮይኑ፣ ልዕሊ 3 ዓመት ላዕለዋይ እንግሊዝኛ ናይ ምምሃር ተመኩሮ ኣለዎ። ኣብ ናይ ኦንላይን መመልከቲታት፣ ዲጂታላዊ ቅጥዕታትን ምምሕዳራዊ ስጉምቲታትን ንጹርን ግብራውን ሓገዝ ይህብ።',
    trustHeading: 'ስለምንታይ ዳዊት ሰርቪስስ?',
    trustPillars: [
      {
        title: 'ንጹር ርክብ',
        description: 'ስራሕ ቅድሚ ምጅማሩ ኣሰራርሓን ዘድልዩ ነገራትን ብንጹር ነረድእ።',
      },
      {
        title: 'ግልጽ ዋጋ',
        description: 'ኣገልግሎት ቅድሚ ምጅማሩ ዓሚል ዝተሰማማዕናሉ ክፍሊት ይፈልጥ።',
      },
      {
        title: 'ቀጥታ ሓገዝ',
        description: 'ዓማዊል ብቀጥታ ምስ ዳዊት ሰርቪስስ ይዘራረቡ።',
      },
      {
        title: 'ግብራዊ ሓገዝ',
        description: 'ዘሸግሩ ዝመስሉ ዲጂታላውን ምምሕዳራውን መስርሓት ብቀሊሉ ንኽትሓልፉ ንሕግዝ።',
      },
    ],
    disclaimerHeading: 'ኣገዳሲ መጠንቀቕታ',
    disclaimerParagraphs: [
      'ዳዊት ሰርቪስስ ዲጂታላዊ፣ ምምሕዳራውን ሓበሬታውን ሓገዝ ይህብ። ብኣካላት መንግስቲ፣ ዩኒቨርሲቲታት፣ ኤምባሲታት፣ መገዲ ኣየር፣ ኢሚግሬሽን ወይ ካልኦት ሳልሳይ ወገናት ዝወሃቡ ውሳኔታት ኣይንቆጻጸርን ኢና።',
      'ምውጻእ ፓስፖርት፣ ኣታዊ ዩኒቨርሲቲ፣ ዕድል ስኮላርሺፕ፣ ምጽዳቕ ቪዛ፣ ምርካብ ቦታ በረራ ወይ ካልኦት ውሳኔታት ሳልሳይ ወገን ውሕስነት ኣይንህብን ኢና።',
      'ቅኑዕ ሓበሬታን ሕጋዊ ሰነድን ምቕራብ ናይ ዓሚል ሓላፊነት እዩ።',
    ],
    faqHeading: 'ብተደጋጋሚ ዝሕተቱ ሕቶታት',
    faqItems: [
      {
        question: 'ዳዊት መን እዩ?',
        answer:
          'ዳዊት ተስፋይ ሕጂ ተምሃራይ ቀዳማይ ዲግሪ BSc ኮምፒውተር ሳይንስን BA ማኔጅመንትን ኮይኑ፣ ልዕሊ 3 ዓመት ላዕለዋይ እንግሊዝኛ ናይ ምምሃርን ሰባት ኣብ ናይ ኦንላይን ቅጥዕታት፣ ሲስተማትን ምምሕዳራዊ ስጉምቲታትን ናይ ምሕጋዝን ተመኩሮ ኣለዎ።',
      },
      {
        question: 'እንታይ ዓይነት ኣገልግሎታት ትህቡ?',
        answer:
          'ናይ ቆጸራ ፓስፖርት ሓገዝ፣ ናይ መመልከቲን ዲጂታላዊን ሓገዝ፣ ከምኡውን ናይ በረራን ትኬትን ሓገዝ ንህብ።',
      },
      {
        question: 'ብዛዕባ ሕቶይ ቅድሚ ምዝርራብና 200 ብር ክኸፍል ኣለኒ ዶ?',
        answer:
          'ኣይፋልን። መጀመርታ ሕቶ ቀሪቡ ንዘራረብ። ናይ 200 ብር ዲፖዚት ዝኽፈል ብዛዕባ ኣገልግሎትን ዋጋን ተዘራሪብና ንምቕጻል ምስ ተሰማማዕና እዩ።',
      },
      {
        question: '200 ብር ተወሳኺ ክፍሊት ድዩ?',
        answer: 'ኣይኮነን። ብተሰማማዕናሉ ኣገልግሎት እንተቐጺልኩም፣ ካብ ጠቕላላ ክፍሊት ኣገልግሎት ይቕነስ።',
      },
      {
        question: '200 ብር መዓስ ይምለስ?',
        answer: 'ኣብ መጀመርታ ድርድር ስምምዕ እንተዘይበጺሕና ይምለስ።',
      },
      {
        question: 'ዳዊት ሰርቪስስ ምጽዳቕ ቪዛ ወይ ኣታዊ ዩኒቨርሲቲ ውሕስነት ይህብ ዶ?',
        answer:
          'ኣይህብን። ዳዊት ሰርቪስስ ሓገዝን መምርሕን ይህብ፤ ናይ መወዳእታ ውሳኔ ናይ ዝምልከቶም ትካላትን ኣካላትን እዩ።',
      },
      {
        question: 'ክፍሊታት መንግስቲ፣ ዩኒቨርሲቲ፣ መገዲ ኣየር ወይ ካልኦት ኣብ ውሽጡ ድዮም?',
        answer:
          'ብንጹር እንተዘይተባሂሉ ኣብ ውሽጡ ኣይኮኑን። ካብ ክፍሊት ሓገዝ ዳዊት ሰርቪስስ ፍሉይ እዮም።',
      },
      {
        question: 'ንናይ ወጻኢ ሃገር መመልከቲታት ክትሕግዙ ትኽእሉ ዶ?',
        answer:
          'እወ፣ መመልከቲ ኣብ ምርዳእ፣ ምምላእ፣ ምዕራይ ወይ ምስዳድ ሕጋዊ ሓገዝ ኣብ ዘድልየሉ እዋን ንሕግዝ። ቅኑዕነት ሓበሬታን ሰነድን ናይ ዓሚል ሓላፊነት እዩ።',
      },
    ],
    contactHeading: 'ዳዊት ሰርቪስስ ርከቡ',
    contactSubheading: 'ንልሙዳት ሕቶታት ብቀጥታ ርከቡና ወይ ብመርበብ ሓበሬታ ሕቶ ኣገልግሎት ኣእትዉ።',
    phoneLabel: 'ስልኪ',
    telegramLabel: 'ቴሌግራም',
    standardEmailLabel: 'ልሙድ ኢሜይል',
    vipTitle: 'ንህጹጽ (Emergency) ወይ ንVIP / ፕሪሚየም ኣገልግሎት ኢሜይል',
    vipTextPrefix: 'ህጹጽ ጉዳይ እንተሃልዩኩም ወይ ናይ VIP / ፕሪሚየም ኣገልግሎት እንተደሊኹም በዚ ኢሜይል ስደዱ፡ ',
    vipTextSuffix: '።',
    vipNote:
      'መጠንቀቕታ (N.B.)፡ እዚ ኢሜይል ንህጹጽ (Emergency)ን ንVIPን ሕቶታት ጥራይ እዩ። ንልሙድ ኣገልግሎት በዚ ኢሜይል ዝስደድ መልሲ ኣይወሃቦን፤ ከምኡውን ንEmergency ወይ VIP ክትሰድዱ እንከለኹም ኣብ Subject "Emergency" ወይ "VIP" ኢልኩም ክትጽሕፉ ኣለኩም።',
    copyLabel: 'ቅዳሕ',
    copiedLabel: 'ተቐዲሑ',
    footerBrand: 'ዳዊት ሰርቪስስ — ዲጂታላውን ምምሕዳራውን ሓገዝ',
    topLabel: 'ናብ ላዕሊ',
    privacyLink: 'ፖሊሲ ብሕትውና',
    termsLink: 'ውዕል ኣገልግሎት',
    refundLink: 'ፖሊሲ ምምላስ ገንዘብ',
    adminLink: 'ኣድሚን',
  },
  om: {
    nav: {
      home: 'Mana',
      services: 'Tajaajiloota',
      howItWorks: 'Akkaataa Hojii',
      about: 'Waa’ee Daawit',
      faq: 'Gaaffiiwwan',
      contact: 'Nu Quunnamaa',
    },
    langBannerBadge: 'Afaan 4 Ni Argama',
    langBannerText:
      'Marsariitiin kun afaan 4n (አማርኛ፣ English፣ ትግርኛ፣ Afaan Oromo) ni hojjeta. Jalqaba Amharic dhaan banameera; afaan feetan filadhaa.',
    heroBadge: 'DAWIT SERVICES • Deeggarsa Dijitaalaa fi Bulchiinsaa',
    heroHeadline:
      'Adeemsa paaspoortii, iyyannoo toora interneetii yookaan qophii tikkeetii balalii irratti gargaarsa barbaadduu?',
    heroSubtext:
      'Namoota waltajjii dijitaalaa fayyadamuu, iyyannoo guutuu, adeemsa paaspoortii hordofuu yookaan balalii qindeessuu irratti gargaarsa barbaadaniif deeggarsa ifaa fi qabatamaa ni kennina.',
    requestBtn: 'Tajaajila Gaafadhu',
    exploreBtn: 'Tajaajiloota Ilaali',
    servicesHeading: 'Tajaajiloota Ijoo Sadii',
    servicesSubheading:
      'Hojiin keenya tajaajila sadii irratti qofa xiyyeeffata: deeggarsa iyyannoo fi dijitaalaa, deeggarsa bellama paaspoortii, fi deeggarsa balalii.',
    services: [
      {
        key: 'application',
        title: 'Deeggarsa Iyyannoo fi Dijitaalaa',
        requestButtonLabel: 'Deeggarsa Dijitaalaa Gaafadhu',
        startingPriceEtb: null,
        prominent: true,
        description:
          'Iyyannoo toora interneetii kan biyya keessaa yookaan idil-addunyaa guutuu, sirreessuu, erguu yookaan hubachuun isin rakkiseeraa? Adeemsa isaa akka keessa darbattan isin gargaarra.',
        highlights: [
          'Iyyannoo yuunivarsiitii',
          'Iyyannoo iskoolaarshiippii',
          'Iyyannoo dhaabbilee idil-addunyaa',
          'Waltajjiiwwan toora interneetii Itoophiyaa',
          'Tajaajila toora interneetii mootummaa wajjin walqabatu',
          'Unkaalee toora interneetii',
          'Rakkoo herrega yookaan iyyannoo',
          'Sanada ol-fe’uu (Document upload)',
          'Iyyannoo guutame sirreessuu',
          'Marsariitii fi sirna fayyadamuu',
          'Rakkoo yeroo galchuu',
        ],
        disclaimer:
          'Dawit Services qajeelfamaa fi deeggarsa teeknikaa/bulchiinsaa kenna. Odeeffannoo sirrii fi sanada dhugaa dhiyeessuun itti gaafatamummaa maamilaa ti.',
        feeNote:
          'Kaffaltiin deeggarsa Dawit Services yoo ifatti ibsame malee kaffaltii iyyannoo, qormaataa, yuunivarsiitii yookaan qaama sadaffaa irraa adda dha.',
      },
      {
        key: 'passport',
        title: 'Deeggarsa Bellama Paaspoortii',
        requestButtonLabel: 'Deeggarsa Paaspoortii Gaafadhu',
        startingPriceEtb: null,
        description:
          'Adeemsa iyyannoo yookaan bellama paaspoortii irratti gargaarsa yoo barbaaddan, tarkaanfii toora interneetii, guuchisa unkaa, bellama qabachuu fi rakkoolee yeroo baay’ee mudatan irratti deeggarsa qabatamaa ni kennina.',
        highlights: [
          'Qajeelfama iyyannoo toora interneetii',
          'Deeggarsa bellamaa',
          'Deeggarsa unkaa guuchisuu',
          'Adeemsa salphaatti hubachuu',
          'Rakkoolee baramaa irratti gargaarsa',
        ],
        disclaimer:
          'Dawit Services adeemsa irratti gargaarsa kenna. Kenniinsi paaspoortii fi murteen itti gaafatamummaa qaama mootummaa dhimmi ilaallatuu ti.',
        feeNote:
          'Kaffaltiin Dawit Services kaffaltii paaspoortii mootummaa fi kaffaltiiwwan ofiisaa biroo irraa adda dha.',
      },
      {
        key: 'flight',
        title: 'Deeggarsa Balalii fi Tikkeetii',
        requestButtonLabel: 'Deeggarsa Balalii Gaafadhu',
        startingPriceEtb: null,
        description:
          'Biyya biraa yookaan bakka birootti balali’uu yoo barbaaddan, yoomii fi eessatti deemuu akka feetan nutti himaa; filannoowwan balalii mijatoo adda baasuu fi adeemsa buukii keessa darbuuf isin gargaarra.',
        highlights: [
          'Deeggarsa balalii barbaaduu',
          'Filannoowwan wal bira qabuu',
          'Qajeelfama ka’umsaa fi bakka gahumsaa',
          'Guyyaa imalaa mijeessuu',
          'Deeggarsa tarkaanfii buukii',
        ],
        disclaimer:
          'Gatiin tikkeetii xiyyaaraa fi kaffaltiin qaama sadaffaa yoo ifatti ibsame malee kaffaltii deeggarsa Dawit Services irraa adda dha.',
        feeNote:
          'Dawit Services yoo ifatti ibsame malee dhaabbata xiyyaaraa yookaan ejensii imalaa eeyyama qabu miti.',
      },
    ],
    howItWorksHeading: 'Akkamitti Akka Hojjetu',
    howItWorksSubheading: 'Gaaffiin hundi gaaffii jalqabaa kaasee hanga walii galtee fi tajaajilaatti tarkaanfii ja’a hordofa.',
    howItWorksSteps: [
      {
        step: '01',
        title: 'Waan barbaaddan nutti himaa',
        detail: 'Marsariitii irratti gaaffii tajaajilaa galchaa.',
      },
      {
        step: '02',
        title: 'Gaaffii keessan ni ilaalla',
        detail: 'Haala keessan ilaaluun deeggarsa akkamii akka barbaachisu murteessina.',
      },
      {
        step: '03',
        title: 'Ni mari’anna, ni walii gallus',
        detail: 'Walitti dubbannee hanga hojii, itti gaafatamummaa, gatii fi yeroo eegamu irratti walii gallu.',
      },
      {
        step: '04',
        title: 'Qabattoo Birrii 200 kaffalaa',
        detail: 'Marii jalqabaa fi itti fufuuf walii galtee booda, maamilli qabattoo tajaajilaa Birrii 200 kaffala.',
      },
      {
        step: '05',
        title: 'Qabattoon gatii irraa ni hir’ifama',
        detail: 'Maamilli walii galteen yoo itti fufe, qabattoon Birrii 200 kaffaltii tajaajilaa waliigalaa irraa ni hir’ifama.',
      },
      {
        step: '06',
        title: 'Tajaajila walii gale ni kennina',
        detail: 'Hojii walii gale eegalee yeroo barbaachisutti maamilaa wajjin ni qunnamna.',
      },
    ],
    depositBadge: 'Imaammata Qabattoo',
    depositHeading: 'Qabattoo Tajaajilaa Birrii 200',
    depositParagraphs: [
      'Tajaajila kennuu jalqabuu keenya dura, marii jalqabaa fi itti fufuuf walii galtee booda qabattoon tajaajilaa Birrii 200 ni barbaachisa.',
      'Tajaajila walii galeen yoo itti fuftan, qabattoon Birrii 200 kaffaltii tajaajilaa waliigalaa irraa hir’ifamee shallagama.',
      'Marii jalqabaa irratti walii galtee irra hin geenye yoo ta’e, qabattoon Birrii 200 ni deebifama.',
    ],
    depositHighlight:
      'Kanaafuu qabattoon kun kaffaltii dabalataa miti; yeroo maamilli itti fufu kaffaltii tajaajilaa walii gale keessatti kan hammatamu dha.',
    depositFlowLabel:
      'Tartii: Gaaffii galchuu → Marii jalqabaa → Tajaajilaa fi gatiirratti walii galuu → Qabattoo Birrii 200 → Hojiin ni jalqaba',
    pricingHeading: 'Gatii Ifa Ta’e',
    pricingSubheading:
      'Kaffaltiin tajaajilaa gosa fi ulfaatina gaaffii irratti hundaa’a. Hojiin jalqabuu dura hanga hojii fi gatii irratti mari’annee walii gallu.',
    depositCardTitle: 'Qabattoo Tajaajilaa Birrii 200',
    depositCardText: 'Yeroo maamilli itti fufu kaffaltii tajaajilaa dhumaa irraa ni hir’ifama.',
    agreedAfterReviewLabel: 'Marii booda walii galteen',
    startingFromLabel: 'Kan jalqabu Birrii',
    thirdPartyCardTitle: 'Kaffaltii Tajaajilaa fi Kaffaltii Qaama Sadaffaa',
    thirdPartyServiceFeeText:
      'Kaffaltiin Dawit Services yeroo hojiin jalqabuu dura walii galameef deeggarsaa fi qajeelfama kennamuuf kan oolu dha.',
    thirdPartyOtherFeesText:
      'Kaffaltiin mootummaa, yuunivarsiitii, xiyyaaraa yookaan qaama sadaffaa yoo ifatti ibsame malee adda dha.',
    formHeading: 'Tajaajila Gaafadhu',
    formSubheading:
      'Odeeffannoo keessan galchaatii tajaajila barbaaddan filadhaa. Gaaffii keessan ilaaluun marii jalqabaaf isin qunnamna.',
    formModalNote: 'Mariin jalqabaa qabattoo Birrii 200 kamiyyuu dura dhufa.',
    aboutBadge: 'Daawit Baradhu',
    aboutHeading: 'Daawit Tasfaay',
    aboutRole:
      'Barataa Digrii Jalqabaa BSc Computer Science fi BA Management | Muuxannoo Waggaa 3 Ol Afaan Ingilizii Sadarkaa Olaanaa Barsiisuu',
    aboutBio:
      'Daawit Tasfaay yeroo ammaa barataa digrii jalqabaa BSc Computer Science fi BA Management yoo ta’u, muuxannoo waggaa 3 ol afaan Ingilizii sadarkaa olaanaa barsiisuu qaba. Iyyannoo toora interneetii, waltajjii dijitaalaa fi adeemsa bulchiinsaa irratti gargaarsa ifaa fi qabatamaa kenna.',
    trustHeading: 'Maaliif Dawit Services?',
    trustPillars: [
      {
        title: 'Walqunnamtii Ifa Ta’e',
        description: 'Hojiin jalqabuu dura adeemsaa fi waantota barbaachisan ifatti ibsina.',
      },
      {
        title: 'Gatii Ifa Ta’e',
        description: 'Tajaajilli jalqabuu dura maamilli kaffaltii tajaajilaa walii gale ni beeka.',
      },
      {
        title: 'Deeggarsa Dhuunfaa',
        description: 'Maamilonni kallattiin Dawit Services wajjin ni mari’atu.',
      },
      {
        title: 'Deeggarsa Qabatamaa',
        description: 'Adeemsa dijitaalaa fi bulchiinsaa rakkisaa fakkaatu akka keessa darbatan ni gargaarra.',
      },
    ],
    disclaimerHeading: 'Akeekkachiisa Barbaachisaa',
    disclaimerParagraphs: [
      'Dawit Services deeggarsa dijitaalaa, bulchiinsaa fi odeeffannoo kenna. Murtee qaamolee mootummaa, yuunivarsiitiiwwanii, embaasiiwwanii, dhaabbilee xiyyaaraa, imigireeshinii yookaan qaamolee sadaffaa biroo hin to’annu.',
      'Ba’uu paaspoortii, galmee yuunivarsiitii, carraa iskoolaarshiippii, hayyamamuu viizaa, argamuu bakka balalii yookaan murtee qaama sadaffaa biroo wabii hin kenninu.',
      'Odeeffannoo sirrii fi sanada dhugaa dhiyeessuun itti gaafatamummaa maamilaa ti.',
    ],
    faqHeading: 'Gaaffiiwwan Yeroo Baay’ee Gaafataman',
    faqItems: [
      {
        question: 'Daawit eenyu?',
        answer:
          'Daawit Tasfaay yeroo ammaa barataa digrii jalqabaa BSc Computer Science fi BA Management yoo ta’u, muuxannoo waggaa 3 ol afaan Ingilizii sadarkaa olaanaa barsiisuu fi namoota unkaa toora interneetii, sirna dijitaalaa fi adeemsa bulchiinsaa irratti gargaaruu qaba.',
      },
      {
        question: 'Tajaajila akkamii kennitu?',
        answer:
          'Deeggarsa bellama paaspoortii, deeggarsa iyyannoo fi dijitaalaa, akkasumas deeggarsa balalii fi tikkeetii ni kennina.',
      },
      {
        question: 'Gaaffii koo irratti mari’achuu keenya dura Birrii 200 kaffaluun qabaa?',
        answer:
          'Lakki. Jalqaba gaaffiin dhiyaatee ni mari’anna. Qabattoon Birrii 200 kan kaffalamu waa’ee tajaajilaa fi gatii irratti mari’annee itti fufuuf erga walii galle booda dha.',
      },
      {
        question: 'Birrii 200 kaffaltii dabalataa dhaa?',
        answer: 'Miti. Tajaajila walii galeen yoo itti fuftan, kaffaltii tajaajilaa waliigalaa irraa ni hir’ifama.',
      },
      {
        question: 'Birrii 200 yoom deebifama?',
        answer: 'Marii jalqabaa irratti walii galtee irra hin geenye yoo ta’e ni deebifama.',
      },
      {
        question: 'Dawit Services hayyamamuu viizaa yookaan galmee yuunivarsiitii wabii kennaa?',
        answer:
          'Hin kennu. Dawit Services deeggarsaa fi qajeelfama kenna; murteen dhumaa kan dhaabbilee fi qaamolee dhimmi ilaallatuu ti.',
      },
      {
        question: 'Kaffaltiin mootummaa, yuunivarsiitii, xiyyaaraa yookaan kanneen biroo keessa jiruu?',
        answer: 'Yoo ifatti ibsame malee keessa hin jiran. Kaffaltii deeggarsa Dawit Services irraa adda dha.',
      },
      {
        question: 'Iyyannoo biyya alaa irratti gargaaruu ni dandeessuu?',
        answer:
          'Eeyyee, iyyannoo hubachuu, guutuu, sirreessuu yookaan erguu irratti deeggarsi seera qabeessa barbaachisaa yoo ta’e ni gargaarra. Dhugummaa odeeffannoo fi sanadaa irratti itti gaafatamummaan kan maamilaa ti.',
      },
    ],
    contactHeading: 'Dawit Services Quunnamaa',
    contactSubheading: 'Gaaffii idileef kallattiin nu quunnamaa yookaan marsariitii irratti gaaffii tajaajilaa galchaa.',
    phoneLabel: 'Bilbila',
    telegramLabel: 'Telegraamii',
    standardEmailLabel: 'Imeeyilii Idilee',
    vipTitle: 'Imeeyilii Dhimmoota Hatattamaa (Emergency) yookaan VIP / Priimiyamii',
    vipTextPrefix: 'Dhimmoota hatattamaa yoo qabaattan yookaan tajaajila VIP / priimiyamii yoo barbaaddan imeeyilii kanaaf ergaa: ',
    vipTextSuffix: '.',
    vipNote:
      'Hubachiisa (N.B.): Imeeyiliin kun gaaffii Emergency fi VIP qofaaf. Gaaffii tajaajila idileef imeeyilii kanaan deebiin hin kennamu; akkasumas Emergency yookaan VIP dhaaf yeroo ergitan Subject irratti "Emergency" yookaan "VIP" jechuu qabdu.',
    copyLabel: 'Garagalchi',
    copiedLabel: 'Garagalffameera',
    footerBrand: 'DAWIT SERVICES — Deeggarsa Dijitaalaa fi Bulchiinsaa',
    topLabel: 'Gara Oliitti',
    privacyLink: 'Imaammata Dhuunfaa',
    termsLink: 'Waliigaltee Tajaajilaa',
    refundLink: 'Imaammata Deebii Maallaqaa',
    adminLink: 'Admin',
  },
};

export const HOW_IT_WORKS_STEPS = SITE_CONTENT.en.howItWorksSteps;
export const TRUST_PILLARS = SITE_CONTENT.en.trustPillars;
export const FAQ_ITEMS = SITE_CONTENT.en.faqItems;
export const SERVICES = SITE_CONTENT.en.services;