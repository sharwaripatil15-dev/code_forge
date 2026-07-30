import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nqnxfrxqsgebcczfdmpe.supabase.co';
const supabaseAnonKey = 'sb_publishable_oTz4QzC9JuW1pqVNGyjE2g_zX0WrmFq';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixChatId() {
  console.log('Updating telegram_links in Supabase DB with real user Chat ID 5398360379...');

  const { data, error } = await supabase
    .from('telegram_links')
    .upsert({
      user_email: 'builder@ideaforge.ai',
      connect_code: 'FORGE-8421',
      telegram_chat_id: '5398360379',
      is_connected: true,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_email' })
    .select();

  console.log('Upsert result:', JSON.stringify({ data, error }, null, 2));
}

fixChatId();
