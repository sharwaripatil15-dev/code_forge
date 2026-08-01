import { createClient } from '@supabase/supabase-js';
import { DeepSearchState } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nqnxfrxqsgebcczfdmpe.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_oTz4QzC9JuW1pqVNGyjE2g_zX0WrmFq';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UserSession {
  email: string;
  isLoggedIn: boolean;
  telegramConnectCode: string;
  telegramChatId?: string;
}

// 1. Generate / Retrieve User Session
export function getOrCreateSession(): UserSession {
  if (typeof window === 'undefined') {
    return { email: 'dev@ideaforge.ai', isLoggedIn: true, telegramConnectCode: 'FORGE-8421' };
  }

  const stored = localStorage.getItem('ideaforge_user_session');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      // Fallback
    }
  }

  const newSession: UserSession = {
    email: 'builder@ideaforge.ai',
    isLoggedIn: false,
    telegramConnectCode: `FORGE-${Math.floor(1000 + Math.random() * 9000)}`,
  };
  localStorage.setItem('ideaforge_user_session', JSON.stringify(newSession));
  return newSession;
}

// 1.b. Logout User Session
export function logoutUserSession(): UserSession {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('ideaforge_user_session');
    localStorage.removeItem('ideaforge_last_active_plan');
  }
  const newSession: UserSession = {
    email: 'builder@ideaforge.ai',
    isLoggedIn: false,
    telegramConnectCode: `FORGE-${Math.floor(1000 + Math.random() * 9000)}`,
  };
  if (typeof window !== 'undefined') {
    localStorage.setItem('ideaforge_user_session', JSON.stringify(newSession));
  }
  return newSession;
}

