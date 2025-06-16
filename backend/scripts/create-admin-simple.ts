import { createSimpleAuth } from '../src/lib/simple-auth';
import { createDB } from '../src/db';

// Mock D1Database for local testing
const mockDB = {
  prepare: () => ({
    bind: () => ({
      first: () => Promise.resolve(null),
      run: () => Promise.resolve({ success: true }),
      all: () => Promise.resolve({ results: [] }),
    }),
  }),
  dump: () => Promise.resolve(new ArrayBuffer(0)),
  batch: () => Promise.resolve([]),
  exec: () => Promise.resolve({ count: 0, duration: 0 }),
};

async function createAdmin() {
  try {
    console.log('Creating admin user with simple auth...');
    
    const secret = "2e69abaa8c76ecb15c8a7cad203c710c90fd5504b10d0a0f95b46179cd834705";
    const auth = createSimpleAuth(mockDB as any, secret);
    
    const adminUser = await auth.createUser(
      'admin@tootntotum.com',
      'admin123',
      'Admin User'
    );
    
    if (adminUser) {
      console.log('✅ Admin user created successfully!');
      console.log('📧 Email: admin@tootntotum.com');
      console.log('🔑 Password: admin123');
      console.log('👤 User ID:', adminUser.id);
    } else {
      console.log('❌ Failed to create admin user');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdmin();
