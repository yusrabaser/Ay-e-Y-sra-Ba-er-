
export enum TimeRange {
  LIVE = 'LIVE',
  LAST_24H = 'LAST_24H',
  LAST_30D = 'LAST_30D',
  CUSTOM = 'CUSTOM',
}

export interface KPI {
  id: string;
  title: string;
  value: number; // Changed to number for odometer calculation
  prefix?: string;
  suffix?: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  status: 'safe' | 'warning' | 'danger';
  insight: string;
  iconName: string;
}

export interface Incident {
  id: string;
  timestamp: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  type: 'fraud' | 'login' | 'bot' | 'injection';
}

export type DefenseStatus = 'DETECTED' | 'ANALYZING' | 'AI_INTERVENTION' | 'QUARANTINE' | 'NEUTRALIZED';
export type DefenseChannel = 'META' | 'GOOGLE' | 'TIKTOK' | 'LINKEDIN' | 'SYSTEM_API';

export interface DefenseIncident {
  id: string;
  title: string;
  type: 'BOT' | 'FRAUD' | 'PHISHING' | 'INJECTION' | 'API_ABUSE';
  channel: DefenseChannel;
  status: DefenseStatus;
  threatScore: number; // 0-100
  startTime: string; // HH:MM format for Timeline
  duration: number; // in minutes (for Timeline width)
  description: string;
  aiAction: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export interface TrafficActor {
  id: string;
  name: string; // e.g., "Click Hunter"
  type: 'BOT' | 'COMPETITOR' | 'GENUINE';
  damagePotential: number; // 0-100
  method: string; // e.g., "Script Injection"
  volume: string; // e.g. "12k req/day"
  description: string;
}

export interface BudgetMatrixPoint {
  id: string;
  cpc: number; // Cost (Y axis)
  quality: number; // Interaction (X axis)
  source: string;
  status: 'DRAINER' | 'GEM' | 'NEUTRAL';
}

export interface SentimentItem {
  id: string;
  platform: 'TWITTER' | 'INSTAGRAM' | 'FACEBOOK' | 'TRUSTPILOT';
  user: string;
  text: string;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'THREAT';
  riskScore: number;
  timestamp: string;
  aiFlag?: string; // e.g., "Keyword: SCAM"
}

export interface SuccessStory {
  id: string;
  brandName: string;
  representative: string;
  title: string;
  comment: string;
  criticalMetric: string;
  threatType: 'FAKE_SITE' | 'AD_FRAUD' | 'REPUTATION' | 'TAKEOVER';
  iconName: string;
}
