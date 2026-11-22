'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { LangKey, ServiceKey } from '../lib/servicesData';
import { CheckCircle2, AlertCircle, Send, Upload, Copy, Check } from 'lucide-react';

interface ServiceRequestFormProps {
  initialService?: ServiceKey;
  lang?: LangKey;
  onSuccess?: () => void;
}

const TELEBIRR_NUMBER = '0985076136';
const CBE_ACCOUNT = '1000294415045';

const FORM_COPY: Record<
  LangKey,
  {
    successTitle: string;
    successBodyStart: string;
    successBodyMid: string;
    successBodyEnd: string;
    fullNameLabel: string;
    fullNamePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    telegramLabel: string;
    telegramPlaceholder: string;
    emailLabel: string;
    optionalTag: string;
    emailPlaceholder: string;
    serviceLabel: string;
    serviceOptions: Record<ServiceKey, string>;
    passportBoxTitle: string;
    passportHelpLabel: string;
    passportHelpPlaceholder: string;
    passportLocationLabel: string;
    passportLocationPlaceholder: string;
    passportProblemLabel: string;
    passportProblemPlaceholder: string;
    appBoxTitle: string;
    platformLabel: string;
    platformPlaceholder: string;
    deadlineLabel: string;
    deadlinePlaceholder: string;
    tryingToDoLabel: string;
    tryingToDoPlaceholder: string;
    digitalProblemLabel: string;
    digitalProblemPlaceholder: string;
    optionalDescLabel: string;
    optionalDescPlaceholder: string;
    flightBoxTitle: string;
    departureCityLabel: string;
    departureCityPlaceholder: string;
    destinationLabel: string;
    destinationPlaceholder: string;
    departureDateLabel: string;
    returnDateLabel: string;
    tripTypeLabel: string;
    oneWayLabel: string;
    roundTripLabel: string;
    passengersLabel: string;
    travelClassLabel: string;
    moreDetailsLabel: string;
    moreDetailsPlaceholder: string;
    paymentBoxTitle: string;
    paymentBoxSubtext: string;
    telebirrLabel: string;
    cbeLabel: string;
    copyBtn: string;
    copiedBtn: string;
    paymentMethodLabel: string;
    paymentRefLabel: string;
    paymentRefPlaceholder: string;
    paymentScreenshotLabel: string;
    paymentScreenshotHint: string;
    submitBtn: string;
    submittingBtn: string;
    errName: string;
    errPhone: string;
    errTelegram: string;
    errEmail: string;
    errPassportHelp: string;
    errPassportLocation: string;
    errPassportProblem: string;
    errPlatform: string;
    errTryingToDo: string;
    errDigitalProblem: string;
    errDepartureCity: string;
    errDestination: string;
    errDepartureDate: string;
    errReturnDate: string;
    errPassengers: string;
    errPaymentProof: string;
    errSave: string;
  }
