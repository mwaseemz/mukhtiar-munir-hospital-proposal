const { Client } = require('pg');

async function resetDatabase() {
  const client = new Client({
    connectionString: 'postgresql://postgres.edppcvnrldrdjjuyqrtn:Q4x44pjAuC8kp5v6@aws-1-ap-south-1.pooler.supabase.com:6543/postgres',
  });

  try {
    console.log('📡 Connecting to database...');
    await client.connect();
    console.log('✅ Connected!');

    console.log('🗑️  Dropping all existing tables and types...');
    
    // Drop all tables in public schema
    await client.query(`
      DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;
      GRANT ALL ON SCHEMA public TO postgres;
      GRANT ALL ON SCHEMA public TO public;
    `);
    
    console.log('✅ Database cleaned!');
    console.log('📝 Now run: npx prisma db push');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

resetDatabase();
