// Test Community Database Connection
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔍 Testing Community Database Connection...\n');

  try {
    // Test 1: Check if community_posts table exists
    console.log('1. Checking community_posts table...');
    const { data: posts, error: postsError } = await supabase
      .from('community_posts')
      .select('count')
      .limit(1);

    if (postsError) {
      console.log('❌ community_posts table not found or not accessible');
      console.log('   Error:', postsError.message);
      console.log('\n💡 Run the database setup script first:');
      console.log('   ./setup-community-db.sh');
      return;
    }

    console.log('✅ community_posts table accessible');

    // Test 2: Get post count
    console.log('\n2. Getting post count...');
    const { count, error: countError } = await supabase
      .from('community_posts')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.log('❌ Error getting post count:', countError.message);
    } else {
      console.log(`✅ Found ${count} posts in database`);
    }

    // Test 3: Get sample posts
    console.log('\n3. Getting sample posts...');
    const { data: samplePosts, error: sampleError } = await supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);

    if (sampleError) {
      console.log('❌ Error getting sample posts:', sampleError.message);
    } else {
      console.log(`✅ Retrieved ${samplePosts.length} sample posts`);
      samplePosts.forEach((post, index) => {
        console.log(`   ${index + 1}. ${post.user_name}: ${post.content.substring(0, 50)}...`);
      });
    }

    // Test 4: Check post_likes table
    console.log('\n4. Checking post_likes table...');
    const { data: likes, error: likesError } = await supabase
      .from('post_likes')
      .select('count')
      .limit(1);

    if (likesError) {
      console.log('❌ post_likes table not found or not accessible');
      console.log('   Error:', likesError.message);
    } else {
      console.log('✅ post_likes table accessible');
    }

    console.log('\n🎉 Community database connection test completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Start your development server: npm run dev');
    console.log('   2. Navigate to the community feed');
    console.log('   3. Test creating posts and liking them');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

testConnection(); 