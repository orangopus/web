import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.VUE_APP_SUPABASE_URL
const supabaseAnonKey = process.env.VUE_APP_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

console.log('🔗 Testing Supabase connection...')

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    // Test basic connection
    console.log('📡 Testing basic connection...')
    const { data, error } = await supabase.from('users').select('count').limit(1)
    
    if (error) {
      console.error('❌ Database connection failed:', error.message)
      console.log('💡 This might mean the database tables haven\'t been created yet.')
      console.log('💡 Run the setup script: npm run setup-db')
      return false
    }
    
    console.log('✅ Database connection successful!')
    
    // Test users table
    console.log('👥 Testing users table...')
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1)
    
    if (usersError) {
      console.error('❌ Users table error:', usersError.message)
      return false
    }
    
    console.log('✅ Users table accessible!')
    
    // Test projects table
    console.log('📁 Testing projects table...')
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .limit(1)
    
    if (projectsError) {
      console.error('❌ Projects table error:', projectsError.message)
      return false
    }
    
    console.log('✅ Projects table accessible!')
    
    // Test posts table
    console.log('📝 Testing posts table...')
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .limit(1)
    
    if (postsError) {
      console.error('❌ Posts table error:', postsError.message)
      return false
    }
    
    console.log('✅ Posts table accessible!')
    
    console.log('🎉 All database tests passed!')
    return true
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
    return false
  }
}

testConnection().then(success => {
  if (success) {
    console.log('\n✅ Database is ready for authentication!')
  } else {
    console.log('\n❌ Database setup required. Please run the setup script.')
  }
}) 