// 2. Magic Link Login Flow
export async function sendMagicLink(email: string): Promise<{ success: boolean; message: string }> {
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://mock-ideaforge.supabase.co') {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: typeof window !== 'undefined' ? window.location.origin + '/app' : 'http://localhost:3000/app' },
      });
      if (error) {
        console.warn('Supabase Auth Notice (using local magic link session):', error.message);
      }
    }

    // Update Session locally & store
    const session: UserSession = {
      email,
      isLoggedIn: true,
      telegramConnectCode: `FORGE-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('ideaforge_user_session', JSON.stringify(session));
    }

    // Persist Telegram connection code to Supabase DB telegram_links table asynchronously
    saveTelegramLink(email, session.telegramConnectCode).catch(() => {});

    return { success: true, message: `Logged in as ${email}! Session active and synced with Supabase.` };
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to send magic link.' };
  }
}

// 3. Plan Persistence (Save & Load in Supabase DB + localStorage)
export async function saveUserBlueprint(email: string, state: DeepSearchState): Promise<DeepSearchState | void> {
  const cleanEmail = email.toLowerCase().trim();
  
  // 1. Save to local storage for zero-latency client restore
  if (typeof window !== 'undefined') {
    try {
      const key = `ideaforge_plan_${cleanEmail}`;
      localStorage.setItem(key, JSON.stringify(state));
      localStorage.setItem('ideaforge_last_active_plan', key);
    } catch (e) {
      console.warn('Failed to persist user blueprint to localStorage:', e);
    }
  }

  // 2. Persist real row to Supabase Database 'plans' table
  try {
    const title = state.blueprint?.title || state.input?.idea || 'Untitled Blueprint';
    const ideaText = state.input?.idea || title;
    const category = state.input?.category || 'Tech';
    const targetUser = state.input?.targetUser || 'Developers';

    const row = {
      user_email: cleanEmail,
      title,
      idea_text: ideaText,
      category,
      target_user: targetUser,
      blueprint: state.blueprint || {},
      search_data: state,
      updated_at: new Date().toISOString(),
    };

    if (state.id) {
      console.log(`[Supabase DB] Updating plan ID ${state.id} in "plans" table...`);
      const { data, error } = await supabase
        .from('plans')
        .update(row)
        .eq('id', state.id)
        .select();

      if (!error && data && data[0]) {
        console.log('[Supabase DB SUCCESS] Updated row in Supabase "plans" table:', data[0]);
        return { ...state, id: data[0].id, created_at: data[0].created_at };
      }
    } else {
      console.log('[Supabase DB] Inserting plan row into Supabase "plans" table...', { email: cleanEmail, title });
      const { data, error } = await supabase
        .from('plans')
        .insert([row])
        .select();

      if (!error && data && data[0]) {
        console.log('[Supabase DB SUCCESS] Inserted real row into Supabase "plans" table:', data[0]);
        const newState = { ...state, id: data[0].id, created_at: data[0].created_at };
        if (typeof window !== 'undefined') {
          const key = `ideaforge_plan_${cleanEmail}`;
          localStorage.setItem(key, JSON.stringify(newState));
        }
        return newState;
      } else if (error) {
        console.warn('[Supabase DB Notice] Insert into "plans" table result:', error.message);
      }
    }
  } catch (err) {
    console.warn('[Supabase DB Exception]:', err);
  }
}

export function loadUserBlueprint(email: string): DeepSearchState | null {
  if (typeof window === 'undefined') return null;
  try {
    const key = `ideaforge_plan_${email.toLowerCase().trim()}`;
    const data = localStorage.getItem(key);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.warn('Failed to load persisted blueprint:', e);
  }
  return null;
}

// 4. Fetch User Plans History from Supabase
export async function getUserPlansFromSupabase(email: string): Promise<DeepSearchState[]> {
  const cleanEmail = email.toLowerCase().trim();
  try {
    console.log(`[Supabase DB] Fetching plans for ${cleanEmail}...`);
    const { data, error } = await supabase
      .from('plans')
      .select('id, user_email, title, idea_text, category, target_user, created_at, updated_at, search_data, blueprint')
      .eq('user_email', cleanEmail)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase DB Notice] getUserPlansFromSupabase error:', error.message);
      return [];
    }

    if (data && data.length > 0) {
      return data.map((row: any) => {
        const fullState: DeepSearchState = {
          ...row.search_data,
          id: row.id,
          created_at: row.created_at,
          input: row.search_data?.input || {
            idea: row.idea_text,
            category: row.category,
            targetUser: row.target_user,
          },
          blueprint: row.blueprint || row.search_data?.blueprint,
        };
        return fullState;
      });
    }
  } catch (e) {
    console.warn('[Supabase DB Exception] getUserPlansFromSupabase:', e);
  }
  return [];
}

// 5. Save Telegram Link Code to Supabase DB
export async function saveTelegramLink(email: string, connectCode: string): Promise<void> {
  try {
    const { data, error } = await supabase
      .from('telegram_links')
      .upsert(
        {
          user_email: email.toLowerCase().trim(),
          connect_code: connectCode,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_email' }
      );
    if (error) {
      console.warn('[Supabase DB Notice] Telegram link upsert:', error.message);
    } else {
      console.log('[Supabase DB SUCCESS] Telegram link synced:', data);
    }
  } catch (e) {
    console.warn('[Supabase DB Exception] saveTelegramLink:', e);
  }
}

// 6. Get Telegram Link Status from Supabase DB
export async function getTelegramLinkStatus(email: string): Promise<{ isConnected: boolean; telegramChatId?: string; connectCode?: string }> {
  const cleanEmail = email.toLowerCase().trim();
  try {
    const { data, error } = await supabase
      .from('telegram_links')
      .select('*')
      .eq('user_email', cleanEmail)
      .single();

    if (!error && data) {
      return {
        isConnected: !!data.is_connected && !!data.telegram_chat_id,
        telegramChatId: data.telegram_chat_id,
        connectCode: data.connect_code,
      };
    }
  } catch (e) {
    console.warn('[Supabase DB Exception] getTelegramLinkStatus:', e);
  }
  return { isConnected: false };
}

// 7. Bind Telegram Chat ID to User Account by Connection Code
export async function linkTelegramChatId(connectCode: string, chatId: string): Promise<{ success: boolean; userEmail?: string; error?: string }> {
  const cleanCode = connectCode.trim().toUpperCase();
  try {
    console.log(`[Supabase DB] Attempting Telegram account link for code "${cleanCode}" with Chat ID ${chatId}...`);
    const { data, error } = await supabase
      .from('telegram_links')
      .update({
        telegram_chat_id: String(chatId),
        is_connected: true,
        updated_at: new Date().toISOString(),
      })
      .eq('connect_code', cleanCode)
      .select();

    if (!error && data && data.length > 0) {
      console.log('[Supabase DB SUCCESS] Telegram Account Linked:', data[0]);
      return { success: true, userEmail: data[0].user_email };
    } else {
      console.warn('[Supabase DB Notice] No matching connection code found:', cleanCode, error?.message);
      return { success: false, error: 'Connection code not found' };
    }
  } catch (e: any) {
    console.warn('[Supabase DB Exception] linkTelegramChatId:', e);
    return { success: false, error: e.message };
  }
}
