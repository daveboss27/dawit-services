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

export const UI_COPY: Record<
  LangKey,
  {
    langBannerBadge: string;
    langBannerText: string;
    heroHeadline: string;
    heroSubtext: string;
    requestBtn: string;
    exploreBtn: string;
    servicesHeading: string;
    howItWorksHeading: string;
    depositHeading: string;
    pricingHeading: string;
    formHeading: string;
    aboutHeading: string;
    aboutRole: string;
    aboutBio: string;
    trustHeading: string;
    disclaimerHeading: string;
    faqHeading: string;
    contactHeading: string;
  }
> = {
  am: {
    langBannerBadge: '4 ቋንቋዎች ይገኛሉ • 4 Languages Available',
    langBannerText:
      'ይህ ድረ-ገጽ በ4 ቋንቋዎች (አማርኛ፣ English፣ ትግርኛ፣ Afaan Oromo) ይገኛል። የመነሻ ቋንቋ አማርኛ ነው፤ የሚፈልጉትን ቋንቋ ይምረጡ።',
    heroHeadline:
      'የፓስፖርት ሂደትን፣ የኦንላይን ማመልከቻን ወይም የበረራ ትኬት ዝግጅትን ለመከታተል እገዛ ያስፈልግዎታል?',
    heroSubtext:
      'ዲጂታል መድረኮችን ለመጠቀም፣ ማመልከቻዎችን ለመሙላት፣ የፓስፖርት ሂደቶችን ለመከታተል ወይም በረራዎችን ለማመቻቸት እገዛ ለሚያስፈልጋቸው ግለሰቦች ተግባራዊ ድጋፍ እንሰጣለን።',
    requestBtn: 'አገልግሎት ይጠይቁ',
    exploreBtn: 'አገልግሎቶችን ይመልከቱ',
    servicesHeading: 'ዋና አገልግሎቶች (3 ብቻ)',
    howItWorksHeading: 'አገልግሎቱ እንዴት ይሰራል',
    depositHeading: 'የ200 ብር የአገልግሎት ተቀማጭ (Deposit)',
    pricingHeading: 'ግልጽ የዋጋ አሰጣጥ',
    formHeading: 'አገልግሎት ይጠይቁ',
    aboutHeading: 'ዳዊትን ይወቁ',
    aboutRole:
      'የBSc ኮምፒውተር ሳይንስ እና የBA ማኔጅመንት የመጀመሪያ ዲግሪ ተማሪ | ከ3 ዓመት በላይ የላቀ እንግሊዝኛ ማስተማር ልምድ',
    aboutBio:
      'ዳዊት ተስፋይ በአሁኑ ወቅት በኮምፒውተር ሳይንስ (BSc) እና በማኔጅመንት (BA) የመጀመሪያ ዲግሪ ተማሪ ሲሆን ከ3 ዓመት በላይ የላቀ እንግሊዝኛ የማስተማር ልምድ አለው። በዲጂታል ቅጾች፣ በኦንላይን መድረኮች እና በአስተዳደራዊ እርምጃዎች ግልጽ እና ተግባራዊ እገዛ ይሰጣል።',
    trustHeading: 'ለምን ዳዊት ሰርቪስስ?',
    disclaimerHeading: 'ጠቃሚ ማሳሰቢያ',
    faqHeading: 'በተደጋጋሚ የሚጠየቁ ጥያቄዎች',
    contactHeading: 'ዳዊት ሰርቪስስን ያግኙ',
  },
  en: {
    langBannerBadge: '4 Languages Available • 4 ቋንቋዎች ይገኛሉ',
    langBannerText:
      'This website supports 4 languages (Amharic, English, Tigrigna, Afaan Oromo). Amharic is selected first by default—pick any language you prefer.',
    heroHeadline:
      'Need help navigating a passport process, online application, or flight booking?',
    heroSubtext:
      'We provide practical assistance to individuals who need help using digital platforms, completing applications, navigating passport processes, or arranging flights.',
    requestBtn: 'Request a Service',
    exploreBtn: 'Explore Services',
    servicesHeading: 'Core Services',
    howItWorksHeading: 'How It Works',
    depositHeading: '200 ETB Service Deposit',
    pricingHeading: 'Transparent Pricing',
    formHeading: 'Request a Service',
    aboutHeading: 'Meet Dawit',
    aboutRole:
      'Undergraduate Student in BSc Computer Science & BA Management | 3+ Years Teaching Advanced English',
    aboutBio:
      'Dawit Tesfay is currently an undergraduate student pursuing a BSc in Computer Science and a BA in Management, with over 3 years of experience teaching advanced English. He provides practical guidance with online applications, digital platforms, and administrative steps.',
    trustHeading: 'Why Dawit Services?',
    disclaimerHeading: 'Important Disclaimer',
    faqHeading: 'Frequently Asked Questions',
    contactHeading: 'Contact Dawit Services',
  },
  ti: {
    langBannerBadge: '4 ቋንቋታት ይርከቡ • 4 Languages Available',
    langBannerText:
      'እዚ መርበብ ሓበሬታ ብ4 ቋንቋታት (አማርኛ፣ English፣ ትግርኛ፣ Afaan Oromo) ይርከብ። ናይ መጀመርታ ቋንቋ አማርኛ እዩ፤ ዝደለኹምዎ ቋንቋ ይምረጡ።',
    heroHeadline:
      'መስርሕ ፓስፖርት፣ ናይ ኦንላይን መመልከቲ ወይም ምትሕላል በረራ ንምምራሕ ሓገዝ የድልየኩም ድዩ?',
    heroSubtext:
      'ዲጂታላዊ መድረኻት ንምጥቃም፣ መመልከቲታት ንምምላእ፣ መስርሓት ፓስፖርት ንምክትታል ወይም በረራታት ንምድላው ሓገዝ ንዝደልዩ ውልቀሰባት ግብራዊ ሓገዝ ንህብ።',
    requestBtn: 'ኣገልግሎት ሕተት',
    exploreBtn: 'ኣገልግሎታት ርአ',
    servicesHeading: 'ቀንዲ ኣገልግሎታት',
    howItWorksHeading: 'ከመይ ይሰርሕ',
    depositHeading: 'ናይ 200 ብር ናይ ኣገልግሎት ዲፖዚት',
    pricingHeading: 'ግልጽ ኣከፋፍላ ዋጋ',
    formHeading: 'ኣገልግሎት ሕተት',
    aboutHeading: 'ዳዊት ይፍለጡ',
    aboutRole:
      'ተምሃራይ ቀዳማይ ዲግሪ BSc ኮምፒውተር ሳይንስን BA ማኔጅመንትን | ልዕሊ 3 ዓመት ላዕለዋይ እንግሊዝኛ ምምሃር ተመኩሮ',
    aboutBio:
      'ዳዊት ተስፋይ ሕጂ ተምሃራይ ቀዳማይ ዲግሪ BSc ኮምፒውተር ሳይንስን BA ማኔጅመንትን ኮይኑ፣ ልዕሊ 3 ዓመት ላዕለዋይ እንግሊዝኛ ናይ ምምሃር ተመኩሮ ኣለዎ። ኣብ ናይ ኦንላይን መመልከቲታት፣ ዲጂታላዊ መድረኻትን ምምሕዳራዊ ስጉምትታትን ንጹር ሓገዝ ይህብ።',
    trustHeading: 'ስለምንታይ ዳዊት ሰርቪስስ?',
    disclaimerHeading: 'ኣገዳሲ መጠንቀቕታ',
    faqHeading: 'ብተደጋጋሚ ዝሕተቱ ሕቶታት',
    contactHeading: 'ዳዊት ሰርቪስስ ርከቡ',
  },
  om: {
    langBannerBadge: 'Afaan 4 Ni Argama • 4 Languages Available',
    langBannerText:
      'Marsariitiin kun afaan 4n (አማርኛ፣ English፣ ትግርኛ፣ Afaan Oromo) ni argama. Afaan jalqabaa Amharic dha; afaan feetan filadhaa.',
    heroHeadline:
      'Adeemsa paaspoortii, iyyannoo toora interneetii yookaan qophii tikkeetii balalii irratti gargaarsa barbaadduu?',
    heroSubtext:
      'Namoota waltajjii dijitaalaa fayyadamuu, iyyannoo guutuu, adeemsa paaspoortii hordofuu yookaan balalii qindeessuu irratti gargaarsa barbaadaniif deeggarsa qabatamaa ni kennina.',
    requestBtn: 'Tajaajila Gaafadhu',
    exploreBtn: 'Tajaajiloota Ilaali',
    servicesHeading: 'Tajaajiloota Ijoo',
    howItWorksHeading: 'Akkamitti Akka Hojjetu',
    depositHeading: 'Qabattoo Tajaajilaa Birrii 200',
    pricingHeading: 'Gatii Ifa Ta’e',
    formHeading: 'Tajaajila Gaafadhu',
    aboutHeading: 'Daawit Baradhu',
    aboutRole:
      'Barataa Digrii Jalqabaa BSc Computer Science fi BA Management | Muuxannoo Waggaa 3 Ol Afaan Ingilizii Sadarkaa Olaanaa Barsiisuu',
    aboutBio:
      'Daawit Tasfaay yeroo ammaa barataa digrii jalqabaa BSc Computer Science fi BA Management yoo ta’u, muuxannoo waggaa 3 ol afaan Ingilizii sadarkaa olaanaa barsiisuu qaba. Iyyannoo toora interneetii, waltajjii dijitaalaa fi tarkaanfii bulchiinsaa irratti gargaarsa ifa ta’e ni kenna.',
    trustHeading: 'Maaliif Dawit Services?',
    disclaimerHeading: 'Akeekkachiisa Barbaachisaa',
    faqHeading: 'Gaaffiiwwan Yeroo Baay’ee Gaafataman',
    contactHeading: 'Dawit Services Quunnamaa',
  },
};

export const SERVICES: ServiceConfig[] = [
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
];

export const HOW_IT_WORKS_STEPS = [
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
];

export const TRUST_PILLARS = [
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
];

export const FAQ_ITEMS = [
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
    answer:
      'No. If you proceed with the agreed service, it is deducted from the total service fee.',
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
];