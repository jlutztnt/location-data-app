// Script to create admin user using Better Auth server API
import { createAuth } from '../src/lib/auth';
import { createDB } from '../src/db';

// Mock D1 database for local testing
const mockDB = {
  prepare: () => ({
    bind: () => ({
      all: () => Promise.resolve({ results: [] }),
      run: () => Promise.resolve({ success: true }),
      first: () => Promise.resolve(null)
    })
  }),
  batch: () => Promise.resolve([]),
  exec: () => Promise.resolve({ results: [] })
} as any;

async function createAdminWithAuth() {
  console.log('Creating admin user using Better Auth server API...');
  
  try {
    // Create auth instance
    const auth = createAuth(
      mockDB,
      'dev-secret-key-change-in-production-12345',
      'http://127.0.0.1:8787'
    );
    
    // Use Better Auth's server API to create user
    const result = await auth.api.signUpEmail({
      body: {
        name: 'John Lutz',
        email: 'jlutz@tootntotum.com',
        password: 'password'
      }
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('Result:', result);
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    console.log('');
    console.log('💡 Alternative: Try enabling sign-up temporarily in auth.ts');
    console.log('Set disableSignUp: false in the emailAndPassword config');
  }
}

createAdminWithAuth();
