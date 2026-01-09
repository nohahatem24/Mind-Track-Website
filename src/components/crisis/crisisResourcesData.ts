/**
 * Comprehensive Global Crisis Resources Database
 * Organized by country and region with multilingual support
 */

export interface HelplineContact {
  name: string;
  phone?: string;
  phone2?: string;
  text?: string;
  chat?: string;
  email?: string;
  description: string;
  available: string;
  languages?: string[];
  arabicName?: string;
  arabicDescription?: string;
}

export interface CountryResource {
  countryCode: string;
  country: string;
  emoji: string;
  emergencyNumbers: {
    emergency?: string;
    ambulance?: string;
    police?: string;
  };
  helplines: HelplineContact[];
  websiteResources?: Array<{
    name: string;
    url: string;
    description: string;
  }>;
  region: string;
  rtl?: boolean; // Right-to-left for Arabic
}

export interface WorldwideResource {
  id: string;
  name: string;
  description: string;
  phone?: string;
  text?: string;
  email?: string;
  chat?: string;
  url?: string;
  languages: string[];
  available: string;
  icon: string;
}

// WORLDWIDE RESOURCES (Show to all users)
export const worldwideResources: WorldwideResource[] = [
  {
    id: 'crisis-text-line-worldwide',
    name: 'Crisis Text Line (Multiple Countries)',
    description: 'Text "HELLO" to reach crisis counselors',
    text: 'Varies by country',
    available: '24/7',
    languages: ['en', 'es', 'fr', 'ar'],
    icon: 'MessageCircle',
  },
  {
    id: 'iasp',
    name: 'International Association for Suicide Prevention',
    description: 'Find crisis centers worldwide',
    url: 'https://www.iasp.info/resources',
    available: 'Online resource',
    languages: ['en'],
    icon: 'Globe',
  },
  {
    id: 'befrienders',
    name: 'Befrienders Worldwide',
    description: 'Emotional support in 32 countries',
    url: 'https://befrienders.org',
    available: 'Contact varies by location',
    languages: ['en', 'es', 'fr', 'de'],
    icon: 'Heart',
  },
  {
    id: 'samaritans-email',
    name: 'Samaritans (Email Support - Worldwide)',
    description: 'Confidential email support with response within 24 hours',
    email: 'jo@samaritans.org',
    available: '24/7',
    languages: ['en'],
    icon: 'Mail',
  },
];

