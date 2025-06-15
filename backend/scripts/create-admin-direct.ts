// Direct database approach - create admin user directly in the database
import { drizzle } from 'drizzle-orm/d1';
import { user } from '../src/db/schema';
import { eq } from 'drizzle-orm';

// This script connects directly to the D1 database and creates an admin user
// bypassing the Better Auth HTTP layer

async function createAdminUserDirect() {
  console.log('Creating admin user directly in database...');
  
  const adminData = {
    id: crypto.randomUUID(),
    name: 'John Lutz',
    email: 'jlutz@tootntotum.com',
    emailVerified: true,
    image: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  console.log('Name:', adminData.name);
  console.log('Email:', adminData.email);
  console.log('');

  try {
    // For this script to work, we need to connect to the actual D1 database
    // This is a simplified approach - in a real scenario, we'd need proper D1 connection
    console.log('⚠️  This script requires direct D1 database access.');
    console.log('For now, let\'s try a different approach...');
    console.log('');
    
    // Alternative: Use wrangler to execute SQL directly
    console.log('💡 Alternative approach:');
    console.log('Run this command to create the user directly:');
    console.log('');
    console.log('npx wrangler d1 execute location-data-db --remote --command "');
    console.log(`INSERT INTO user (id, name, email, emailVerified, createdAt, updatedAt) VALUES`);
    console.log(`('${adminData.id}', '${adminData.name}', '${adminData.email}', 1, ${adminData.createdAt}, ${adminData.updatedAt});"`);
    console.log('');
    console.log('Then you can set a password using the Better Auth API or create an account table entry.');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
}

createAdminUserDirect();
