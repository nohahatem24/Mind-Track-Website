/**
 * Crisis Support & Resources Types
 * Universal crisis support resources for anyone in distress
 */

export interface CrisisHelpline {
  name: string;
  phone?: string;
  phone2?: string;
  text?: string;
  description: string;
  available: string;
  audience?: string;
  chat?: string;
  email?: string;
  arabicName?: string;
  arabicDescription?: string;
  languages?: string[];
}

export interface InternationalCrisisLine {
  country: string;
  helplines: CrisisHelpline[];
}

export interface TherapistResource {
  name: string;
  url: string;
  description: string;
  icon?: string;
}

export interface EducationalResource {
  title: string;
  description: string;
  icon?: string;
}

export interface CopingTool {
  name: string;
  description: string;
  link?: string;
  icon?: string;
}

/**
 * Crisis detection keywords for journal entries and mood tracking
 */
export const CRISIS_KEYWORDS = [
  'suicide',
  'suicidal',
  'kill myself',
  'kill me',
  'end my life',
  'end it all',
  'not want to live',
  "don't want to live",
  'death wish',
  'want to die',
  'wish i was dead',
  'wish i was never born',
  'no point in living',
  'no reason to live',
  'harm myself',
  'hurt myself',
  'cut myself',
  'self harm',
  'self-harm',
];

export interface CrisisDetectionResult {
  hasCrisisKeywords: boolean;
  severity: 'low' | 'medium' | 'high';
  matchedKeywords: string[];
}

/**
 * Detect crisis keywords in text
 */
export const detectCrisisKeywords = (text: string): CrisisDetectionResult => {
  const lowercaseText = text.toLowerCase();
  const matchedKeywords: string[] = [];

  for (const keyword of CRISIS_KEYWORDS) {
    if (lowercaseText.includes(keyword)) {
      matchedKeywords.push(keyword);
    }
  }

  let severity: 'low' | 'medium' | 'high' = 'low';
  if (matchedKeywords.length > 0) {
    severity = matchedKeywords.length > 2 ? 'high' : 'medium';
  }

  return {
    hasCrisisKeywords: matchedKeywords.length > 0,
    severity,
    matchedKeywords,
  };
};

