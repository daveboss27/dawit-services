'use client';

import React, { useState } from 'react';
import { 
  Phone, Mail, ShieldCheck, 
  Plane, FileText, BookOpen, GraduationCap, 
  ArrowRight, MapPin, Award, Globe, ExternalLink, 
  Send, CheckCircle2, AlertCircle, HelpCircle, Sparkles, Cpu
} from 'lucide-react';

export default function Home() {
  const [lang, setLang] = useState<'AM' | 'EN' | 'TI' | 'AO'>('AM');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [showCertModal, setShowCertModal] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedService, setSelectedService] = useState('Ethiopian Passport Booking');
  const [txRef, setTxRef] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Complete multi-language dictionary with professionally corrected Tigrinya
  const t: Record<string, Record<string, string>> = {
    AM: {
      name: "ዳዊት ተስፋዬ መንግስቱ",
      title: "ኦፊሴላዊ የሙያ አማካሪ እና የዲጂታል አገልግሎት ማዕከል",
      subtitle: "በሁለትዮሽ ስምምነት ላይ የተመሰረተ የታመነ አገልግሎት፤ ለፓስፖርት፣ የበረራ ቲኬት፣ የውጭ ሀገር ትምህርት፣ የእንግሊዝኛ ቋንቋ ስልጠና እና የቴክኖሎጂ/ዲጂታል እርዳታ።",
      bookBtn: "አገልግሎት ያስይዙ",
      servicesBtn: "አገልግሎቶቻችንን ይመልከቱ",
      guarantee: "100% ገንዘብ ተመላሽ ዋስትና፡ የተገባልዎትን አገልግሎት ካላገኙ ሙሉ ክፍያዎ ይመለሳል።",
      expert: "የተረጋገጠ ባለሙያ • የካናዳ ናያግራ ፏፏቴ ዩኒቨርሲቲ",
      certTitle: "የኮሌጅ ፕሮፋይል ልማት ሰርተፍኬት",
      certSubtitle: "ለተሳካ ማጠናቀቂያ የተሰጠ ኦፊሴላዊ ማረጋገጫ (ነሐሴ 8፣ 2018)",
      viewCert: "ሰርተፍኬቱን በሰፊው ይመልከቱ",
      
      policyTitle: "ግልጽ የሁለትዮሽ ስምምነት እና የአገልግሎት መመሪያ",
      policyDesc: "ሁሉም የኮንሰልታንሲ ስራዎቻችን ከደንበኞች ጋር በሚደረግ ጥልቅ ውይይት እና በሁለትዮሽ ስምምነት (Bilateral Agreement) ብቻ ይከናወናሉ። ቃል የተገባውን አገልግሎት መስጠት ካልቻልን 100% ገንዘብ ተመላሽ እናደርጋለን። እንዲሁም ለድንገተኛ (Emergency) እና ለ VIP ልዩ አገልግሎቶች ተጨማሪ ክፍያ በመፈጸም ቅድሚያ ማግኘት ይቻላል።",
      vipNoticeNote: "አስፈላጊ ማሳሰቢያ (N.B): መደበኛ ጥያቄዎችን በግል ኢሜይል አይላኩ። ለድንገተኛ ጉዳዮች የኢሜይል ርዕስ (Subject) ላይ 'EMERGENCY' ይበሉ፤ ለ VIP አገልግሎቶች ደግሞ 'VIP' የሚለውን ቃል ይጠቀሙ። ኢሜይል አድራሻችን: dawittesfay2724@gmail.com",

      servicesHeader: "ዋና ዋና የሙያ አገልግሎቶች እና የዋጋ ዝርዝር",
      servicesSubDesc: "ለወጣቶች፣ ለዩኒቨርሲቲ ተማሪዎች እና ለአዋቂዎች የተዘጋጁ ፈጣን እና እሙን ዲጂታል አገልግሎቶች።",
      
      s1Title: "የኢትዮጵያ ፓስፖርት ቀጠሮ (Passport)",
      s1Price: "የአገልግሎት ክፍያ: 1,000 ብር ብቻ",
      s1Desc: "መደበኛ (Normal) እና አስቸኳይ (Urgent) የኢትዮጵያ ፓስፖርት ቀጠሮዎችን ከኦፊሴላዊው የኢሚግሬሽን (ICS) ስርዓት ጋር በሚጣጣም መልኩ በአስተማማኝ ሁኔታ እናመቻችላለን።",
      
      s2Title: "የበረራ ቲኬት እና ዓለም አቀፍ የጉዞ መመሪያ",
      s2Price: "የመነሻ ክፍያ: ከ 500 ብር ጀምሮ",
      s2Desc: "በኢትዮጵያ አየር መንገድ (Ethiopian Airlines) እና ፍላይዱባይ (flydubai) የትኬት አሰጣጥ ስልት ታጅቦ፤ ለምትፈልጉት ሀገር ምርጥ የዋጋ ቅናሾች እና አጠቃላይ የጉዞ መመሪያ እንሰጣለን።",
      
      s3Title: "የውጭ ሀገር ትምህርት አማካሪ (Study Abroad)",
      s3Price: "ሙሉ የሂደት ድጋፍ (End-to-End)",
      s3Desc: "ከሰነድ ማዘጋጀት፣ የዩኒቨርሲቲ መግቢያ እና ስኮላርሺፕ (Scholarship) ፍለጋ አንስቶ እስከ ቪዛ ሂደት (Visa Process) ድረስ አብረንዎ እንቆማለን።",
      
      s4Title: "የእንግሊዝኛ ቋንቋ ስልጠና (English Tutoring)",
      s4Price: "ኦንላይን ወይም በአካል (አክሱም እና ሀዋሳ ብቻ)",
      s4Desc: "ከ3 ዓመት በላይ በትምህርት ማዕከላት ያስተማረ፤ የናያግራ ፏፏቴ ዩኒቨርሲቲ ሰርተፍኬት ያለው ባለሙያ የሚሰጠው የንግግር እና የሙያ እንግሊዝኛ ስልጠና (በአካል መማር ለሚፈልጉ አክሱም ወይም ሀዋሳ ውስጥ ብቻ ይቻላል)።",

      s5Title: "የቴክኖሎጂ፣ የዲጂታል መተግበሪያዎች እና ብሔራዊ መታወቂያ (National ID)",
      s5Price: "እንደ አገልግሎቱ ሁኔታ",
      s5Desc: "ማንኛውንም መተግበሪያ (App)፣ ሲስተም ወይም የዲጂታል አገልግሎት ለመጠቀም ሲቸገሩ ትክክለኛው ቦታ ላይ ኖት። ብሔራዊ መታወቂያ (Fayda ID) ምዝገባን ጨምሮ ሌሎች ኢትዮጵያ ውስጥ የሚሰጡ ዲጂታል መድረኮችን እንረዳዎታለን።",

      paymentsTitle: "ተቀባይነት ያላቸው የክፍያ አማራጮች እና የ 200 ብር ቅድመ ክፍያ ደንብ:",
      paymentRule: "ማንኛውም ደንበኛ አገልግሎት ሲያስይዝ ቢያንስ 200 ብር ቀድሞ (Upfront Deposit) መክፈል እና የትራንዛክሽን ሪፈረንስ ቁጥር ወይም ስክሪንሾት ማያያዝ አለበት።",
      cbe: "የንግድ ባንክ (CBE): 1000294415045",
      telebirr: "ቴሌብር (Telebirr): 0985076136",

      footerRights: "© 2026 ዳዊት ተስፋዬ አገልግሎቶች። መብቱ በህግ የተጠበቀ ነው።",
      supportWhatsapp: "ዋትስአፕ",
      supportTelegram: "ቴሌግራም (@daveisenough)",
      directCall: "ስልክ (+251985076136)",
      emailLabel: "ኢሜይል (dawittesfay2724@gmail.com)",

      modalTitle: "አገልግሎት ማስያዣ ቅጽ",
      modalSub: "እባክዎ ሙሉ መረጃዎን ይሙሉ፣ የ 200 ብር ቅድመ ክፍያ በባንክ ወይም በቴሌብር ገቢ በማድረግ የሪፈረንስ ቁጥሩን ያስገቡ።",
      fullNameLabel: "ሙሉ ስም (Full Name)",
      phoneLabel: "ስልክ ቁጥር (Phone Number)",
      serviceLabel: "የተመረጠው አገልግሎት (Selected Service)",
      txLabel: "የክፍያ ሪፈረንስ ቁጥር ወይም ሐዋላ መለያ (Tx Reference ID / Screenshot)",
      submitBtn: "ጥያቄውን ይላኩ (Submit Booking)",
      successMsg: "መረጃዎ በትክክል ተቀብለናል! ክፍያዎ በሲስተም ሲረጋገጥ በስልክ ወይም በቴሌግራም እናነጋግርዎታለን።"
    },
    EN: {
      name: "Dawit Tesfay Mengstu",
      title: "Official Professional Consultant & Digital Services Hub",
      subtitle: "Bilateral agreement-based professional consulting for Passports, Flight Bookings, Study Abroad, English Tutoring, and Tech/Digital Assistance.",
      bookBtn: "Book a Service",
      servicesBtn: "Explore Services",
      guarantee: "100% Money-Back Guarantee: Full refund if we fail to deliver the promised outcome.",
      expert: "Certified Expert • University of Niagara Falls Canada",
      certTitle: "College Profile Development Certificate",
      certSubtitle: "Official certification for successful completion (Aug. 8, 2026)",
      viewCert: "View Full Certificate",

      policyTitle: "Bilateral Agreement & Operating Policy",
      policyDesc: "All consultancy operations are conducted strictly on the basis of a formal bilateral agreement following detailed discussion. If we do not deliver as promised, you receive a 100% refund. VIP and emergency priority services are available for clients willing to cover additional priority fees.",
      vipNoticeNote: "N.B: Do not send regular service requests through direct personal email. For urgent cases, set the email subject to 'EMERGENCY'. For VIP services, set the subject to 'VIP'. Email: dawittesfay2724@gmail.com",

      servicesHeader: "Core Professional Services & Pricing",
      servicesSubDesc: "Fast-track digital consulting designed for young professionals, university students, and adults.",

      s1Title: "Ethiopian Passport Booking",
      s1Price: "Service Charge: Only 1,000 ETB",
      s1Desc: "Normal and urgent Ethiopian passport appointment scheduling handled securely modeled after the official ICS portal.",

      s2Title: "Flight Tickets & Global Travel Guidance",
      s2Price: "Starting from 500 ETB",
      s2Desc: "Global flight booking assistance modeled after Ethiopian Airlines and flydubai platforms offering great travel deals.",

      s3Title: "Study Abroad Advisory",
      s3Price: "End-to-End Support",
      s3Desc: "Comprehensive support from university selection, SOP formulation, and scholarship applications to full visa processing guidance.",

      s4Title: "Private English Tutoring",
      s4Price: "Online / In-Person (Axum & Hawassa Only)",
      s4Desc: "Spoken and professional English instruction backed by a University of Niagara Falls Canada certificate. In-person tutoring is exclusively available for residents in Axum or Hawassa.",

      s5Title: "Tech Support, Apps & National ID (Fayda)",
      s5Price: "Varies by Service",
      s5Desc: "If you face any problem using applications, systems, or digital tools, you are in the right place. Assistance with National ID (Fayda ID) registration and other Ethiopian digital public services.",

      paymentsTitle: "Accepted Payment Channels & 200 ETB Upfront Deposit Rule:",
      paymentRule: "Clients must pay at least 200 ETB upfront via CBE or Telebirr, submit the transaction reference number or screenshot, and await confirmation.",
      cbe: "CBE: 1000294415045",
      telebirr: "Telebirr: 0985076136",

      footerRights: "© 2026 Dawit Tesfay Services. All rights reserved.",
      supportWhatsapp: "WhatsApp",
      supportTelegram: "Telegram (@daveisenough)",
      directCall: "Phone (+251985076136)",
      emailLabel: "Email (dawittesfay2724@gmail.com)",

      modalTitle: "Service Booking Form",
      modalSub: "Fill in your details, make the minimum 200 ETB upfront deposit, and provide your transaction reference.",
      fullNameLabel: "Full Name",
      phoneLabel: "Phone Number (+251)",
      serviceLabel: "Selected Service",
      txLabel: "Transaction Reference Number / ID",
      submitBtn: "Confirm & Submit Request",
      successMsg: "Booking received successfully! We will contact you once your payment is verified."
    },
    TI: {
      name: "ዳዊት ተስፋዬ መንግስቱ",
      title: "ወግዓዊ ሞያዊ አማካርን ማዕከል ዲጂታላዊ ኣገልግሎትን",
      subtitle: "ኣብ ክልትዮናዊ ስምምነት እተሰረተ እሙን ኣገልግሎት፤ ንቀጠሮ ፓስፖርት፣ ቲኬት በረራ፣ ትምህርቲ ወጻኢ ሃገር፣ ስልጠና እንግሊዝኛን ዲጂታላዊ/ቴክኖሎጂ ሓገዝን።",
      bookBtn: "ኣገልግሎት ሓዝ",
      servicesBtn: "ኣገልግሎታት ርአ",
      guarantee: "100% ገንዘብ ምምላስ ውሕስና፡ ቃል ዝተኣተወ ውጽኢት እንተዘይተረኺቡ ሙሉእ ገንዘብኩም ብዘይ ቅድመ ኩነት ይመለስ።",
      expert: "መረጋገጺ ሰብ ሞያ • ዩኒቨርሲቲ ናያግራ ፏፏቴ ካናዳ",
      certTitle: "ሰርተፍኬት ልምዓት መደብ ኮሌጅ",
      certSubtitle: "ብዕለት ነሓሴ 8, 2026 ዝተዋህበ ወግዓዊ ሰነድ",
      viewCert: "ሰርተፍኬት ብሰፊሑ ርአ",

      policyTitle: "ጹሩይ ክልትዮናዊ ስምምነትን መምርሒ ስራሕን",
      policyDesc: "ኩሉ ናይ ኣገልግሎት ስርሓትና ምስ ደንበኛታት ድሕሪ ዝግበር ዕጹው ምይይጥን ኣብ ክልትዮናዊ ስምምነት (Bilateral Agreement) ጥራይ ዝምስረት እዩ። ቃል ዝተኣተወ ኣገልግሎት እንተዘይተዋሂቡ 100% ገንዘብ ንመልስ። ንህጹጽ (Emergency) ናይ VIP ኣገልግሎታት ብተወሳኺ ክፍያ ቅድሚያ ክግበር ይከኣል።",
      vipNoticeNote: "መዘኻኸሪ (N.B): ስሩዕ ሕቶታት ብቐጥታ ብውልቀ ኢሜይል ኣይሰደዱ። ንህጹጽ ጉዳያት subject ናብ 'EMERGENCY' ይቐይሩ፣ ን VIP ድማ 'VIP' ይበሉ። ኢሜይል: dawittesfay2724@gmail.com",

      servicesHeader: "ቀንዲ ሞያዊ ኣገልግሎታትን ዋጋታትን",
      servicesSubDesc: "ንመንእሰያትን፣ ተማሃሮ ዩኒቨርሲቲን ዓበይትን እሙንን ቅልጡፍን ዲጂታላዊ ኣገልግሎታት።",

      s1Title: "ቀጠሮ ፓስፖርት ኢትዮጵያ (Passport)",
      s1Price: "ናይ ኣገልግሎት ክፍያ: 1,000 ብር ጥራይ",
      s1Desc: "ስሩዕ (Normal) ከምኡ'ውን ህጹጽ (Urgent) ቀጠሮ ፓስፖርት ኢትዮጵያ ምስ ወግዓዊ ሲስተም ICS ብዝተሓለወ መንገዲ ነመቻችል።",

      s2Title: "טיኬት በረራን ዓለም አቀፍ ጉዕዞን",
      s2Price: "መበገሲ ዋጋ: ካብ 500 ብር ጀምሮ",
      s2Desc: "ኣህጉራዊ ጉዕዞ ብኢትዮጵያን አየር መንገድን flydubaiን ብብሉጽ ቅናሽ ዋጋን ጽፉፍ መምርሒ ጉዕዞን።",

      s3Title: "ምኽሪ ትምህርቲ ወጻኢ ሃገር (Study Abroad)",
      s3Price: "ምሉእ ናይ መስርሕ ድጋፍ (End-to-End)",
      s3Desc: "ካብ መረጻ ዩኒቨርሲቲ፣ ምድላው SOP፣ ስኮላርሺፕ ክሳብ መስርሕ ቪዛ ዘሎ ሓገዝ ብብቕዓት ንህብ።",

      s4Title: "ስልጠና ቋንቋ እንግሊዝኛ (English Tutoring)",
      s4Price: "ብመረበብ (Online) ወይ ብኣካል (ኣክሱምን ሃዋሳን ጥራይ)",
      s4Desc: "ልዕሊ 3 ዓመት ልምዲ ዘለዎ፤ ሰርተፍኬት ናያግራ ፏፏቴ ዘለዎ ባለሙያ ዝወሃብ ስልጠና። ብኣካል ንምምሃር ኣብ ኣክሱም ወይ ሃዋሳ ንዝነብሩ ጥራይ ዝፈጸመ እዩ።",

      s5Title: "ቴክኖሎጂ፣ ዲጂታል ኣፕሊኬሽናትን ብሔራዊ መታወቂያ (National ID)",
      s5Price: "ከከም ዓይነት ኣገልግሎቱ",
      s5Desc: "ዝኾነ መተግበሪያ (App)፣ ሲስተም ወይ ዲጂታላዊ መሳርሒ ንምጥቃም እንተጸጊምኩም ኣብ ቅኑዕ ቦታ ኣለኹም። ምዝገባ ብሔራዊ መታወቂያ (Fayda ID) ሓዊሱ ካልኦት ዲጂታላዊ ኣገልግሎታት ኢትዮጵያ ንድግፍ።",

      paymentsTitle: "ተቐባይነት ዘለዎ መገዲ ክፍያን ንኡስ ቅድመ ክፍያ 200 ብር:",
      paymentRule: "ዝኾነ ደንበኛ ኣገልግሎት ከትሕዙ እንከለዉ ቢያንስ 200 ብር ብ ባንክ ወይ ቴሌብር ቅድመ ክፍያ ከፊሎም ሪፈረንስ ቁጽሪ ከእትዉ ኣለዎም።",
      cbe: "ንግዲ ባንክ (CBE): 1000294415045",
      telebirr: "ቴሌብር (Telebirr): 0985076136",

      footerRights: "© 2026 ዳዊት ተስፋዬ ኣገልግሎታት። ኩሉ መሰል ሕጊ ዝተሓለወ እዩ።",
      supportWhatsapp: "ዋትስአፕ",
      supportTelegram: "ቴሌግራም (@daveisenough)",
      directCall: "ስልኪ (+251985076136)",
      emailLabel: "ኢሜይል (dawittesfay2724@gmail.com)",

      modalTitle: "ናይ ኣገልግሎት መተሓሓዚ ቅጽ",
      modalSub: "እባክዎ መረዳእታኹም ሞልኡ፣ ውሕስና ንምግባር 200 ብር ከፊልኩም ሪፈረንስ ቁጽሪ ኣእትዉ።",
      fullNameLabel: "ምሉእ ሽም (Full Name)",
      phoneLabel: "ቁጽሪ ስልኪ (Phone Number)",
      serviceLabel: "ዝተመረጸ ኣገልግሎት (Selected Service)",
      txLabel: "ናይ ክፍያ ሪፈረንስ ቁጽሪ ወይ ስክሪንሾት (Tx Reference ID / Screenshot)",
      submitBtn: "ሕቶኹም ልኣኹ (Submit Booking)",
      successMsg: "ሓበሬታኹም ተቐቢልናዮ ኣለና! ክፍያ ምስ ተረጋገጸ ብስልኪ ወይ ብቴሌግራም ክንረኽበኩም ኢና።"
    },
    AO: {
      name: "Dawit Tesfay Mengstu",
      title: "Gorsaa Ogeessaa Seera Qabeessa & Wiirtuu Tajaajila Dijitaalaa",
      subtitle: "Walii galtee lamaan irratti hundaa'ee paspoortii, balalii, barumsa alaa, leenjii afaan Ingiliffaa fi deeggarsa teeknolojii/dijitaalaa.",
      bookBtn: "Tajaajila Qabachiisi",
      servicesBtn: "Tajaajila Keenya Ilaali",
      guarantee: "100% Deebii Maallaqaa: Bu'aa waadaa galame yoo argachuu baattan kaffaltiin keessan guututti deebi'a.",
      expert: "Ogeessa Mirkanaa'e • Yuunivarsiitii Niagara Falls Kaadaa",
      certTitle: "Waraqaa Ragaa Misooma Profaayilii Kolleejjii",
      certSubtitle: "Ragaa sirrii kan guyyaa Hagayya 8, 2026 kenname",
      viewCert: "Waraqaa Ragaa Guutuu Ilaali",

      policyTitle: "Walii Galtee Lammiilee Ifaa & Imaammata Hojii",
      policyDesc: "Tajaajiloonni gorsa keenya hundi kan raawwataman mariin gadi fagoo fi walii galtee lamaan (Bilateral Agreement) qofaani. Yoo bu'aa argachuu baattan 100% deebii maallaqaa ni kennina. Tajaajila hatattamaa (Emergency) fi VIP dabalataan kaffaluun argachuu dandeessu.",
      vipNoticeNote: "Hubachiisa (N.B): Gaaffii idilee imeelii dhuunfaatiin hin erginaa. Haala hatattamaaf subject irratti 'EMERGENCY' jedhaa, VIPaf immoo 'VIP' fayyadamaa. Imeelii: dawittesfay2724@gmail.com",

      servicesHeader: "Tajaajiloota Ogeessaa Ijoo & Gatiiwwan",
      servicesSubDesc: "Gorsaa dijitaalaa amansiisaa fi saffisaa qabu.",

      s1Title: "Qaxaroo Paaspoortii Itoophiyaa",
      s1Price: "Kaffaltii Tajaajilaa: Birrii 1,000 qofa",
      s1Desc: "Karoora qaxaroo paspoortii idilee (Normal) fi hatattamaa (Urgent) sirna ICS eeguun kan raawwatamu.",

      s2Title: "Ticketii Balalii & Qajeelfama Imala Idil-addunyaa",
      s2Price: "Gatii Ka'umsaa: Birrii 500 irraa eegalee",
      s2Desc: "Gargaarsa ticketii balalii Ethiopian Airlines fi flydubai waliin qusannoo guddaa fi gorsa imalaa.",

      s3Title: "Gorsa Barumsa Alaa (Study Abroad)",
      s3Price: "Deeggarsa Guutuu (End-to-End)",
      s3Desc: "Filannoo yuunivarsiitii, barreeffama SOP, apply scholarship hanga vizaa qabanutti deeggarsa guutuu.",

      s4Title: "Leenjii Afaan Ingiliffaa Dhuunfaa",
      s4Price: "Online ykn Kallattiin (Axum & Hawassa Qofa)",
      s4Desc: "Leenjii afaan Ingiliffaa ogeessotaan kennamu. Leenjiin kallattiin (In-person) kennamu kan danda'amu Axum ykn Hawassa keessa qofaafidha.",

      s5Title: "Deeggarsa Teeknolojii, Appii & Eenyummaa Biyyaalessaa (National ID)",
      s5Price: "Akkaataa Tajaajilaatti",
      s5Desc: "Appilikeeshinii, sistema ykn meeshaa dijitaalaa fayyadamuu irratti rakkina yoo qabattan bakka sirriirra jirtu. Galmee Eenyummaa Biyyaalessaa (Fayda ID) fi tajaajiloota dijitaalaa Itoophiyaa biroo ni deeggarra.",

      paymentsTitle: "Karaalee Kaffaltii fi Seera Qabsiisa Birrii 200:",
      paymentRule: "Maamiltoonni yoo xiqqate Birrii 200 dursanii CBE ykn Telebirr dhaan kaffaluun lakkoofsa ragaa (Reference) erguu qabu.",
      cbe: "CBE: 1000294415045",
      telebirr: "Telebirr: 0985076136",

      footerRights: "© 2026 Tajaajila Dawit Tesfay. Mirgi hunduu eegamaadha.",
      supportWhatsapp: "WhatsApp",
      supportTelegram: "Telegram (@daveisenough)",
      directCall: "Bilbila (+251985076136)",
      emailLabel: "Imeelii (dawittesfay2724@gmail.com)",

      modalTitle: "Unka Qabsiisa Tajaajila",
      modalSub: "Odeeffannoo keessan guutaa, kaffaltii Birrii 200 raawwachuun lakkoofsa ragaa (Reference) galchaa.",
      fullNameLabel: "Maqaa Guutuu",
      phoneLabel: "Lakkoofsa Bilbilaa (+251)",
      serviceLabel: "Tajaajila Filatame",
      txLabel: "Lakkoofsa Ragaa Kaffaltii (Tx Reference ID)",
      submitBtn: "Gaaffii Ergi",
      successMsg: "Odeeffannoon keessan nu qaqqabeera! Kaffaltiin yeroo mirkanaa'u bilbilaan isin qaqqabna."
    }
  };

  const currentT = t[lang];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setActiveModal(null);
      setFullName('');
      setPhone('');
      setTxRef('');
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative selection:bg-blue-600 selection:text-white">
      
      {/* IMMERSIVE TRANSPARENT BACKGROUND OVERLAY */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 overflow-hidden">
        <img 
          src="/dawit-profile.jpg" 
          alt="Background Overlay" 
          className="w-full h-full object-cover filter blur-[2px] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/90 to-slate-950"></div>
      </div>

      {/* Top Header & Contact Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/85 backdrop-blur-md sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-xl tracking-wider bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              DAWIT TESFAY MENGSTU
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
              Official Portal
            </span>
          </div>

          <div className="flex items-center flex-wrap gap-4 text-xs md:text-sm text-slate-300">
            <a href="tel:+251985076136" className="flex items-center gap-1.5 hover:text-blue-400 transition">
              <Phone className="w-4 h-4 text-blue-400" /> +251 985 076 136
            </a>
            <a href="mailto:dawittesfay2724@gmail.com" className="flex items-center gap-1.5 hover:text-blue-400 transition">
              <Mail className="w-4 h-4 text-blue-400" /> dawittesfay2724@gmail.com
            </a>
            <a href="https://t.me/daveisenough" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-slate-300 hover:text-blue-400 transition font-medium">
              <Send className="w-4 h-4 text-blue-400" /> @daveisenough
            </a>
          </div>

          {/* Language Switcher */}
          <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {(['AM', 'EN', 'TI', 'AO'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1 rounded-md text-xs font-bold transition ${
                  lang === l ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 px-4 z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" /> {currentT.guarantee}
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              {currentT.name} <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent text-2xl sm:text-4xl font-extrabold">
                {currentT.title}
              </span>
            </h1>

            <p className="text-lg text-slate-300 max-w-2xl font-normal leading-relaxed border-l-2 border-blue-500 pl-4 bg-slate-900/40 py-2 rounded-r-xl">
              {currentT.subtitle}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={() => setActiveModal('Ethiopian Passport Booking')}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold shadow-xl shadow-blue-600/25 flex items-center gap-3 transition transform hover:-translate-y-0.5"
              >
                {currentT.bookBtn} <ArrowRight className="w-5 h-5" />
              </button>
              <a 
                href="#services"
                className="px-8 py-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:bg-slate-800 text-slate-200 font-semibold transition flex items-center gap-2"
              >
                {currentT.servicesBtn}
              </a>
            </div>

            {/* Payment Trust Badges & 200 ETB Rule */}
            <div className="pt-6 border-t border-slate-800/80 space-y-3 text-xs text-slate-400">
              <span className="font-semibold text-blue-300 block">{currentT.paymentsTitle}</span>
              <p className="text-slate-300 font-medium leading-relaxed">{currentT.paymentRule}</p>
              <div className="flex flex-wrap gap-4 pt-1">
                <span className="px-3 py-1.5 bg-slate-900/90 rounded-md border border-slate-800 text-slate-200 font-mono">{currentT.cbe}</span>
                <span className="px-3 py-1.5 bg-slate-900/90 rounded-md border border-slate-800 text-slate-200 font-mono">{currentT.telebirr}</span>
              </div>
            </div>
          </div>

          {/* Profile & Certificate Cards */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Consultant Profile Card */}
            <div className="bg-slate-900/85 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-xl relative group">
              <div className="w-full h-60 rounded-xl overflow-hidden bg-slate-950 mb-4 border border-slate-800 relative">
                <img 
                  src="/dawit-profile.jpg" 
                  alt="Dawit Tesfay Mengstu" 
                  className="w-full h-full object-cover object-top transition duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="font-bold text-lg text-white">Dawit Tesfay Mengstu</h3>
              <p className="text-xs text-blue-400 font-medium">Lead Consultant & Instructor</p>
            </div>

            {/* Certificate Preview Card */}
            <div className="bg-slate-900/85 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-xl relative group flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold mb-2">
                  <Award className="w-4 h-4" /> {currentT.expert}
                </div>
                <div 
                  onClick={() => setShowCertModal(true)}
                  className="w-full h-44 rounded-xl overflow-hidden bg-slate-950 mb-3 border border-slate-800 relative cursor-pointer group-hover:border-blue-500/50 transition"
                >
                  <img 
                    src="/unf-certificate.jpg" 
                    alt="UNF Certificate" 
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-blue-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1">
                    <ExternalLink className="w-4 h-4" /> {currentT.viewCert}
                  </div>
                </div>
              </div>
              <span className="text-[11px] text-slate-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-center font-medium">
                {currentT.certTitle}
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* Bilateral Agreement & VIP Policy Banner */}
      <section className="py-12 bg-slate-900/40 border-y border-slate-800/80 relative z-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-950/40 to-slate-900/90 border border-blue-500/30 rounded-2xl p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" /> {currentT.policyTitle}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">{currentT.policyDesc}</p>
                <p className="text-xs text-amber-300 font-semibold pt-2 border-t border-slate-800/80">{currentT.vipNoticeNote}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-20 max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold mb-4">{currentT.servicesHeader}</h2>
          <p className="text-slate-400 max-w-xl mx-auto">{currentT.servicesSubDesc}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: currentT.s1Title, price: currentT.s1Price, desc: currentT.s1Desc, icon: FileText, color: "text-blue-400" },
            { title: currentT.s2Title, price: currentT.s2Price, desc: currentT.s2Desc, icon: Plane, color: "text-indigo-400" },
            { title: currentT.s3Title, price: currentT.s3Price, desc: currentT.s3Desc, icon: GraduationCap, color: "text-cyan-400" },
            { title: currentT.s4Title, price: currentT.s4Price, desc: currentT.s4Desc, icon: BookOpen, color: "text-emerald-400" },
            { title: currentT.s5Title, price: currentT.s5Price, desc: currentT.s5Desc, icon: Cpu, color: "text-amber-400" },
          ].map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="bg-slate-900/85 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 transition flex flex-col justify-between group backdrop-blur-sm shadow-xl">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center ${s.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
                      {s.price}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-white">{s.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">{s.desc}</p>
                </div>
                <button 
                  onClick={() => { setSelectedService(s.title); setActiveModal(s.title); }}
                  className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-200 text-sm font-bold transition flex items-center justify-center gap-2"
                >
                  {currentT.bookBtn} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive FAQ Section */}
      <section className="py-16 bg-slate-900/30 border-t border-slate-800/80 relative z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-2">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-400">Quick answers regarding passport scheduling, travel bookings, and tutoring.</p>
          </div>

          <div className="space-y-4">
            {[
              { q: "How does the bilateral agreement and refund work?", a: "Everything happens after discussion. If we fail to deliver the promised outcome, your money is refunded 100%." },
              { q: "Where is in-person English tutoring available?", a: "In-person tutoring is exclusively available for clients residing in Axum or Hawassa, alongside online options." },
              { q: "Can you help with National ID (Fayda) and app issues?", a: "Yes! If you face any trouble using apps, systems, or registering for your National ID and Ethiopian digital services, we provide expert guidance." }
            ].map((faq, i) => (
              <div key={i} className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-4 text-left font-semibold text-sm flex justify-between items-center text-slate-200 hover:text-blue-400 transition"
                >
                  <span>{faq.q}</span>
                  <span className="text-lg font-bold">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className="p-4 pt-0 text-xs text-slate-400 leading-relaxed border-t border-slate-800/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full Certificate Modal */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowCertModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl font-bold bg-slate-800 w-8 h-8 rounded-full flex items-center justify-center"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-1 text-white">{currentT.certTitle}</h3>
            <p className="text-xs text-slate-400 mb-4">{currentT.certSubtitle}</p>
            <div className="w-full max-h-[75vh] overflow-auto rounded-xl border border-slate-800 bg-slate-950 p-2">
              <img 
                src="/unf-certificate.jpg" 
                alt="Full UNF Certificate" 
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Booking Overlay Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>
            
            <h3 className="text-xl font-bold mb-1 text-white">{currentT.modalTitle}</h3>
            <p className="text-xs text-slate-400 mb-4">{currentT.modalSub}</p>

            {submitted ? (
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <p className="text-sm font-semibold text-emerald-300">{currentT.successMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">{currentT.fullNameLabel}</label>
                  <input 
                    required 
                    type="text" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">{currentT.phoneLabel}</label>
                  <input 
                    required 
                    type="tel" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+251 9XXXXXXXX" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">{currentT.serviceLabel}</label>
                  <input 
                    type="text" 
                    readOnly 
                    value={selectedService} 
                    className="w-full bg-slate-950/50 border border-slate-800/80 rounded-xl px-4 py-2.5 text-sm text-blue-400 font-semibold" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">{currentT.txLabel}</label>
                  <input 
                    required 
                    type="text" 
                    value={txRef} 
                    onChange={(e) => setTxRef(e.target.value)}
                    placeholder="e.g. CBE Transaction ID / Telebirr Ref" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" 
                  />
                  <p className="text-[10px] text-amber-400 mt-1">Min. 200 ETB upfront deposit required via CBE or Telebirr.</p>
                </div>
                <button type="submit" className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold transition shadow-lg shadow-blue-600/25">
                  {currentT.submitBtn}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer with Exact Contact Handles & Icons */}
      <footer className="border-t border-slate-800/80 py-12 bg-slate-950 text-center relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-400">
          <p>{currentT.footerRights}</p>
          <div className="flex flex-wrap justify-center gap-6 font-medium">
            <a href="https://t.me/daveisenough" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white transition">
              <Send className="w-3.5 h-3.5 text-blue-400" /> {currentT.supportTelegram}
            </a>
            <a href="tel:+251985076136" className="flex items-center gap-1.5 hover:text-white transition">
              <Phone className="w-3.5 h-3.5 text-blue-400" /> {currentT.directCall}
            </a>
            <a href="mailto:dawittesfay2724@gmail.com" className="flex items-center gap-1.5 hover:text-white transition">
              <Mail className="w-3.5 h-3.5 text-blue-400" /> {currentT.emailLabel}
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}