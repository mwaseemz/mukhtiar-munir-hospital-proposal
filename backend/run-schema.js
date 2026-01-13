const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runSchema() {
  const client = new Client({
    connectionString: 'postgresql://postgres.edppcvnrldrdjjuyqrtn:Q4x44pjAuC8kp5v6@aws-1-ap-south-1.pooler.supabase.com:6543/postgres',
  });

  try {
    console.log('📡 Connecting to database...');
    await client.connect();
    console.log('✅ Connected!');

    const schemaPath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('📝 Running schema SQL...');
    await client.query(sql);
    console.log('✅ All tables created successfully!');
    console.log('🎉 Database is ready!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runSchema();
