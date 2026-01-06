/**
 * Crisis Support & Resources Types
 * Universal crisis support resources for anyone in distress
 */

export interface CrisisHelpline {
  name: string;
  phone?: string;
  text?: string;
  description: string;
  available: string;
  audience?: string;
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
