import { createClient } from '@supabase/supabase-js';

const url = 'https://nqnxfrxqsgebcczfdmpe.supabase.co';
const key = 'sb_publishable_oTz4QzC9JuW1pqVNGyjE2g_zX0WrmFq';

const supabase = createClient(url, key);

async function testInsert() {
  const { data, error } = await supabase.from('plans').insert([{
    user_email: 'builder@ideaforge.ai',
    title: 'Test Project',
    idea_text: 'Test idea',
    blueprint: {},
    search_data: {}
  }]).select();

  console.log('Insert result:', { data, error });
}

testInsert();