> = {
  am: {
    successTitle: 'የአገልግሎት ጥያቄዎ ደርሶናል',
    successBodyStart: 'እናመሰግናለን፣ ',
    successBodyMid: '። ለ',
    successBodyEnd:
      ' ያስገቡት ጥያቄ ተመዝግቧል። የ200 ብር ክፍያ ማረጋገጫዎን (ሪፈረንስ ወይም ስክሪንሾት) ካረጋገጥን በኋላ በስልክ ወይም በቴሌግራም እናገኝዎታለን።',
    fullNameLabel: 'ሙሉ ስም',
    fullNamePlaceholder: 'ሙሉ ስምዎን ያስገቡ',
    phoneLabel: 'ስልክ ቁጥር',
    phonePlaceholder: 'ለምሳሌ 0985076136 ወይም +2519...',
    telegramLabel: 'የቴሌግራም ስም ወይም ቁጥር',
    telegramPlaceholder: '@username ወይም የቴሌግራም ስልክ',
    emailLabel: 'ኢሜይል',
    optionalTag: '(አማራጭ)',
    emailPlaceholder: 'you@example.com',
    serviceLabel: 'አገልግሎት ይምረጡ',
    serviceOptions: {
      passport: 'የፓስፖርት ቀጠሮ እገዛ',
      application: 'የማመልከቻ እና ዲጂታል እገዛ',
      flight: 'የበረራ እና ትኬት እገዛ',
    },
    passportBoxTitle: 'የፓስፖርት ቀጠሮ እገዛ ዝርዝር',
    passportHelpLabel: 'ምን እገዛ ያስፈልግዎታል?',
    passportHelpPlaceholder: 'ለምሳሌ ቀጠሮ መያዝ፣ ቅጽ መሙላት፣ የሂደት መመሪያ',
    passportLocationLabel: 'አሁን ያሉበት ቦታ',
    passportLocationPlaceholder: 'ከተማ ወይም ክልል',
    passportProblemLabel: 'የችግሩ ዝርዝር መግለጫ',
    passportProblemPlaceholder: 'ምን እንደሞከሩ እና የት ላይ እንደተቸገሩ ይግለጹ',
    appBoxTitle: 'የማመልከቻ እና ዲጂታል እገዛ ዝርዝር',
    platformLabel: 'የመድረኩ ወይም የማመልከቻው ስም',
    platformPlaceholder: 'ዩኒቨርሲቲ፣ ስኮላርሺፕ፣ የኦንላይን ቅጽ ወዘተ',
    deadlineLabel: 'የመጨረሻ ቀን (ካለ)',
    deadlinePlaceholder: 'ለምሳሌ ታህሳስ 15 ወይም የለውም',
    tryingToDoLabel: 'ምን ማድረግ ይፈልጋሉ?',
    tryingToDoPlaceholder: 'ለምሳሌ ማመልከቻ መሙላት፣ ሰነድ መጫን፣ ማስተካከል፣ መላክ',
    digitalProblemLabel: 'ምን ችግር እያጋጠመዎት ነው?',
    digitalProblemPlaceholder: 'የተቸገሩበትን ቦታ ወይም መልዕክት በግልጽ ያስቀምጡ',
    optionalDescLabel: 'ተጨማሪ ማብራሪያ (አማራጭ)',
    optionalDescPlaceholder: 'ጥያቄዎን ለመረዳት የሚጠቅም ተጨማሪ ሀሳብ',
    flightBoxTitle: 'የበረራ እና ትኬት እገዛ ዝርዝር',
    departureCityLabel: 'የመነሻ ከተማ / ሀገር',
    departureCityPlaceholder: 'ለምሳሌ አዲስ አበባ፣ ኢትዮጵያ',
    destinationLabel: 'መድረሻ ከተማ / ሀገር',
    destinationPlaceholder: 'የሚሄዱበትን ቦታ ያስገቡ',
    departureDateLabel: 'የመነሻ ቀን',
    returnDateLabel: 'የመመለሻ ቀን (የደርሶ መልስ ከሆነ)',
    tripTypeLabel: 'የጉዞ አይነት',
    oneWayLabel: 'አንድ መንገድ (One-way)',
    roundTripLabel: 'ደርሶ መልስ (Round trip)',
    passengersLabel: 'የተጓዦች ብዛት',
    travelClassLabel: 'የሚመርጡት ክፍል (Class)',
    moreDetailsLabel: 'ስለሚፈልጉት እገዛ ተጨማሪ ይጻፉ፡',
    moreDetailsPlaceholder: 'ጠቃሚ ዝርዝር ካለ እዚህ ያስገቡ',
    paymentBoxTitle: 'ከመገናኘታችን በፊት የ200 ብር ክፍያ ይፈጽሙ',
    paymentBoxSubtext:
      'መረጃዎን ከሞሉ በኋላ እኛ ከማግኘታችን በፊት 200 ብር በቴሌብር ወይም በCBE ይክፈሉ፤ ከዚያ የክፍያ ሪፈረንስ ቁጥር ያስገቡ ወይም ስክሪንሾት ያያይዙ።',
    telebirrLabel: 'ቴሌብር (telebirr)',
    cbeLabel: 'የኢትዮጵያ ንግድ ባንክ (CBE)',
    copyBtn: 'ቅዳ',
    copiedBtn: 'ተቀድቷል',
    paymentMethodLabel: 'የከፈሉበት መንገድ',
    paymentRefLabel: 'የክፍያ ሪፈረንስ ቁጥር (Transaction Reference)',
    paymentRefPlaceholder: 'የክፍያ ሪፈረንስ ቁጥር ያስገቡ',
    paymentScreenshotLabel: 'የክፍያ ስክሪንሾት ያያይዙ',
    paymentScreenshotHint: 'JPG, PNG ወይም WEBP ምስል ይምረጡ (ሪፈረንስ ቁጥር ካስገቡ ወይም ስክሪንሾት ካያያዙ በቂ ነው)',
    submitBtn: 'ጥያቄ እና ክፍያ ማረጋገጫ ይላኩ',
    submittingBtn: 'እየተላከ ነው...',
    errName: 'እባክዎ ሙሉ ስምዎን ያስገቡ።',
    errPhone: 'እባክዎ ትክክለኛ ስልክ ቁጥር ያስገቡ።',
    errTelegram: 'እባክዎ የቴሌግራም ስም ወይም ቁጥር ያስገቡ።',
    errEmail: 'እባክዎ ትክክለኛ ኢሜይል ያስገቡ ወይም ባዶ ይተዉት።',
    errPassportHelp: 'በፓስፖርት ጉዳይ ምን እገዛ እንደሚፈልጉ ይግለጹ።',
    errPassportLocation: 'እባክዎ አሁን ያሉበትን ቦታ ያስገቡ።',
    errPassportProblem: 'እባክዎ ያጋጠመዎትን የፓስፖርት ችግር ይግለጹ።',
    errPlatform: 'እባክዎ የማመልከቻውን ወይም የመድረኩን ስም ያስገቡ።',
    errTryingToDo: 'እባክዎ ምን ማድረግ እንደሚፈልጉ ይግለጹ።',
    errDigitalProblem: 'እባክዎ ያጋጠመዎትን ችግር ይግለጹ።',
    errDepartureCity: 'እባክዎ የመነሻ ከተማ ወይም ሀገር ያስገቡ።',
    errDestination: 'እባክዎ መድረሻውን ያስገቡ።',
    errDepartureDate: 'እባክዎ የመነሻ ቀን ይምረጡ።',
    errReturnDate: 'ለደርሶ መልስ የመመለሻ ቀን ያስገቡ ወይም አንድ መንገድ ይምረጡ።',
    errPassengers: 'ቢያንስ 1 ተጓዥ ያስገቡ።',
    errPaymentProof: 'እባክዎ የ200 ብር ክፍያ ሪፈረንስ ቁጥር ያስገቡ ወይም የክፍያ ስክሪንሾት ያያይዙ።',
    errSave: 'ጥያቄውን ማስቀመጥ አልተቻለም፡ ',
  },
  en: {
    successTitle: 'Service Request & 200 ETB Payment Proof Received',
    successBodyStart: 'Thank you, ',
    successBodyMid: '. Your request for ',
    successBodyEnd:
      ' has been recorded. Once we verify your 200 ETB payment reference or screenshot, we will contact you.',
    fullNameLabel: 'Full Name',
    fullNamePlaceholder: 'Enter your full name',
    phoneLabel: 'Phone Number',
    phonePlaceholder: 'e.g. +251 9XX XXX XXX',
    telegramLabel: 'Telegram Username / Contact',
    telegramPlaceholder: '@username or Telegram number',
    emailLabel: 'Email',
    optionalTag: '(optional)',
    emailPlaceholder: 'you@example.com',
    serviceLabel: 'Select a Service',
    serviceOptions: {
      passport: 'Passport Appointment Assistance',
      application: 'Application & Digital Assistance',
      flight: 'Flight/Ticket Assistance',
    },
    passportBoxTitle: 'Passport Assistance Details',
    passportHelpLabel: 'What do you need help with?',
    passportHelpPlaceholder: 'e.g. Booking an appointment, filling online forms, understanding steps',
    passportLocationLabel: 'Current location',
    passportLocationPlaceholder: 'City or region where you are currently located',
    passportProblemLabel: 'Description of the problem',
    passportProblemPlaceholder: 'Describe what you have tried and where you are stuck',
    appBoxTitle: 'Application & Digital Assistance Details',
    platformLabel: 'Name of the application/platform',
    platformPlaceholder: 'University portal, scholarship, online form, etc.',
    deadlineLabel: 'Deadline, if applicable',
    deadlinePlaceholder: 'e.g. December 15, 2026 or None',
    tryingToDoLabel: 'What are you trying to do?',
    tryingToDoPlaceholder: 'e.g. Complete an application, upload documents, modify details, submit',
    digitalProblemLabel: 'What problem are you experiencing?',
    digitalProblemPlaceholder: 'Share any error messages, upload issues, account hurdles, or unclear steps',
    optionalDescLabel: 'Optional description',
    optionalDescPlaceholder: 'Any extra context that helps us understand your request',
    flightBoxTitle: 'Flight & Ticket Assistance Details',
    departureCityLabel: 'Departure city/country',
    departureCityPlaceholder: 'e.g. Addis Ababa, Ethiopia',
    destinationLabel: 'Destination',
    destinationPlaceholder: 'Destination city or country',
    departureDateLabel: 'Departure date',
    returnDateLabel: 'Return date (if applicable)',
    tripTypeLabel: 'One-way or round trip',
    oneWayLabel: 'One-way',
    roundTripLabel: 'Round trip',
    passengersLabel: 'Number of passengers',
    travelClassLabel: 'Preferred travel class',
    moreDetailsLabel: 'Tell us more about what you need:',
    moreDetailsPlaceholder: 'Share any useful context so we can review your request clearly',
    paymentBoxTitle: 'Pay 200 ETB Before We Contact You',
    paymentBoxSubtext:
      'After entering your details and before we contact you, send 200 ETB to telebirr or CBE, then enter your transaction reference number or attach a payment screenshot.',
    telebirrLabel: 'telebirr',
    cbeLabel: 'CBE Account',
    copyBtn: 'Copy',
    copiedBtn: 'Copied',
    paymentMethodLabel: 'Payment Method Used',
    paymentRefLabel: 'Transaction Reference Number',
    paymentRefPlaceholder: 'Enter payment reference number',
    paymentScreenshotLabel: 'Payment Screenshot',
    paymentScreenshotHint: 'Upload JPG, PNG, or WEBP (provide a reference number, a screenshot, or both)',
    submitBtn: 'Submit Request & Payment Proof',
    submittingBtn: 'Submitting...',
    errName: 'Please enter your full name.',
    errPhone: 'Please enter a valid phone number.',
    errTelegram: 'Please enter your Telegram username or contact.',
    errEmail: 'Please enter a valid email address or leave it blank.',
    errPassportHelp: 'Please specify what you need help with for your passport request.',
    errPassportLocation: 'Please enter your current location.',
    errPassportProblem: 'Please describe the passport problem or situation.',
    errPlatform: 'Please enter the name of the application or platform.',
    errTryingToDo: 'Please state what you are trying to do.',
    errDigitalProblem: 'Please describe the problem you are experiencing.',
    errDepartureCity: 'Please enter your departure city or country.',
    errDestination: 'Please enter your destination.',
    errDepartureDate: 'Please enter your preferred departure date.',
    errReturnDate: 'Please enter a return date for a round trip or switch to One-way.',
    errPassengers: 'Please enter at least 1 passenger.',
    errPaymentProof: 'Please enter a 200 ETB payment reference number or upload a payment screenshot.',
    errSave: 'Could not submit your request right now: ',
  },
  ti: {
    successTitle: 'ሕቶ ኣገልግሎትን መረጋገጺ ክፍሊት 200 ብርን በጺሑና ኣሎ',
    successBodyStart: 'የቐንየልና፣ ',
    successBodyMid: '። ን',
    successBodyEnd:
      ' ዝኣተወ ሕቶ ተመዝጊቡ ኣሎ። ናይ 200 ብር ክፍሊት ሪፈረንስ ወይ ስክሪንሾት ኣረጋጊጽና ምስ ወዳእና ክንረኽበኩም ኢና።',
    fullNameLabel: 'ምሉእ ስም',
    fullNamePlaceholder: 'ምሉእ ስምኩም ኣእትዉ',
    phoneLabel: 'ቁጽሪ ስልኪ',
    phonePlaceholder: 'ንኣብነት 0985076136 ወይ +2519...',
    telegramLabel: 'ስም ወይ ቁጽሪ ቴሌግራም',
    telegramPlaceholder: '@username ወይ ቁጽሪ ቴሌግራም',
    emailLabel: 'ኢሜይል',
    optionalTag: '(ኣማራጺ)',
    emailPlaceholder: 'you@example.com',
    serviceLabel: 'ኣገልግሎት ምረጹ',
    serviceOptions: {
      passport: 'ናይ ቆጸራ ፓስፖርት ሓገዝ',
      application: 'ናይ መመልከቲን ዲጂታላዊን ሓገዝ',
      flight: 'ናይ በረራን ትኬትን ሓገዝ',
    },
    passportBoxTitle: 'ዝርዝር ናይ ቆጸራ ፓስፖርት ሓገዝ',
    passportHelpLabel: 'እንታይ ሓገዝ የድልየኩም?',
    passportHelpPlaceholder: 'ንኣብነት ቆጸራ ምሓዝ፣ ቅጥዒ ምምላእ፣ መምርሒ መስርሕ',
    passportLocationLabel: 'ሕጂ ዘለኹምሉ ቦታ',
    passportLocationPlaceholder: 'ከተማ ወይ ክልል',
    passportProblemLabel: 'ዝርዝር መግለጺ ጸገም',
    passportProblemPlaceholder: 'እንታይ ከም ዝፈተንኩምን ኣበይ ከም ዝተጸገምኩምን ግለጹ',
    appBoxTitle: 'ዝርዝር ናይ መመልከቲን ዲጂታላዊን ሓገዝ',
    platformLabel: 'ስም መድረኽ ወይ መመልከቲ',
    platformPlaceholder: 'ዩኒቨርሲቲ፣ ስኮላርሺፕ፣ ናይ ኦንላይን ቅጥዒ ወዘተ',
    deadlineLabel: 'ናይ መወዳእታ ዕለት (እንተሃልዩ)',
    deadlinePlaceholder: 'ንኣብነት ታሕሳስ 15 ወይ የብሉን',
    tryingToDoLabel: 'እንታይ ክትገብሩ ትደልዩ ኣለኹም?',
    tryingToDoPlaceholder: 'ንኣብነት መመልከቲ ምምላእ፣ ሰነድ ምጽዓን፣ ምዕራይ፣ ምስዳድ',
    digitalProblemLabel: 'እንታይ ጸገም የጋጥመኩም ኣሎ?',
    digitalProblemPlaceholder: 'ዘጸገመኩም ስጉምቲ ወይ መልእኽቲ ብንጹር ጽሓፉ',
    optionalDescLabel: 'ተወሳኺ መግለጺ (ኣማራጺ)',
    optionalDescPlaceholder: 'ሕቶኹም ንምርዳእ ዝሕግዝ ተወሳኺ ሓሳብ',
    flightBoxTitle: 'ዝርዝር ናይ በረራን ትኬትን ሓገዝ',
    departureCityLabel: 'መበገሲ ከተማ / ሃገር',
    departureCityPlaceholder: 'ንኣብነት ኣዲስ ኣበባ፣ ኢትዮጵያ',
    destinationLabel: 'መዕለቢ ከተማ / ሃገር',
    destinationPlaceholder: 'ትኸዱሉ ቦታ ኣእትዉ',
    departureDateLabel: 'ዕለት መበገሲ',
    returnDateLabel: 'ዕለት መመለሲ (ክድድ ዝኸውን እንተኾይኑ)',
    tripTypeLabel: 'ዓይነት ጉዕዞ',
    oneWayLabel: 'ሓደ መንገዲ (One-way)',
    roundTripLabel: 'ክድድ (Round trip)',
    passengersLabel: 'ብዝሒ ተጓዓዝቲ',
    travelClassLabel: 'ዝደልይዎ ክፍሊ (Class)',
    moreDetailsLabel: 'ብዛዕባ እትደልይዎ ሓገዝ ተወሳኺ ጽሓፉ፡',
    moreDetailsPlaceholder: 'ጠቓሚ ዝርዝር እንተሃልዩ ኣብዚ ኣእትዉ',
    paymentBoxTitle: 'ቅድሚ ምርኻብና ናይ 200 ብር ክፍሊት ይፈጽሙ',
    paymentBoxSubtext:
      'ሓበሬታኹም ድሕሪ ምምላእን ቅድሚ ምርኻብናን 200 ብር ብቴሌብር ወይ ብCBE ይኽፈሉ፤ ድሕሪኡ ቁጽሪ ሪፈረንስ ኣእትዉ ወይ ስክሪንሾት ኣልግቡ።',
    telebirrLabel: 'ቴሌብር (telebirr)',
    cbeLabel: 'ንግዲ ባንክ ኢትዮጵያ (CBE)',
    copyBtn: 'ቅዳሕ',
    copiedBtn: 'ተቐዲሑ',
    paymentMethodLabel: 'ዝተጠቐምኩምሉ መንገዲ ክፍሊት',
    paymentRefLabel: 'ቁጽሪ ሪፈረንስ ክፍሊት (Reference Number)',
    paymentRefPlaceholder: 'ቁጽሪ ሪፈረንስ ክፍሊት ኣእትዉ',
    paymentScreenshotLabel: 'ስክሪንሾት ክፍሊት ኣልግቡ',
    paymentScreenshotHint: 'JPG, PNG ወይ WEBP ስእሊ ምረጹ (ቁጽሪ ሪፈረንስ እንተኣእቲኹም ወይ ስክሪንሾት እንተኣልጊብኩም ይኣክል)',
    submitBtn: 'ሕቶን መረጋገጺ ክፍሊትን ስደድ',
    submittingBtn: 'ይስደድ ኣሎ...',
    errName: 'በጃኹም ምሉእ ስምኩም ኣእትዉ።',
    errPhone: 'በጃኹም ሕጋዊ ቁጽሪ ስልኪ ኣእትዉ።',
    errTelegram: 'በጃኹም ስም ወይ ቁጽሪ ቴሌግራም ኣእትዉ።',
    errEmail: 'በጃኹም ሕጋዊ ኢሜይል ኣእትዉ ወይ ባዶ ግደፍዎ።',
    errPassportHelp: 'ኣብ ጉዳይ ፓስፖርት እንታይ ሓገዝ ከም ዘድልየኩም ግለጹ።',
    errPassportLocation: 'በጃኹም ሕጂ ዘለኹምሉ ቦታ ኣእትዉ።',
    errPassportProblem: 'በጃኹም ዘጋጠመኩም ጸገም ፓስፖርት ግለጹ።',
    errPlatform: 'በጃኹም ስም መመልከቲ ወይ መድረኽ ኣእትዉ።',
    errTryingToDo: 'በጃኹም እንታይ ክትገብሩ ከም እትደልዩ ግለጹ።',
    errDigitalProblem: 'በጃኹም ዘጋጠመኩም ጸገም ግለጹ።',
    errDepartureCity: 'በጃኹም መበገሲ ከተማ ወይ ሃገር ኣእትዉ።',
    errDestination: 'በጃኹም መዕለቢ ኣእትዉ።',
    errDepartureDate: 'በጃኹም ዕለት መበገሲ ምረጹ።',
    errReturnDate: 'ንክድድ ዕለት መመለሲ ኣእትዉ ወይ ሓደ መንገዲ ምረጹ።',
    errPassengers: 'እንተወሓደ 1 ተጓዓዛይ ኣእትዉ።',
    errPaymentProof: 'በጃኹም ቁጽሪ ሪፈረንስ ክፍሊት 200 ብር ኣእትዉ ወይ ስክሪንሾት ክፍሊት ኣልግቡ።',
    errSave: 'ሕቶኹም ምዕቃብ ኣይተኻእለን፡ ',
  },
  om: {
    successTitle: 'Gaaffii Tajaajilaa fi Ragaa Kaffaltii Birrii 200 Argameera',
    successBodyStart: 'Galatoomaa, ',
    successBodyMid: '። Gaaffiin keessan kan ',
    successBodyEnd:
      ' galmaa’eera. Lakkoofsa riifeerensii yookaan suuraa iskiriinii (screenshot) kaffaltii Birrii 200 erga mirkaneessinee booda isin quunnamna.',
    fullNameLabel: 'Maqaa Guutuu',
    fullNamePlaceholder: 'Maqaa guutuu keessan galchaa',
    phoneLabel: 'Lakkoofsa Bilbilaa',
    phonePlaceholder: 'fkn 0985076136 yookaan +2519...',
    telegramLabel: 'Maqaa Telegraamii yookaan Lakkoofsa',
    telegramPlaceholder: '@username yookaan bilbila Telegraamii',
    emailLabel: 'Imeeyilii',
    optionalTag: '(dirqama miti)',
    emailPlaceholder: 'you@example.com',
    serviceLabel: 'Tajaajila Filadhaa',
    serviceOptions: {
      passport: 'Deeggarsa Bellama Paaspoortii',
      application: 'Deeggarsa Iyyannoo fi Dijitaalaa',
      flight: 'Deeggarsa Balalii fi Tikkeetii',
    },
    passportBoxTitle: 'Bal’ina Deeggarsa Paaspoortii',
    passportHelpLabel: 'Waa’ee maalii irratti gargaarsa barbaaddu?',
    passportHelpPlaceholder: 'fkn bellama qabachuu, unkaa guutuu, qajeelfama adeemsaa',
    passportLocationLabel: 'Bakka amma jirtan',
    passportLocationPlaceholder: 'Magaalaa yookaan naannoo',
    passportProblemLabel: 'Ibsa rakkinichaa',
    passportProblemPlaceholder: 'Maal akka yaaltanii fi eessatti akka rakkattan ibsaa',
    appBoxTitle: 'Bal’ina Deeggarsa Iyyannoo fi Dijitaalaa',
    platformLabel: 'Maqaa waltajjii yookaan iyyannoo',
    platformPlaceholder: 'Yuunivarsiitii, iskoolaarshiippii, unkaa toora interneetii kkf',
    deadlineLabel: 'Guyyaa dhumaa (yoo jiraate)',
    deadlinePlaceholder: 'fkn Muddee 15 yookaan Hin qabu',
    tryingToDoLabel: 'Maal gochuu barbaaddu?',
    tryingToDoPlaceholder: 'fkn iyyannoo guutuu, sanada ol-fe’uu, sirreessuu, erguu',
    digitalProblemLabel: 'Rakkoo akkamiitu isin mudachaa jira?',
    digitalProblemPlaceholder: 'Bakka isin rakkise yookaan ergaa dogoggoraa ifatti ibsaa',
    optionalDescLabel: 'Ibsa dabalataa (dirqama miti)',
    optionalDescPlaceholder: 'Gaaffii keessan hubachuuf odeeffannoo dabalataa',
    flightBoxTitle: 'Bal’ina Deeggarsa Balalii fi Tikkeetii',
    departureCityLabel: 'Magaalaa / Biyya ka’umsaa',
    departureCityPlaceholder: 'fkn Finfinnee, Itoophiyaa',
    destinationLabel: 'Bakka gahumsaa',
    destinationPlaceholder: 'Magaalaa yookaan biyya itti deemtan',
    departureDateLabel: 'Guyyaa ka’umsaa',
    returnDateLabel: 'Guyyaa deebi’umsaa (deebi’aa yoo ta’e)',
    tripTypeLabel: 'Gosa imalaa',
    oneWayLabel: 'Karaa tokko (One-way)',
    roundTripLabel: 'Deebi’aa (Round trip)',
    passengersLabel: 'Baay’ina imaltootaa',
    travelClassLabel: 'Gosa tajaajilaa (Class)',
    moreDetailsLabel: 'Waa’ee gargaarsa barbaaddanii dabalataan barreessaa:',
    moreDetailsPlaceholder: 'Odeeffannoo gargaaru yoo qabaattan asitti galchaa',
    paymentBoxTitle: 'Osooo Isin Hin Quunnamin Dura Birrii 200 Kaffalaa',
    paymentBoxSubtext:
      'Odeeffannoo keessan erga guuttanii fi osoo isin hin quunnamin dura Birrii 200 telebirr yookaan CBEtti ergaa; sana booda lakkoofsa riifeerensii galchaa yookaan suuraa iskiriinii maxxansaa.',
    telebirrLabel: 'telebirr',
    cbeLabel: 'Baankii Daldala Itoophiyaa (CBE)',
    copyBtn: 'Garagalchi',
    copiedBtn: 'Garagalffameera',
    paymentMethodLabel: 'Mala Kaffaltii Fayyadamtan',
    paymentRefLabel: 'Lakkoofsa Riifeerensii Kaffaltii',
    paymentRefPlaceholder: 'Lakkoofsa riifeerensii kaffaltii galchaa',
    paymentScreenshotLabel: 'Suuraa Iskiriinii Kaffaltii (Screenshot)',
    paymentScreenshotHint: 'Suuraa JPG, PNG yookaan WEBP filadhaa (riifeerensii galchuun yookaan suuraa maxxansuun ni ga’a)',
    submitBtn: 'Gaaffii fi Ragaa Kaffaltii Ergi',
    submittingBtn: 'Ergaa jira...',
    errName: 'Maaloo maqaa guutuu keessan galchaa.',
    errPhone: 'Maaloo lakkoofsa bilbilaa sirrii galchaa.',
    errTelegram: 'Maaloo maqaa yookaan lakkoofsa Telegraamii galchaa.',
    errEmail: 'Maaloo imeeyilii sirrii galchaa yookaan duwwaa dhiisaa.',
    errPassportHelp: 'Dhimma paaspoortii irratti gargaarsa akkamii akka barbaaddan ibsaa.',
    errPassportLocation: 'Maaloo bakka amma jirtan galchaa.',
    errPassportProblem: 'Maaloo rakkoo paaspoortii isin mudate ibsaa.',
    errPlatform: 'Maaloo maqaa iyyannoo yookaan waltajjii galchaa.',
    errTryingToDo: 'Maaloo maal gochuu akka barbaaddan ibsaa.',
    errDigitalProblem: 'Maaloo rakkoo isin mudate ibsaa.',
    errDepartureCity: 'Maaloo magaalaa yookaan biyya ka’umsaa galchaa.',
    errDestination: 'Maaloo bakka gahumsaa galchaa.',
    errDepartureDate: 'Maaloo guyyaa ka’umsaa filadhaa.',
    errReturnDate: 'Imala deebi’aatiif guyyaa deebi’umsaa galchaa yookaan karaa tokko filadhaa.',
    errPassengers: 'Imalaa 1 yoo xiqqaate galchaa.',
    errPaymentProof: 'Maaloo lakkoofsa riifeerensii kaffaltii Birrii 200 galchaa yookaan suuraa iskiriinii kaffaltii maxxansaa.',
    errSave: 'Gaaffii keessan galchuu hin dandeenye: ',
  },
};