// CRISIS RESOURCES BY COUNTRY
export const countryResources: Record<string, CountryResource> = {
  US: {
    countryCode: 'US',
    country: 'United States',
    emoji: '🇺🇸',
    region: 'North America',
    emergencyNumbers: {
      emergency: '911',
      ambulance: '911',
      police: '911',
    },
    helplines: [
      {
        name: '988 Suicide & Crisis Lifeline',
        phone: '988',
        text: '741741',
        chat: '988lifeline.org',
        description: 'Free, confidential support 24/7. En Español disponible.',
        available: '24/7',
        languages: ['en', 'es'],
      },
      {
        name: 'Crisis Text Line',
        text: '741741',
        description: 'Text-based crisis support 24/7',
        available: '24/7',
        languages: ['en', 'es'],
      },
      {
        name: 'The Trevor Project (LGBTQ+ Youth Under 25)',
        phone: '1-866-488-7386',
        text: '678-678',
        chat: 'thetrevorproject.org/get-help',
        description: 'Support for LGBTQ+ young people in crisis',
        available: '24/7',
        languages: ['en', 'es'],
      },
      {
        name: 'SAMHSA National Helpline',
        phone: '1-800-662-4357',
        description: 'Substance abuse & mental health treatment referral',
        available: '24/7',
        languages: ['en', 'es', 'multilingual'],
      },
      {
        name: 'NAMI HelpLine',
        phone: '1-800-950-6264',
        text: '741741',
        description: 'Mental health support and resources',
        available: 'Mon-Fri 10am-10pm ET',
        languages: ['en'],
      },
      {
        name: 'Veterans Crisis Line',
        phone: '988 then press 1',
        text: '838255',
        chat: 'veteranscrisisline.net',
        description: 'Crisis support for veterans & families',
        available: '24/7',
        languages: ['en'],
      },
      {
        name: 'National Domestic Violence Hotline',
        phone: '1-800-799-7233',
        text: '88788',
        description: 'Support for domestic violence survivors',
        available: '24/7',
        languages: ['en', 'es'],
      },
      {
        name: 'RAINN Sexual Assault Hotline',
        phone: '1-800-656-4673',
        chat: 'rainn.org',
        description: 'Support for sexual assault survivors',
        available: '24/7',
        languages: ['en', 'es'],
      },
      {
        name: 'Postpartum Support International',
        phone: '1-800-944-4773',
        description: 'Pregnancy & postpartum mental health support',
        available: '24/7',
        languages: ['en'],
      },
    ],
    websiteResources: [
      {
        name: 'Psychology Today Therapist Finder',
        url: 'https://www.psychologytoday.com',
        description: 'Search licensed therapists by location',
      },
      {
        name: 'SAMHSA Treatment Locator',
        url: 'https://findtreatment.gov',
        description: 'Find mental health treatment facilities',
      },
    ],
  },

  GB: {
    countryCode: 'GB',
    country: 'United Kingdom',
    emoji: '🇬🇧',
    region: 'Europe',
    emergencyNumbers: {
      emergency: '999',
      ambulance: '999',
    },
    helplines: [
      {
        name: 'Samaritans',
        phone: '116123',
        email: 'jo@samaritans.org',
        description: 'Free, confidential emotional support 24/7',
        available: '24/7',
        languages: ['en'],
      },
      {
        name: 'Shout Crisis Text Line',
        text: '85258',
        description: 'Text-based crisis support',
        available: '24/7',
        languages: ['en'],
      },
      {
        name: 'NHS Mental Health Crisis Line',
        phone: '111',
        description: 'NHS mental health support (select option 2)',
        available: '24/7',
        languages: ['en'],
      },
      {
        name: 'CALM (Campaign Against Living Miserably)',
        phone: '0800585858',
        chat: 'thecalmzone.net',
        description: 'Support for men in crisis',
        available: 'Daily 5pm-midnight',
        languages: ['en'],
      },
      {
        name: 'Mind Infoline',
        phone: '03001233393',
        text: '86463',
        description: 'Mental health information & support',
        available: 'Mon-Fri 9am-6pm',
        languages: ['en'],
      },
      {
        name: 'Papyrus HopelineUK (Under 35s)',
        phone: '0800068414',
        text: '07860039967',
        email: 'pat@papyrus-uk.org',
        description: 'Support for young people',
        available: 'Mon-Fri 9am-midnight, Weekends 2pm-midnight',
        languages: ['en'],
      },
    ],
  },

  CA: {
    countryCode: 'CA',
    country: 'Canada',
    emoji: '🇨🇦',
    region: 'North America',
    emergencyNumbers: {
      emergency: '911',
      ambulance: '911',
      police: '911',
    },
    helplines: [
      {
        name: 'Talk Suicide Canada',
        phone: '1-833-456-4566',
        text: '45645',
        description: 'Free, confidential crisis support. English & French.',
        available: '24/7 (Text: 4pm-midnight ET)',
        languages: ['en', 'fr'],
      },
      {
        name: 'Crisis Text Line Canada',
        text: '686868',
        description: 'Text "TALK" for crisis support',
        available: '24/7',
        languages: ['en', 'fr'],
      },
      {
        name: 'Wellness Together Canada',
        phone: '1-866-585-0445',
        chat: 'wellnesstogether.ca',
        description: 'Free mental health resources & counseling',
        available: '24/7',
        languages: ['en', 'fr'],
      },
      {
        name: 'Kids Help Phone',
        phone: '1-800-668-6868',
        text: '686868',
        description: 'Support for youth',
        available: '24/7',
        languages: ['en', 'fr'],
      },
    ],
  },

  AU: {
    countryCode: 'AU',
    country: 'Australia',
    emoji: '🇦🇺',
    region: 'Oceania',
    emergencyNumbers: {
      emergency: '000',
      ambulance: '000',
    },
    helplines: [
      {
        name: 'Lifeline Australia',
        phone: '131114',
        text: '0477131114',
        chat: 'lifeline.org.au/crisis-chat',
        description: 'Free, 24/7 crisis support',
        available: '24/7',
        languages: ['en'],
      },
      {
        name: 'Beyond Blue',
        phone: '1300224636',
        chat: 'beyondblue.org.au/getsupport',
        description: 'Mental health support & counseling',
        available: '24/7',
        languages: ['en'],
      },
      {
        name: 'Kids Helpline',
        phone: '1800551800',
        chat: 'kidshelpline.com.au',
        description: 'Support for ages 5-25',
        available: '24/7',
        languages: ['en'],
      },
      {
        name: '1800RESPECT (Domestic Violence)',
        phone: '1800737732',
        description: 'Domestic violence support',
        available: '24/7',
        languages: ['en'],
      },
    ],
  },

  NZ: {
    countryCode: 'NZ',
    country: 'New Zealand',
    emoji: '🇳🇿',
    region: 'Oceania',
    emergencyNumbers: {
      emergency: '111',
      ambulance: '111',
    },
    helplines: [
      {
        name: 'Lifeline Aotearoa',
        phone: '0800543354',
        text: '4357',
        description: 'Free crisis support 24/7',
        available: '24/7',
        languages: ['en', 'te'],
      },
      {
        name: 'Suicide Crisis Helpline',
        phone: '05088288865',
        description: 'Crisis support for suicidal thoughts',
        available: '24/7',
        languages: ['en'],
      },
      {
        name: 'Youthline',
        phone: '0800376633',
        text: '234',
        chat: 'youthline.co.nz',
        description: 'Support for young people',
        available: '24/7',
        languages: ['en'],
      },
      {
        name: '1737 Mental Health Support',
        phone: '1737',
        text: '1737',
        description: 'Free, confidential mental health support',
        available: '24/7',
        languages: ['en'],
      },
    ],
  },

  // EUROPE - Germany
  DE: {
    countryCode: 'DE',
    country: 'Germany',
    emoji: '🇩🇪',
    region: 'Europe',
    emergencyNumbers: {
      emergency: '112',
      ambulance: '112',
    },
    helplines: [
      {
        name: 'Telefonseelsorge',
        phone: '08001110111',
        phone2: '08001110222',
        chat: 'online.telefonseelsorge.de',
        description: 'Telephone counseling & crisis support',
        available: '24/7',
        languages: ['de'],
      },
    ],
  },

  // EUROPE - France
  FR: {
    countryCode: 'FR',
    country: 'France',
    emoji: '🇫🇷',
    region: 'Europe',
    emergencyNumbers: {
      emergency: '112',
      ambulance: '112',
    },
    helplines: [
      {
        name: 'Suicide Écoute',
        phone: '0145394000',
        description: 'Confidential suicide prevention support',
        available: '24/7',
        languages: ['fr'],
      },
      {
        name: 'SOS Amitié',
        phone: '0972394050',
        description: 'Emotional support & listening service',
        available: '24/7',
        languages: ['fr'],
      },
    ],
  },

  // EUROPE - Italy
  IT: {
    countryCode: 'IT',
    country: 'Italy',
    emoji: '🇮🇹',
    region: 'Europe',
    emergencyNumbers: {
      emergency: '112',
      ambulance: '112',
    },
    helplines: [
      {
        name: 'Telefono Amico Italia',
        phone: '0223272327',
        chat: 'telefonoamico.net',
        description: 'Friendship telephone & emotional support',
        available: 'Daily 10am-midnight',
        languages: ['it'],
      },
    ],
  },

  // EUROPE - Spain
  ES: {
    countryCode: 'ES',
    country: 'Spain',
    emoji: '🇪🇸',
    region: 'Europe',
    emergencyNumbers: {
      emergency: '112',
      ambulance: '112',
    },
    helplines: [
      {
        name: 'Teléfono de la Esperanza',
        phone: '717003717',
        description: 'Hope telephone - suicide prevention & counseling',
        available: '24/7',
        languages: ['es'],
      },
    ],
  },

  // EUROPE - Netherlands
  NL: {
    countryCode: 'NL',
    country: 'Netherlands',
    emoji: '🇳🇱',
    region: 'Europe',
    emergencyNumbers: {
      emergency: '112',
      ambulance: '112',
    },
    helplines: [
      {
        name: 'Stichting 113 Zelfmoordpreventie',
        phone: '113',
        chat: '113.nl',
        description: 'Suicide prevention & emotional support',
        available: '24/7',
        languages: ['nl'],
      },
    ],
  },

  // EUROPE - Belgium
  BE: {
    countryCode: 'BE',
    country: 'Belgium',
    emoji: '🇧🇪',
    region: 'Europe',
    emergencyNumbers: {
      emergency: '112',
      ambulance: '112',
    },
    helplines: [
      {
        name: 'Centre de Prévention du Suicide',
        phone: '0800032123',
        description: 'Suicide prevention support (French)',
        available: '24/7',
        languages: ['fr'],
      },
      {
        name: 'Zelfmoord 1813',
        phone: '1813',
        description: 'Suicide prevention support (Flemish)',
        available: '24/7',
        languages: ['nl'],
      },
    ],
  },

  // EUROPE - Sweden
  SE: {
    countryCode: 'SE',
    country: 'Sweden',
    emoji: '🇸🇪',
    region: 'Europe',
    emergencyNumbers: {
      emergency: '112',
      ambulance: '112',
    },
    helplines: [
      {
        name: 'Mind Självmordslinjen',
        phone: '90101',
        description: 'Suicide prevention helpline',
        available: '24/7',
        languages: ['sv'],
      },
    ],
  },

  // EUROPE - Norway
  NO: {
    countryCode: 'NO',
    country: 'Norway',
    emoji: '🇳🇴',
    region: 'Europe',
    emergencyNumbers: {
      emergency: '112',
      ambulance: '112',
    },
    helplines: [
      {
        name: 'Mental Helse',
        phone: '116123',
        description: 'Mental health & crisis support',
        available: '24/7',
        languages: ['no'],
      },
    ],
  },

  // EUROPE - Denmark
  DK: {
    countryCode: 'DK',
    country: 'Denmark',
    emoji: '🇩🇰',
    region: 'Europe',
    emergencyNumbers: {
      emergency: '112',
      ambulance: '112',
    },
    helplines: [
      {
        name: 'Livslinien',
        phone: '70201201',
        description: 'Suicide prevention helpline',
        available: '24/7',
        languages: ['da'],
      },
    ],
  },

  // EUROPE - Finland
  FI: {
    countryCode: 'FI',
    country: 'Finland',
    emoji: '🇫🇮',
    region: 'Europe',
    emergencyNumbers: {
      emergency: '112',
      ambulance: '112',
    },
    helplines: [
      {
        name: 'Suomen Mielenterveysseura Crisis Helpline',
        phone: '0925250111',
        description: 'Mental health crisis support',
        available: '24/7',
        languages: ['fi'],
      },
    ],
  },

  // EUROPE - Poland
  PL: {
    countryCode: 'PL',
    country: 'Poland',
    emoji: '🇵🇱',
    region: 'Europe',
    emergencyNumbers: {
      emergency: '112',
      ambulance: '112',
    },
    helplines: [
      {
        name: 'Telefon Zaufania dla Dzieci i Młodzieży',
        phone: '116111',
        description: 'Trust telephone for youth',
        available: '24/7',
        languages: ['pl'],
      },
    ],
  },

  // EUROPE - Greece
  GR: {
    countryCode: 'GR',
    country: 'Greece',
    emoji: '🇬🇷',
    region: 'Europe',
    emergencyNumbers: {
      emergency: '112',
      ambulance: '112',
    },
    helplines: [
      {
        name: 'Suicide Help Greece',
        phone: '1018',
        description: 'Suicide prevention support',
        available: '24/7',
        languages: ['el'],
      },
    ],
  },

  // EUROPE - Portugal
  PT: {
    countryCode: 'PT',
    country: 'Portugal',
    emoji: '🇵🇹',
    region: 'Europe',
    emergencyNumbers: {
      emergency: '112',
      ambulance: '112',
    },
    helplines: [
      {
        name: 'SOS Voz Amiga',
        phone: '213544545',
        phone2: '912802669',
        description: 'Friendly voice - emotional support',
        available: 'Daily 3pm-midnight',
        languages: ['pt'],
      },
    ],
  },

  // EUROPE - Ireland
  IE: {
    countryCode: 'IE',
    country: 'Ireland',
    emoji: '🇮🇪',
    region: 'Europe',
    emergencyNumbers: {
      emergency: '112',
      ambulance: '112',
    },
    helplines: [
      {
        name: 'Samaritans Ireland',
        phone: '116123',
        description: 'Free, confidential emotional support',
        available: '24/7',
        languages: ['en'],
      },
      {
        name: 'Pieta House',
        phone: '1800247247',
        description: 'Suicide & self-harm support',
        available: '24/7',
        languages: ['en'],
      },
    ],
  },

  // EUROPE - Switzerland
  CH: {
    countryCode: 'CH',
    country: 'Switzerland',
    emoji: '🇨🇭',
    region: 'Europe',
    emergencyNumbers: {
      emergency: '112',
      ambulance: '112',
    },
    helplines: [
      {
        name: 'Die Dargebotene Hand',
        phone: '143',
        description: 'The Helping Hand - crisis support',
        available: '24/7',
        languages: ['de', 'fr', 'it'],
      },
    ],
  },

  // EUROPE - Austria
  AT: {
    countryCode: 'AT',
    country: 'Austria',
    emoji: '🇦🇹',
    region: 'Europe',
    emergencyNumbers: {
      emergency: '112',
      ambulance: '112',
    },
    helplines: [
      {
        name: 'Telefonseelsorge Österreich',
        phone: '142',
        description: 'Telephone counseling & crisis support',
        available: '24/7',
        languages: ['de'],
      },
    ],
  },

  // MIDDLE EAST & NORTH AFRICA - Egypt
  EG: {
    countryCode: 'EG',
    country: 'Egypt',
    emoji: '🇪🇬',
    region: 'Middle East & North Africa',
    rtl: true,
    emergencyNumbers: {
      emergency: '122',
      ambulance: '122',
      police: '123',
    },
    helplines: [
      {
        name: 'Befrienders Egypt',
        phone: '0227622381',
        phone2: '0227622381',
        description: 'Emotional support & counseling',
        arabicName: 'بيفريندرز مصر',
        arabicDescription: 'خط مساعدة للدعم النفسي والاستشارة',
        available: 'Daily 8am-midnight',
        languages: ['ar', 'en'],
      },
      {
        name: 'Egyptian Psychiatric Association Hotline',
        phone: '0800200080',
        description: 'Free mental health support',
        arabicName: 'خط الجمعية المصرية للطب النفسي',
        arabicDescription: 'دعم نفسي مجاني',
        available: '24/7',
        languages: ['ar', 'en'],
      },
      {
        name: 'National Council for Mental Health',
        phone: '08008880700',
        description: 'Mental health crisis support',
        arabicName: 'المجلس القومي للصحة النفسية',
        arabicDescription: 'خدمات دعم الأزمات النفسية',
        available: '24/7',
        languages: ['ar', 'en'],
      },
    ],
  },

  // MIDDLE EAST - Saudi Arabia
  SA: {
    countryCode: 'SA',
    country: 'Saudi Arabia',
    emoji: '🇸🇦',
    region: 'Middle East & North Africa',
    rtl: true,
    emergencyNumbers: {
      emergency: '911',
      ambulance: '997',
      police: '911',
    },
    helplines: [
      {
        name: 'Ministry of Health Mental Health Hotline',
        phone: '920033360',
        description: 'Mental health support services',
        arabicName: 'خط وزارة الصحة للصحة النفسية',
        arabicDescription: 'خدمات الدعم النفسي',
        available: '24/7',
        languages: ['ar', 'en'],
      },
    ],
  },

  // MIDDLE EAST - UAE
  AE: {
    countryCode: 'AE',
    country: 'United Arab Emirates',
    emoji: '🇦🇪',
    region: 'Middle East & North Africa',
    rtl: true,
    emergencyNumbers: {
      emergency: '999',
      ambulance: '998',
    },
    helplines: [
      {
        name: 'Dubai Community Development Authority Hotline',
        phone: '8004888',
        description: 'Free mental health support',
        arabicName: 'هيئة تنمية المجتمع في دبي',
        arabicDescription: 'دعم نفسي مجاني',
        available: '24/7',
        languages: ['ar', 'en'],
      },
      {
        name: 'Lighthouse Arabia',
        phone: '+97143802088',
        description: 'Mental health clinic with crisis support',
        available: '24/7',
        languages: ['ar', 'en'],
      },
    ],
  },

  // MIDDLE EAST - Jordan
  JO: {
    countryCode: 'JO',
    country: 'Jordan',
    emoji: '🇯🇴',
    region: 'Middle East & North Africa',
    rtl: true,
    emergencyNumbers: {
      emergency: '911',
      ambulance: '911',
    },
    helplines: [
      {
        name: 'Jordan Crisis & Suicide Hotline',
        phone: '110',
        description: 'Free crisis support',
        arabicName: 'خط ساخن للأزمات والوقاية من الانتحار',
        arabicDescription: 'دعم الأزمات النفسية مجاني',
        available: '24/7',
        languages: ['ar', 'en'],
      },
    ],
  },

  // MIDDLE EAST - Lebanon
  LB: {
    countryCode: 'LB',
    country: 'Lebanon',
    emoji: '🇱🇧',
    region: 'Middle East & North Africa',
    rtl: true,
    emergencyNumbers: {
      emergency: '112',
      ambulance: '140',
    },
    helplines: [
      {
        name: 'Embrace Lebanon Lifeline',
        phone: '1564',
        description: 'Confidential psychological support',
        arabicName: 'خط دعم نفسي مجاني',
        arabicDescription: 'دعم نفسي مجاني وسري 24/7',
        available: '24/7',
        languages: ['ar', 'en'],
      },
    ],
  },

  // MIDDLE EAST - Palestine
  PS: {
    countryCode: 'PS',
    country: 'Palestine',
    emoji: '🇵🇸',
    region: 'Middle East & North Africa',
    rtl: true,
    emergencyNumbers: {
      emergency: '101',
      ambulance: '100',
      police: '101',
    },
    helplines: [
      {
        name: 'Palestinian Ministry of Health Mental Health Department',
        description: 'Mental health and psychosocial support',
        arabicName: 'قسم الصحة النفسية بوزارة الصحة الفلسطينية',
        arabicDescription: 'دعم نفسي واجتماعي',
        available: '24/7',
        languages: ['ar', 'en'],
      },
      {
        name: 'Gaza Community Mental Health Programme',
        phone: '+970828277743',
        description: 'Crisis intervention and mental health support',
        arabicName: 'برنامج غزة للصحة النفسية',
        arabicDescription: 'التدخل في الأزمات ودعم الصحة النفسية',
        available: '24/7',
        languages: ['ar', 'en'],
      },
      {
        name: 'Treatment and Rehabilitation Center for Victims of Torture (TRC)',
        phone: '+970229566446',
        description: 'Psychological support for trauma',
        arabicName: 'مركز علاج وتأهيل ضحايا التعذيب',
        arabicDescription: 'دعم نفسي للصدمة',
        available: '24/7',
        languages: ['ar', 'en'],
      },
      {
        name: 'UNICEF Child Protection Hotline',
        phone: '121',
        description: 'For children and youth in crisis',
        arabicName: 'خط ساخن لحماية الطفل',
        arabicDescription: 'خط دعم للأطفال والشباب في الأزمات',
        available: '24/7',
        languages: ['ar', 'en'],
      },
    ],
  },

  // MIDDLE EAST - Iraq
  IQ: {
    countryCode: 'IQ',
    country: 'Iraq',
    emoji: '🇮🇶',
    region: 'Middle East & North Africa',
    rtl: true,
    emergencyNumbers: {
      emergency: '104',
      ambulance: '122',
    },
    helplines: [
      {
        name: 'Iraqi Ministry of Health Mental Health Department',
        description: 'Mental health support services',
        arabicName: 'قسم الصحة النفسية بوزارة الصحة العراقية',
        arabicDescription: 'خدمات الصحة النفسية والدعم',
        available: '24/7',
        languages: ['ar', 'en'],
      },
      {
        name: 'Ibn Rushd Psychiatric Hospital',
        phone: '+964171800001',
        description: 'Psychiatric emergency services',
        arabicName: 'مستشفى ابن رشد للأمراض النفسية',
        arabicDescription: 'خدمات الطوارئ النفسية',
        available: '24/7',
        languages: ['ar'],
      },
    ],
  },

  // MIDDLE EAST - Syria
  SY: {
    countryCode: 'SY',
    country: 'Syria',
    emoji: '🇸🇾',
    region: 'Middle East & North Africa',
    rtl: true,
    emergencyNumbers: {
      emergency: '112',
      ambulance: '112',
      police: '110',
    },
    helplines: [
      {
        name: 'Syrian Mental Health Network',
        description: 'Mental health support for crisis situations',
        arabicName: 'شبكة الصحة النفسية السورية',
        arabicDescription: 'دعم الصحة النفسية في الأزمات',
        available: 'Available',
        languages: ['ar', 'en'],
      },
      {
        name: 'UNFPA Syria Psychosocial Support',
        description: 'Psychological support services',
        arabicName: 'خدمات الدعم النفسي والاجتماعي',
        arabicDescription: 'برامج الصحة النفسية',
        available: 'Available',
        languages: ['ar'],
      },
    ],
  },

  // MIDDLE EAST - Yemen
  YE: {
    countryCode: 'YE',
    country: 'Yemen',
    emoji: '🇾🇪',
    region: 'Middle East & North Africa',
    rtl: true,
    emergencyNumbers: {
      emergency: '191',
      ambulance: '194',
    },
    helplines: [
      {
        name: 'Mental Health and Psychosocial Support Services',
        description: 'Through health facilities in Yemen',
        arabicName: 'خدمات الصحة النفسية والدعم النفسي الاجتماعي',
        arabicDescription: 'برامج الصحة النفسية',
        available: 'Available',
        languages: ['ar', 'en'],
      },
      {
        name: 'WHO Mental Health Programs Yemen',
        description: 'Mental health support during humanitarian crisis',
        arabicName: 'برامج الصحة النفسية',
        arabicDescription: 'دعم الصحة النفسية في الأزمات الإنسانية',
        available: 'Available',
        languages: ['ar'],
      },
    ],
  },

  // AFRICA - Morocco
  MA: {
    countryCode: 'MA',
    country: 'Morocco',
    emoji: '🇲🇦',
    region: 'Middle East & North Africa',
    rtl: true,
    emergencyNumbers: {
      emergency: '15',
      ambulance: '150',
      police: '19',
    },
    helplines: [
      {
        name: 'SOS Détresse Maroc',
        description: 'Mental health crisis support',
        arabicName: 'دعم الأزمات النفسية',
        arabicDescription: 'خدمات دعم الصحة النفسية',
        available: '24/7',
        languages: ['ar', 'fr'],
      },
      {
        name: 'Moroccan Ministry of Health Mental Health Services',
        description: 'Mental health support and counseling',
        arabicName: 'خدمات الصحة النفسية',
        arabicDescription: 'الدعم والاستشارة النفسية',
        available: '24/7',
        languages: ['ar', 'fr'],
      },
    ],
  },

  // AFRICA - Algeria
  DZ: {
    countryCode: 'DZ',
    country: 'Algeria',
    emoji: '🇩🇿',
    region: 'Middle East & North Africa',
    rtl: true,
    emergencyNumbers: {
      emergency: '17',
      ambulance: '14',
    },
    helplines: [
      {
        name: 'Algerian Ministry of Health Mental Health Services',
        description: 'Mental health support',
        arabicName: 'خدمات الصحة النفسية',
        arabicDescription: 'دعم الصحة النفسية',
        available: '24/7',
        languages: ['ar', 'fr'],
      },
      {
        name: 'Noor Association for Mental Health',
        description: 'Mental health awareness and support',
        arabicName: 'جمعية نور للصحة النفسية',
        arabicDescription: 'الوعي والدعم في الصحة النفسية',
        available: '24/7',
        languages: ['ar'],
      },
    ],
  },

  // AFRICA - Tunisia
  TN: {
    countryCode: 'TN',
    country: 'Tunisia',
    emoji: '🇹🇳',
    region: 'Middle East & North Africa',
    rtl: true,
    emergencyNumbers: {
      emergency: '197',
      ambulance: '190',
    },
    helplines: [
      {
        name: 'SOS Médecins Tunisia',
        phone: '71752000',
        description: 'Medical and psychological support',
        arabicName: 'دعم طبي ونفسي',
        arabicDescription: 'خدمات الدعم الطبي والنفسي',
        available: '24/7',
        languages: ['ar', 'fr'],
      },
      {
        name: 'Razi Hospital Psychiatric Services',
        phone: '71562000',
        description: 'Psychiatric emergency services',
        arabicName: 'خدمات الطوارئ النفسية بمستشفى الرازي',
        arabicDescription: 'خدمات الطوارئ النفسية',
        available: '24/7',
        languages: ['ar'],
      },
    ],
  },

  // AFRICA - Libya
  LY: {
    countryCode: 'LY',
    country: 'Libya',
    emoji: '🇱🇾',
    region: 'Middle East & North Africa',
    rtl: true,
    emergencyNumbers: {
      emergency: '193',
      ambulance: '193',
    },
    helplines: [
      {
        name: 'Libyan Ministry of Health Mental Health Services',
        description: 'Mental health support',
        arabicName: 'خدمات الصحة النفسية',
        arabicDescription: 'دعم الصحة النفسية',
        available: 'Available',
        languages: ['ar'],
      },
      {
        name: 'WHO Libya Mental Health Programs',
        description: 'Mental health and psychosocial support',
        arabicName: 'برامج الصحة النفسية',
        arabicDescription: 'دعم الصحة النفسية والاجتماعي',
        available: 'Available',
        languages: ['ar'],
      },
    ],
  },

  // AFRICA - Sudan
  SD: {
    countryCode: 'SD',
    country: 'Sudan',
    emoji: '🇸🇩',
    region: 'Middle East & North Africa',
    rtl: true,
    emergencyNumbers: {
      emergency: '999',
      ambulance: '9999',
      police: '999',
    },
    helplines: [
      {
        name: 'Sudanese Ministry of Health Mental Health Department',
        description: 'Mental health services',
        arabicName: 'قسم الصحة النفسية',
        arabicDescription: 'خدمات الصحة النفسية',
        available: '24/7',
        languages: ['ar'],
      },
      {
        name: 'Tigani Elmahi Psychiatric Hospital',
        phone: '+249183770708',
        description: 'Psychiatric services and crisis support',
        arabicName: 'مستشفى التجاني الماحي للأمراض النفسية',
        arabicDescription: 'خدمات الطب النفسي',
        available: '24/7',
        languages: ['ar'],
      },
    ],
  },

  // MIDDLE EAST - Qatar
  QA: {
    countryCode: 'QA',
    country: 'Qatar',
    emoji: '🇶🇦',
    region: 'Middle East & North Africa',
    rtl: true,
    emergencyNumbers: {
      emergency: '999',
      ambulance: '999',
    },
    helplines: [
      {
        name: 'Hamad Medical Corporation Mental Health Services',
        phone: '44393333',
        description: 'Psychiatric and mental health support',
        arabicName: 'خدمات الصحة النفسية',
        arabicDescription: 'دعم الطب النفسي والصحة النفسية',
        available: '24/7',
        languages: ['ar', 'en'],
      },
      {
        name: 'Qatar Foundation Mental Health Programs',
        description: 'Mental health awareness and support',
        arabicName: 'برامج الصحة النفسية',
        arabicDescription: 'الوعي والدعم في الصحة النفسية',
        available: '24/7',
        languages: ['ar', 'en'],
      },
    ],
  },

  // MIDDLE EAST - Kuwait
  KW: {
    countryCode: 'KW',
    country: 'Kuwait',
    emoji: '🇰🇼',
    region: 'Middle East & North Africa',
    rtl: true,
    emergencyNumbers: {
      emergency: '112',
      ambulance: '777',
    },
    helplines: [
      {
        name: 'Kuwait Centre for Mental Health',
        phone: '25380700',
        description: 'Mental health services',
        arabicName: 'مركز الكويت للصحة النفسية',
        arabicDescription: 'خدمات الصحة النفسية',
        available: '24/7',
        languages: ['ar', 'en'],
      },
      {
        name: 'Psychological Medicine Hospital',
        phone: '24810000',
        description: 'Psychiatric emergency services',
        arabicName: 'مستشفى الطب النفسي',
        arabicDescription: 'خدمات الطوارئ النفسية',
        available: '24/7',
        languages: ['ar'],
      },
    ],
  },

  // MIDDLE EAST - Bahrain
  BH: {
    countryCode: 'BH',
    country: 'Bahrain',
    emoji: '🇧🇭',
    region: 'Middle East & North Africa',
    rtl: true,
    emergencyNumbers: {
      emergency: '999',
      ambulance: '999',
    },
    helplines: [
      {
        name: 'Psychiatric Hospital Bahrain',
        phone: '17286116',
        description: 'Mental health support services',
        arabicName: 'مستشفى الطب النفسي',
        arabicDescription: 'خدمات الدعم النفسي',
        available: '24/7',
        languages: ['ar', 'en'],
      },
      {
        name: 'Ministry of Health Mental Health Services',
        description: 'Mental health and psychiatric support',
        arabicName: 'خدمات الصحة النفسية',
        arabicDescription: 'خدمات الطب النفسي والدعم',
        available: '24/7',
        languages: ['ar', 'en'],
      },
    ],
  },

  // MIDDLE EAST - Oman
  OM: {
    countryCode: 'OM',
    country: 'Oman',
    emoji: '🇴🇲',
    region: 'Middle East & North Africa',
    rtl: true,
    emergencyNumbers: {
      emergency: '9999',
      ambulance: '9998',
    },
    helplines: [
      {
        name: 'Ministry of Health Mental Health Services',
        phone: '24563333',
        description: 'Mental health support and counseling',
        arabicName: 'خدمات الصحة النفسية',
        arabicDescription: 'الدعم والاستشارة النفسية',
        available: '24/7',
        languages: ['ar', 'en'],
      },
      {
        name: 'Al Masarra Psychiatric Hospital',
        phone: '24563444',
        description: 'Psychiatric emergency services',
        arabicName: 'مستشفى المسرة للأمراض النفسية',
        arabicDescription: 'خدمات الطوارئ النفسية',
        available: '24/7',
        languages: ['ar'],
      },
    ],
  },

  // AFRICA - Mauritania
  MR: {
    countryCode: 'MR',
    country: 'Mauritania',
    emoji: '🇲🇷',
    region: 'Middle East & North Africa',
    rtl: true,
    emergencyNumbers: {
      emergency: '101',
      ambulance: '101',
      police: '17',
    },
    helplines: [
      {
        name: 'Ministry of Health Mental Health Services',
        description: 'Mental health support',
        arabicName: 'خدمات الصحة النفسية',
        arabicDescription: 'دعم الصحة النفسية',
        available: 'Available',
        languages: ['ar', 'fr'],
      },
    ],
  },

  // AFRICA - Somalia
  SO: {
    countryCode: 'SO',
    country: 'Somalia',
    emoji: '🇸🇴',
    region: 'Middle East & North Africa',
    rtl: true,
    emergencyNumbers: {
      emergency: '999',
      ambulance: '999',
      police: '888',
    },
    helplines: [
      {
        name: 'Mental Health Programs Somalia',
        description: 'Mental health and psychosocial support',
        arabicName: 'برامج الصحة النفسية',
        arabicDescription: 'دعم الصحة النفسية والاجتماعي',
        available: 'Available',
        languages: ['ar', 'so'],
      },
      {
        name: 'WHO Somalia Mental Health Services',
        description: 'Crisis support and mental health care',
        arabicName: 'خدمات الصحة النفسية',
        arabicDescription: 'دعم الأزمات ورعاية الصحة النفسية',
        available: 'Available',
        languages: ['ar'],
      },
    ],
  },

  // AFRICA - Djibouti
  DJ: {
    countryCode: 'DJ',
    country: 'Djibouti',
    emoji: '🇩🇯',
    region: 'Middle East & North Africa',
    rtl: true,
    emergencyNumbers: {
      emergency: '19',
      ambulance: '19',
      police: '19',
    },
    helplines: [
      {
        name: 'Ministry of Health Mental Health Services',
        description: 'Mental health support',
        arabicName: 'خدمات الصحة النفسية',
        arabicDescription: 'دعم الصحة النفسية',
        available: 'Available',
        languages: ['ar', 'fr'],
      },
    ],
  },

  // AFRICA - Comoros
  KM: {
    countryCode: 'KM',
    country: 'Comoros',
    emoji: '🇰🇲',
    region: 'Middle East & North Africa',
    rtl: true,
    emergencyNumbers: {
      emergency: '17',
      ambulance: '17',
    },
    helplines: [
      {
        name: 'Ministry of Health Services',
        description: 'Mental health support through health facilities',
        arabicName: 'خدمات الصحة',
        arabicDescription: 'دعم الصحة النفسية',
        available: 'Available',
        languages: ['ar', 'fr'],
      },
    ],
  },

  // ASIA-PACIFIC - India
  IN: {
    countryCode: 'IN',
    country: 'India',
    emoji: '🇮🇳',
    region: 'Asia-Pacific',
    emergencyNumbers: {
      emergency: '112',
      ambulance: '102',
    },
    helplines: [
      {
        name: 'Vandrevala Foundation Helpline',
        phone: '18602662345',
        phone2: '18002333330',
        description: 'Free, confidential mental health support',
        available: '24/7',
        languages: ['en', 'hi'],
      },
      {
        name: 'iCall Psychosocial Helpline',
        phone: '+919152987821',
        email: 'icall@tiss.edu',
        description: 'Emotional support & counseling',
        available: 'Mon-Sat 8am-10pm',
        languages: ['en', 'hi'],
      },
      {
        name: 'AASRA Helpline',
        phone: '9122275466669',
        description: 'Suicide prevention support',
        available: '24/7',
        languages: ['en'],
      },
    ],
  },

  // ASIA-PACIFIC - Japan
  JP: {
    countryCode: 'JP',
    country: 'Japan',
    emoji: '🇯🇵',
    region: 'Asia-Pacific',
    emergencyNumbers: {
      emergency: '119',
      police: '110',
    },
    helplines: [
      {
        name: 'TELL Japan Lifeline',
        phone: '0357740992',
        description: 'English language crisis support',
        available: 'Daily 9am-11pm',
        languages: ['en', 'ja'],
      },
      {
        name: 'Inochi no Denwa (生の電話)',
        phone: '0570783556',
        description: 'Suicide prevention support',
        available: '24/7',
        languages: ['ja'],
      },
    ],
  },

  // ASIA-PACIFIC - South Korea
  KR: {
    countryCode: 'KR',
    country: 'South Korea',
    emoji: '🇰🇷',
    region: 'Asia-Pacific',
    emergencyNumbers: {
      emergency: '112',
      ambulance: '119',
    },
    helplines: [
      {
        name: 'Korea Suicide Prevention Center',
        phone: '1393',
        description: 'Free suicide prevention support',
        available: '24/7',
        languages: ['ko'],
      },
      {
        name: 'Lifeline Korea',
        phone: '15889191',
        description: 'Crisis support',
        available: '24/7',
        languages: ['ko', 'en'],
      },
    ],
  },

  // ASIA-PACIFIC - Singapore
  SG: {
    countryCode: 'SG',
    country: 'Singapore',
    emoji: '🇸🇬',
    region: 'Asia-Pacific',
    emergencyNumbers: {
      emergency: '999',
      ambulance: '995',
    },
    helplines: [
      {
        name: 'Samaritans of Singapore (SOS)',
        phone: '1767',
        description: 'Free crisis support',
        available: '24/7',
        languages: ['en'],
      },
      {
        name: 'Institute of Mental Health Helpline',
        phone: '63892222',
        description: 'Mental health support',
        available: '24/7',
        languages: ['en'],
      },
    ],
  },

  // LATIN AMERICA - Mexico
  MX: {
    countryCode: 'MX',
    country: 'Mexico',
    emoji: '🇲🇽',
    region: 'Latin America',
    emergencyNumbers: {
      emergency: '911',
      ambulance: '911',
    },
    helplines: [
      {
        name: 'Línea de la Vida',
        phone: '8009112000',
        description: 'Free confidential suicide prevention support',
        available: '24/7',
        languages: ['es'],
      },
    ],
  },

  // LATIN AMERICA - Brazil
  BR: {
    countryCode: 'BR',
    country: 'Brazil',
    emoji: '🇧🇷',
    region: 'Latin America',
    emergencyNumbers: {
      emergency: '190',
      ambulance: '192',
    },
    helplines: [
      {
        name: 'CVV - Centro de Valorização da Vida',
        phone: '188',
        chat: 'www.cvv.org.br',
        description: 'Free suicide prevention support',
        available: '24/7',
        languages: ['pt'],
      },
    ],
  },

  // LATIN AMERICA - Argentina
  AR: {
    countryCode: 'AR',
    country: 'Argentina',
    emoji: '🇦🇷',
    region: 'Latin America',
    emergencyNumbers: {
      emergency: '911',
      ambulance: '107',
    },
    helplines: [
      {
        name: 'Centro de Asistencia al Suicida',
        phone: '0115275113',
        description: 'Free suicide prevention support',
        available: '24/7',
        languages: ['es'],
      },
    ],
  },

  // LATIN AMERICA - Chile
  CL: {
    countryCode: 'CL',
    country: 'Chile',
    emoji: '🇨🇱',
    region: 'Latin America',
    emergencyNumbers: {
      emergency: '133',
      ambulance: '131',
    },
    helplines: [
      {
        name: 'Salud Responde',
        phone: '6003607777',
        description: 'Free mental health support',
        available: '24/7',
        languages: ['es'],
      },
    ],
  },
};

