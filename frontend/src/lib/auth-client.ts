import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://your-backend-domain.workers.dev' 
    : 'http://localhost:8787',
  
  // Optional: Configure fetch options
  fetchOptions: {
    credentials: 'include', // Include cookies in requests
  },
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;
