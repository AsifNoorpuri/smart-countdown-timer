export type ThemeStyle = 'light' | 'dark' | 'gradient' | 'minimal';
export type LayoutType = 'bar' | 'banner' | 'box';
export type PositionType = 'top' | 'bottom' | 'inline';

export interface PluginConfig {
  targetDate: string; // YYYY-MM-DD
  targetTime: string; // HH:MM
  timezone: string;
  
  // Appearance
  layout: LayoutType;
  position: PositionType;
  backgroundColor: string;
  textColor: string;
  numberBackgroundColor: string;
  numberTextColor: string;
  
  // Content
  titleText: string; // Main text for banner
  preDateText: string; // Text before timer for bar
  
  // Behavior
  expiryAction: 'message' | 'hide' | 'redirect' | 'restart';
  expiryMessage: string;
  redirectUrl: string;
  
  // Units
  showDays: boolean;
  showHours: boolean;
  showMinutes: boolean;
  showSeconds: boolean;
  
  // Meta
  pluginName: string;
  pluginSlug: string;
}

export const defaultConfig: PluginConfig = {
  targetDate: '2025-12-31',
  targetTime: '23:59',
  timezone: 'UTC',
  
  layout: 'banner',
  position: 'inline',
  backgroundColor: '#0f172a', // Dark blue/slate
  textColor: '#ffffff',
  numberBackgroundColor: '#2563eb', // Blue
  numberTextColor: '#ffffff',
  
  titleText: '🔥 Cyber Monday Sale Countdown',
  preDateText: '🍀 Get 30% off. Sale ends in',
  
  expiryAction: 'message',
  expiryMessage: 'This offer has expired.',
  redirectUrl: 'https://example.com',
  
  showDays: true,
  showHours: true,
  showMinutes: true,
  showSeconds: true,
  
  pluginName: 'Smart Countdown Timer',
  pluginSlug: 'smart-countdown-timer',
};