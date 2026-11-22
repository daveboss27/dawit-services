export type ServiceKey = 'passport' | 'application' | 'flight';

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
    detail: 'We communicate with you and agree on the scope of the service, responsibilities, price, and expected timeline.',
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
    answer:
      'If we do not reach an agreement during the initial negotiation.',
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