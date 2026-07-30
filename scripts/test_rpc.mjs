import { createClient } from '@supabase/supabase-js';

const url = 'https://nqnxfrxqsgebcczfdmpe.supabase.co';
const key = 'sb_publishable_oTz4QzC9JuW1pqVNGyjE2g_zX0WrmFq';

const supabase = createClient(url, key);

async function testRpc() {
  const { data, error } = await supabase.rpc('exec_sql', { sql: 'CREATE TABLE IF NOT EXISTS test (id id);' });
  console.log('RPC exec_sql result:', { data, error });
}

testRpc();