// REGIONS for grouping
export const regions = {
  'North America': ['US', 'CA'],
  'Europe': ['GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'SE', 'NO', 'DK', 'FI', 'PL', 'GR', 'PT', 'IE', 'CH', 'AT'],
  'Oceania': ['AU', 'NZ'],
  'Middle East & North Africa': ['PS', 'EG', 'SA', 'AE', 'JO', 'LB', 'IQ', 'SY', 'YE', 'MA', 'DZ', 'TN', 'LY', 'SD', 'QA', 'KW', 'BH', 'OM', 'MR', 'SO', 'DJ', 'KM'],
  'Asia-Pacific': ['IN', 'JP', 'KR', 'SG'],
  'Latin America': ['MX', 'BR', 'AR', 'CL'],
};

// Helper function to get countries by region
export const getCountriesByRegion = (region: string): CountryResource[] => {
  const codes = regions[region as keyof typeof regions] || [];
  return codes.map((code) => countryResources[code]).filter(Boolean);
};

// Helper function to get all countries sorted alphabetically
export const getAllCountriesSorted = (): CountryResource[] => {
  return Object.values(countryResources).sort((a, b) => a.country.localeCompare(b.country));
};

// Helper function to detect user's country from timezone or IP
export const detectCountryFromTimezone = (): string | null => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timezoneMap: Record<string, string> = {
      'America/New_York': 'US',
      'America/Los_Angeles': 'US',
      'America/Chicago': 'US',
      'Europe/London': 'GB',
      'Europe/Paris': 'FR',
      'Europe/Berlin': 'DE',
      'Europe/Madrid': 'ES',
      'Europe/Rome': 'IT',
      'Europe/Amsterdam': 'NL',
      'Europe/Brussels': 'BE',
      'Europe/Stockholm': 'SE',
      'Europe/Oslo': 'NO',
      'Europe/Copenhagen': 'DK',
      'Europe/Helsinki': 'FI',
      'Europe/Warsaw': 'PL',
      'Europe/Athens': 'GR',
      'Europe/Lisbon': 'PT',
      'Europe/Dublin': 'IE',
      'Europe/Zurich': 'CH',
      'Europe/Vienna': 'AT',
      'Asia/Kolkata': 'IN',
      'Asia/Tokyo': 'JP',
      'Asia/Seoul': 'KR',
      'Asia/Singapore': 'SG',
      'Australia/Sydney': 'AU',
      'Pacific/Auckland': 'NZ',
      'America/Mexico_City': 'MX',
      'America/Sao_Paulo': 'BR',
      'America/Argentina/Buenos_Aires': 'AR',
      'America/Santiago': 'CL',
      'Africa/Cairo': 'EG',
      'Asia/Riyadh': 'SA',
      'Asia/Dubai': 'AE',
      'Asia/Amman': 'JO',
      'Asia/Beirut': 'LB',
      'Asia/Baghdad': 'IQ',
      'Asia/Damascus': 'SY',
      'Asia/Aden': 'YE',
      'Africa/Casablanca': 'MA',
      'Africa/Algiers': 'DZ',
      'Africa/Tunis': 'TN',
      'Africa/Tripoli': 'LY',
      'Africa/Khartoum': 'SD',
      'Asia/Qatar': 'QA',
      'Asia/Kuwait': 'KW',
      'Asia/Bahrain': 'BH',
      'Asia/Muscat': 'OM',
      'Africa/Nouakchott': 'MR',
      'Africa/Mogadishu': 'SO',
      'Africa/Djibouti': 'DJ',
      'Indian/Comoro': 'KM',
      'Asia/Ramallah': 'PS',
    };
    return timezoneMap[timezone] || null;
  } catch {
    return null;
  }
};
