// Core domain types for SubWatch Wise

export interface Merchant {
  id: string;
  name_norm: string;
  category?: string;
  cancel_url?: string;
}

export interface Subscription {
  id: string;
  merchant: Merchant;
  plan?: string;
  cycle: 'monthly' | 'yearly' | 'trial';
  next_bill_at?: string;
  price?: number;
  status: 'active' | 'paused' | 'canceled';
  badges?: string[];
}

export interface Alert {
  id: string;
  type: 'trial_d3' | 'price_up' | 'duplicate' | 'unused_seat';
  trigger_at: string;
  payload: any;
  sent_at?: string;
  read_at?: string;
}

export interface Saving {
  id: string;
  type: 'cancel' | 'pause' | 'switch_yearly' | 'coupon';
  amount: number;
  created_at: string;
  subscription_id?: string;
}

export interface IngestResult {
  accepted: number;
  rejected: number;
  errors: { row: number; reason: string }[];
}

export interface DashboardStats {
  monthly_total: number;
  yearly_total: number;
  total_savings: number;
  active_subscriptions: number;
  at_risk_count: number;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  timezone?: string;
  created_at: string;
}