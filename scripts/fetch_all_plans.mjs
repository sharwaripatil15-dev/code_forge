import { createClient } from '@supabase/supabase-js';

const url = 'https://nqnxfrxqsgebcczfdmpe.supabase.co';
const key = 'sb_publishable_oTz4QzC9JuW1pqVNGyjE2g_zX0WrmFq';

const supabase = createClient(url, key);

async function fetchPlans() {
  console.log('Fetching all rows from Supabase "plans" table in project nqnxfrxqsgebcczfdmpe...');
  const { data, error } = await supabase.from('plans').select('*');

  if (error) {
    console.error('Error fetching plans:', error);
  } else {
    console.log(`Found ${data.length} row(s) in Supabase "plans" table:`);
    console.log(JSON.stringify(data, null, 2));
  }
}

fetchPlans();
