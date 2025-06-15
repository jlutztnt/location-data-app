// This script creates an admin user using Better Auth API
// Usage: node scripts/create-admin.js (after compiling)

async function createAdminUser() {
  const adminData = {
    name: 'John Lutz',
    email: 'jlutz@tootntotum.com',
    password: 'tntabc123!'
  };
  
  try {
    console.log('Creating admin user via Better Auth API...');
    console.log('Name:', adminData.name);
    console.log('Email:', adminData.email);
    console.log('');
    
    // Make a request to the Better Auth sign-up endpoint
    // Since sign-up is disabled, we'll need to use the admin creation method
    const response = await fetch('http://127.0.0.1:8787/api/auth/sign-up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: adminData.name,
        email: adminData.email,
        password: adminData.password,
      }),
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Admin user created successfully!');
      console.log('User ID:', result.user?.id);
      console.log('');
      console.log('You can now log in with:');
      console.log('Email:', adminData.email);
      console.log('Password:', adminData.password);
      console.log('');
      console.log('Login URL: http://localhost:3000/login');
    } else {
      const error = await response.text();
      console.log('❌ Failed to create admin user');
      console.log('Status:', response.status);
      console.log('Error:', error);
      console.log('');
      console.log('Note: Sign-up may be disabled. You might need to enable it temporarily');
      console.log('or use a different method to create the first admin user.');
    }
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    console.log('');
    console.log('Make sure the backend server is running on http://127.0.0.1:8787');
  }
}

createAdminUser();
