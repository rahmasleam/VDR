
export enum AppStep {
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  VERIFY_EMAIL = 'VERIFY_EMAIL',
  VERIFICATION_SUCCESS = 'VERIFICATION_SUCCESS',
  WELCOME = 'WELCOME',
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD'
}

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  onboarding_completed: boolean;
}

export interface FileData {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  path?: string; 
}

// Matches 'company_profiles' table
export interface CompanyProfile {
  id?: string;
  completeName: string; // complete_name
  phoneNumber: string;  // phone_number
  companyName: string;  // company_name
  organizationType: 'Startup' | 'Company'; // organization_type
  industryType: string; // primary_sector
  website: string;
  pitchDeckFile: FileData | null; // stored in public_pitch_files jsonb
  socialMediaLinks: string[]; // social_links jsonb
}

export interface VdrField {
  id: string;
  label: string;
  description?: string;
}

export interface VdrTab {
  id: string;
  title: string;
  description: string;
  fields: VdrField[];
}

export interface VdrData {
  [tabId: string]: {
    [fieldId: string]: FileData;
  };
}

export interface AiTabFeedback {
  evaluator: string;
  improver: string;
  nextStep: string;
  riskScore: number;
  complianceNotes: string;
}
