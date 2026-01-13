const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function setupDatabase() {
  try {
    console.log('🔄 Setting up database...\n');
    
    // Run prisma db push with output streaming
    const child = exec('npx prisma db push --accept-data-loss --skip-generate');
    
    child.stdout.on('data', (data) => {
      process.stdout.write(data);
    });
    
    child.stderr.on('data', (data) => {
      process.stderr.write(data);
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        console.log('\n✅ Database setup complete!');
      } else {
        console.log('\n❌ Database setup failed');
      }
      process.exit(code);
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setupDatabase();