export default function ServiceRequestForm({
  initialService = 'application',
  lang = 'am',
  onSuccess,
}: ServiceRequestFormProps) {
  const f = FORM_COPY[lang];

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [telegramContact, setTelegramContact] = useState('');
  const [email, setEmail] = useState('');
  const [selectedService, setSelectedService] = useState<ServiceKey>(initialService);

  const [passportHelpWith, setPassportHelpWith] = useState('');
  const [passportLocation, setPassportLocation] = useState('');
  const [passportProblem, setPassportProblem] = useState('');

  const [platformName, setPlatformName] = useState('');
  const [tryingToDo, setTryingToDo] = useState('');
  const [digitalProblem, setDigitalProblem] = useState('');
  const [deadline, setDeadline] = useState('');
  const [optionalDescription, setOptionalDescription] = useState('');

  const [departureCity, setDepartureCity] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [tripType, setTripType] = useState<'One-way' | 'Round trip'>('One-way');
  const [passengers, setPassengers] = useState('1');
  const [travelClass, setTravelClass] = useState('Economy');

  const [moreDetails, setMoreDetails] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<'telebirr' | 'CBE'>('telebirr');
  const [paymentReference, setPaymentReference] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [copiedAcc, setCopiedAcc] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedSummary, setSubmittedSummary] = useState<{
    fullName: string;
    serviceLabel: string;
  } | null>(null);

  useEffect(() => {
    setSelectedService(initialService);
  }, [initialService]);

  const copyAccountValue = async (key: string, val: string) => {
    try {
      await navigator.clipboard.writeText(val);
      setCopiedAcc(key);
      setTimeout(() => setCopiedAcc(null), 2000);
    } catch {
      setCopiedAcc(null);
    }
  };

  const buildStructuredNotes = (): string => {
    const parts: string[] = [`Lang: ${lang.toUpperCase()}`, `Payment: 200 ETB via ${paymentMethod}`];
    if (paymentReference.trim()) parts.push(`Ref: ${paymentReference.trim()}`);
    if (telegramContact.trim()) parts.push(`Telegram: ${telegramContact.trim()}`);
    if (email.trim()) parts.push(`Email: ${email.trim()}`);

    if (selectedService === 'passport') {
      if (passportHelpWith.trim()) parts.push(`Passport Help: ${passportHelpWith.trim()}`);
      if (passportLocation.trim()) parts.push(`Location: ${passportLocation.trim()}`);
      if (passportProblem.trim()) parts.push(`Issue: ${passportProblem.trim()}`);
    } else if (selectedService === 'application') {
      if (platformName.trim()) parts.push(`Platform: ${platformName.trim()}`);
      if (tryingToDo.trim()) parts.push(`Goal: ${tryingToDo.trim()}`);
      if (digitalProblem.trim()) parts.push(`Problem: ${digitalProblem.trim()}`);
      if (deadline.trim()) parts.push(`Deadline: ${deadline.trim()}`);
      if (optionalDescription.trim()) parts.push(`Notes: ${optionalDescription.trim()}`);
    } else if (selectedService === 'flight') {
      if (departureCity.trim()) parts.push(`From: ${departureCity.trim()}`);
      if (destination.trim()) parts.push(`To: ${destination.trim()}`);
      if (departureDate.trim()) parts.push(`Depart: ${departureDate.trim()}`);
      if (tripType === 'Round trip' && returnDate.trim()) {
        parts.push(`Return: ${returnDate.trim()}`);
      }
      parts.push(`Trip: ${tripType}`);
      parts.push(`Pax: ${passengers.trim() || '1'}`);
      parts.push(`Class: ${travelClass}`);
    }

    if (moreDetails.trim()) {
      parts.push(`Details: ${moreDetails.trim()}`);
    }

    return parts.join(' | ');
  };

  const validateForm = (): string | null => {
    if (fullName.trim().length < 2) return f.errName;
    if (!phone.trim() || phone.trim().length < 7) return f.errPhone;
    if (!telegramContact.trim()) return f.errTelegram;
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return f.errEmail;

    if (selectedService === 'passport') {
      if (!passportHelpWith.trim()) return f.errPassportHelp;
      if (!passportLocation.trim()) return f.errPassportLocation;
      if (!passportProblem.trim()) return f.errPassportProblem;
    } else if (selectedService === 'application') {
      if (!platformName.trim()) return f.errPlatform;
      if (!tryingToDo.trim()) return f.errTryingToDo;
      if (!digitalProblem.trim()) return f.errDigitalProblem;
    } else if (selectedService === 'flight') {
      if (!departureCity.trim()) return f.errDepartureCity;
      if (!destination.trim()) return f.errDestination;
      if (!departureDate.trim()) return f.errDepartureDate;
      if (tripType === 'Round trip' && !returnDate.trim()) return f.errReturnDate;
      const paxCount = Number(passengers);
      if (!Number.isFinite(paxCount) || paxCount < 1) return f.errPassengers;
    }

    if (!paymentReference.trim() && !screenshotFile) {
      return f.errPaymentProof;
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const validationError = validateForm();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setSubmitting(true);
    let screenshotUrl: string | null = null;

    if (screenshotFile) {
      const ext = screenshotFile.name.split('.').pop()?.toLowerCase() || 'png';
      const filePath = `proofs/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(filePath, screenshotFile, { cacheControl: '3600', upsert: false });

      if (!uploadError) {
        const { data: pubData } = supabase.storage.from('payment-proofs').getPublicUrl(filePath);
        screenshotUrl = pubData.publicUrl;
      }
    }

    const serviceLabel = f.serviceOptions[selectedService];
    const summaryText = buildStructuredNotes();

    const fullPayload = {
      full_name: fullName.trim(),
      phone: phone.trim(),
      selected_service: serviceLabel,
      tx_ref: paymentReference.trim() || summaryText.slice(0, 480),
      payment_method: paymentMethod,
      payment_reference: paymentReference.trim() || null,
      payment_screenshot_url: screenshotUrl,
      payment_status: 'pending_verification',
    };

    let { error } = await supabase.from('bookings').insert([fullPayload]);

    if (error) {
      const fallbackSummary = screenshotUrl ? `${summaryText} | Screenshot: ${screenshotUrl}` : summaryText;
      const retry = await supabase.from('bookings').insert([
        {
          full_name: fullName.trim(),
          phone: phone.trim(),
          selected_service: serviceLabel,
          tx_ref: fallbackSummary.slice(0, 480),
        },
      ]);
      error = retry.error;
    }

    setSubmitting(false);

    if (error) {
      setErrorMsg(f.errSave + error.message);
      return;
    }

    setSubmittedSummary({
      fullName: fullName.trim(),
      serviceLabel,
    });

    setFullName('');
    setPhone('');
    setTelegramContact('');
    setEmail('');
    setPassportHelpWith('');
    setPassportLocation('');
    setPassportProblem('');
    setPlatformName('');
    setTryingToDo('');
    setDigitalProblem('');
    setDeadline('');
    setOptionalDescription('');
    setDepartureCity('');
    setDestination('');
    setDepartureDate('');
    setReturnDate('');
    setTripType('One-way');
    setPassengers('1');
    setTravelClass('Economy');
    setMoreDetails('');
    setPaymentReference('');
    setScreenshotFile(null);

    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="space-y-4">
      {submittedSummary && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-emerald-100 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-emerald-300">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{f.successTitle}</span>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-emerald-100/95">
            {f.successBodyStart}
            <span className="font-semibold">{submittedSummary.fullName}</span>
            {f.successBodyMid}
            <span className="font-semibold">{submittedSummary.serviceLabel}</span>
            {f.successBodyEnd}
          </p>
        </div>
      )}

      {errorMsg && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3.5 text-xs text-red-200 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {f.fullNameLabel} <span className="text-blue-400">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={f.fullNamePlaceholder}
              required
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {f.phoneLabel} <span className="text-blue-400">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={f.phonePlaceholder}
              required
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {f.telegramLabel} <span className="text-blue-400">*</span>
            </label>
            <input
              type="text"
              value={telegramContact}
              onChange={(e) => setTelegramContact(e.target.value)}
              placeholder={f.telegramPlaceholder}
              required
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {f.emailLabel} <span className="text-slate-500 font-normal">{f.optionalTag}</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={f.emailPlaceholder}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            {f.serviceLabel} <span className="text-blue-400">*</span>
          </label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value as ServiceKey)}
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
          >
            <option value="passport">{f.serviceOptions.passport}</option>
            <option value="application">{f.serviceOptions.application}</option>
            <option value="flight">{f.serviceOptions.flight}</option>
          </select>
        </div>

        {selectedService === 'passport' && (
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3.5">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-400">{f.passportBoxTitle}</p>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {f.passportHelpLabel} <span className="text-blue-400">*</span>
              </label>
              <input
                type="text"
                value={passportHelpWith}
                onChange={(e) => setPassportHelpWith(e.target.value)}
                placeholder={f.passportHelpPlaceholder}
                required
                className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {f.passportLocationLabel} <span className="text-blue-400">*</span>
              </label>
              <input
                type="text"
                value={passportLocation}
                onChange={(e) => setPassportLocation(e.target.value)}
                placeholder={f.passportLocationPlaceholder}
                required
                className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {f.passportProblemLabel} <span className="text-blue-400">*</span>
              </label>
              <textarea
                rows={2}
                value={passportProblem}
                onChange={(e) => setPassportProblem(e.target.value)}
                placeholder={f.passportProblemPlaceholder}
                required
                className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {selectedService === 'application' && (
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3.5">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-400">{f.appBoxTitle}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {f.platformLabel} <span className="text-blue-400">*</span>
                </label>
                <input
                  type="text"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  placeholder={f.platformPlaceholder}
                  required
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{f.deadlineLabel}</label>
                <input
                  type="text"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  placeholder={f.deadlinePlaceholder}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {f.tryingToDoLabel} <span className="text-blue-400">*</span>
              </label>
              <input
                type="text"
                value={tryingToDo}
                onChange={(e) => setTryingToDo(e.target.value)}
                placeholder={f.tryingToDoPlaceholder}
                required
                className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {f.digitalProblemLabel} <span className="text-blue-400">*</span>
              </label>
              <textarea
                rows={2}
                value={digitalProblem}
                onChange={(e) => setDigitalProblem(e.target.value)}
                placeholder={f.digitalProblemPlaceholder}
                required
                className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{f.optionalDescLabel}</label>
              <input
                type="text"
                value={optionalDescription}
                onChange={(e) => setOptionalDescription(e.target.value)}
                placeholder={f.optionalDescPlaceholder}
                className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {selectedService === 'flight' && (
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3.5">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-400">{f.flightBoxTitle}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {f.departureCityLabel} <span className="text-blue-400">*</span>
                </label>
                <input
                  type="text"
                  value={departureCity}
                  onChange={(e) => setDepartureCity(e.target.value)}
                  placeholder={f.departureCityPlaceholder}
                  required
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {f.destinationLabel} <span className="text-blue-400">*</span>
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder={f.destinationPlaceholder}
                  required
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {f.departureDateLabel} <span className="text-blue-400">*</span>
                </label>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  required
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{f.returnDateLabel}</label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  disabled={tripType === 'One-way'}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2 text-sm text-white disabled:opacity-40 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{f.tripTypeLabel}</label>
                <select
                  value={tripType}
                  onChange={(e) => setTripType(e.target.value as 'One-way' | 'Round trip')}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="One-way">{f.oneWayLabel}</option>
                  <option value="Round trip">{f.roundTripLabel}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{f.passengersLabel}</label>
                <input
                  type="number"
                  min={1}
                  value={passengers}
                  onChange={(e) => setPassengers(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{f.travelClassLabel}</label>
                <select
                  value={travelClass}
                  onChange={(e) => setTravelClass(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Economy">Economy</option>
                  <option value="Premium Economy">Premium Economy</option>
                  <option value="Business">Business</option>
                  <option value="First">First</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">{f.moreDetailsLabel}</label>
          <textarea
            rows={2}
            value={moreDetails}
            onChange={(e) => setMoreDetails(e.target.value)}
            placeholder={f.moreDetailsPlaceholder}
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* 200 ETB PAYMENT BEFORE CONTACT */}
        <div className="rounded-2xl border border-blue-500/40 bg-blue-950/25 p-4 sm:p-5 space-y-4">
          <div className="space-y-1">
            <h4 className="text-sm font-extrabold text-blue-300">{f.paymentBoxTitle}</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{f.paymentBoxSubtext}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 flex items-center justify-between gap-2">
              <div>
                <p className="text-[11px] font-semibold text-slate-400">{f.telebirrLabel}</p>
                <p className="text-sm font-extrabold text-white">{TELEBIRR_NUMBER}</p>
              </div>
              <button
                type="button"
                onClick={() => copyAccountValue('telebirr', TELEBIRR_NUMBER)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white inline-flex items-center gap-1 cursor-pointer"
              >
                {copiedAcc === 'telebirr' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{f.copiedBtn}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{f.copyBtn}</span>
                  </>
                )}
              </button>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 flex items-center justify-between gap-2">
              <div>
                <p className="text-[11px] font-semibold text-slate-400">{f.cbeLabel}</p>
                <p className="text-sm font-extrabold text-white">{CBE_ACCOUNT}</p>
              </div>
              <button
                type="button"
                onClick={() => copyAccountValue('cbe', CBE_ACCOUNT)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white inline-flex items-center gap-1 cursor-pointer"
              >
                {copiedAcc === 'cbe' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{f.copiedBtn}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{f.copyBtn}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{f.paymentMethodLabel}</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as 'telebirr' | 'CBE')}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="telebirr">telebirr ({TELEBIRR_NUMBER})</option>
                <option value="CBE">CBE ({CBE_ACCOUNT})</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{f.paymentRefLabel}</label>
              <input
                type="text"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                placeholder={f.paymentRefPlaceholder}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{f.paymentScreenshotLabel}</label>
            <label className="flex items-center gap-2.5 rounded-xl border border-dashed border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-slate-300 hover:border-blue-500 cursor-pointer transition">
              <Upload className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="truncate">
                {screenshotFile ? screenshotFile.name : f.paymentScreenshotHint}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setScreenshotFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold text-sm inline-flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>{submitting ? f.submittingBtn : f.submitBtn}</span>
        </button>
      </form>
    </div>
  );
}