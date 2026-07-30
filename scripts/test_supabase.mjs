import { createClient } from '@supabase/supabase-js';

const url = 'https://nqnxfrxqsgebcczfdmpe.supabase.co';
const key = 'sb_publishable_oTz4QzC9JuW1pqVNGyjE2g_zX0WrmFq';

const supabase = createClient(url, key);

async function test() {
  console.log('Testing Supabase client connection...');
  const { data, error } = await supabase.from('plans').select('*');
  console.log('Select result:', { data, error });
}

test();
