export interface FriendItem {
  id: string;
  name: string;
  avatar: string;
  count: number;
  statusText: string;
  statusLevel: 'safe' | 'danger' | 'super' | 'hyper' | 'alien' | 'miracle';
  lastActive: string;
  isUser?: boolean;
  comment?: string;
  cprCount?: number;
}

export interface BreathRecord {
  timestamp: number;
  count: number;
}

export interface FloatingNumber {
  id: number;
  x: number;
  y: number;
  text: string;
  color?: string;
}

export type BreathingPhase = 'inhale' | 'hold' | 'exhale';

export interface RhythmConfig {
  id: string;
  label: string;
  inhaleSec: number;
  exhaleSec: number;
  holdSec?: number;
  tag: string;
}
