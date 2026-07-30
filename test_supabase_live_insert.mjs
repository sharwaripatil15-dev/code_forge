import { createClient } from '@supabase/supabase-js';

const url = 'https://nqnxfrxqsgebcczfdmpe.supabase.co';
const key = 'sb_publishable_oTz4QzC9JuW1pqVNGyjE2g_zX0WrmFq';

const supabase = createClient(url, key);

async function testInsert() {
  const planData = {
    user_email: 'developer@example.com',
    title: 'AI Automated Code Auditor',
    idea_text: 'An AI copilot that performs deterministic AST analysis and vulnerability checks on pull requests.',
    category: 'Developer Tools',
    target_user: 'Software Engineers',
    blueprint: { title: 'AI Automated Code Auditor', tagline: 'Deterministic AST Code Review' },
    search_data: { input: { idea: 'An AI copilot that performs AST analysis' } },
  };

  console.log('Inserting plan for user developer@example.com into Supabase project nqnxfrxqsgebcczfdmpe...');
  const { data, error } = await supabase.from('plans').insert([planData]).select();

  if (error) {
    console.log('Result (Table pending schema execution in SQL Editor):');
    console.log('Error Code:', error.code);
    console.log('Message:', error.message);
  } else {
    console.log('SUCCESS! Created row in Supabase Table Editor:');
    console.log(JSON.stringify(data, null, 2));
  }
}

testInsert();
