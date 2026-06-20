import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Client Configuration
 * Initializes Supabase connection for all database, auth, and storage operations
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase URL or Anon Key');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Helper functions for common Supabase operations
 */

// Authentication
export const auth = {
  signUp: (email, password) => supabase.auth.signUp({ email, password }),
  signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
  signOut: () => supabase.auth.signOut(),
  getSession: () => supabase.auth.getSession(),
  getUser: () => supabase.auth.getUser(),
  resetPassword: (email) => supabase.auth.resetPasswordForEmail(email),
};

// Database operations
export const db = {
  // Members
  getMembers: (limit = 1000) => 
    supabase.from('members').select('*').limit(limit),
  getMemberById: (id) => 
    supabase.from('members').select('*').eq('id', id).single(),
  createMember: (data) => 
    supabase.from('members').insert([data]).select(),
  updateMember: (id, data) => 
    supabase.from('members').update(data).eq('id', id).select(),
  deleteMember: (id) => 
    supabase.from('members').delete().eq('id', id),

  // Payments
  getPayments: (limit = 1000) => 
    supabase.from('payments').select('*').limit(limit),
  getPaymentsByMember: (memberId) => 
    supabase.from('payments').select('*').eq('member_id', memberId),
  createPayment: (data) => 
    supabase.from('payments').insert([data]).select(),
  updatePayment: (id, data) => 
    supabase.from('payments').update(data).eq('id', id).select(),

  // Transactions
  getTransactions: (limit = 1000) => 
    supabase.from('transactions').select('*').limit(limit),
  createTransaction: (data) => 
    supabase.from('transactions').insert([data]).select(),

  // Ledgers
  getLedgers: (limit = 1000) => 
    supabase.from('member_ledgers').select('*').limit(limit),
  getLedgerByMember: (memberId) => 
    supabase.from('member_ledgers').select('*').eq('member_id', memberId).single(),
  updateLedger: (memberId, data) => 
    supabase.from('member_ledgers').update(data).eq('member_id', memberId).select(),

  // Announcements
  getAnnouncements: () => 
    supabase.from('announcements').select('*').eq('is_active', true).order('published_date', { ascending: false }),
  createAnnouncement: (data) => 
    supabase.from('announcements').insert([data]).select(),
  updateAnnouncement: (id, data) => 
    supabase.from('announcements').update(data).eq('id', id).select(),
  deleteAnnouncement: (id) => 
    supabase.from('announcements').delete().eq('id', id),

  // Settings
  getSettings: () => 
    supabase.from('system_settings').select('*').single(),
  updateSettings: (data) => 
    supabase.from('system_settings').update(data).limit(1),

  // Expenses
  getExpenses: (limit = 1000) => 
    supabase.from('expenses').select('*').limit(limit),
  createExpense: (data) => 
    supabase.from('expenses').insert([data]).select(),
};

// File Storage
export const storage = {
  uploadMemberPhoto: (memberId, file) => 
    supabase.storage.from('member-photos').upload(`${memberId}/${file.name}`, file),
  uploadPaymentScreenshot: (paymentId, file) => 
    supabase.storage.from('payment-screenshots').upload(`${paymentId}/${file.name}`, file),
  getPublicUrl: (bucket, path) => 
    supabase.storage.from(bucket).getPublicUrl(path),
};

// Realtime subscriptions
export const realtime = {
  subscribeToPayments: (callback) => 
    supabase
      .channel('payments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payments' }, callback)
      .subscribe(),
  subscribeToMembers: (callback) => 
    supabase
      .channel('members')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, callback)
      .subscribe(),
  subscribeToTransactions: (callback) => 
    supabase
      .channel('transactions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, callback)
      .subscribe(),
  subscribeToAnnouncements: (callback) => 
    supabase
      .channel('announcements')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, callback)
      .subscribe(),
};

export default supabase;
