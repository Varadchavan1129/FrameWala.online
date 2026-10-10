import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jiypkjimiirkqmkarrwa.supabase.co';
const supabaseKey = 'sb_publishable_grhUaDXuz-AoU0XDkZke9Q_Xfd-eoMH';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  console.log('Checking categories table...');
  const { data: categories, error: catError } = await supabase.from('categories').select('*').limit(1);
  if (catError) console.error('Categories error:', catError.message);
  else console.log('Categories:', categories);

  console.log('\nChecking products table...');
  const { data: products, error: prodError } = await supabase.from('products').select('*').limit(1);
  if (prodError) console.error('Products error:', prodError.message);
  else console.log('Products:', products);
}

checkTables();
