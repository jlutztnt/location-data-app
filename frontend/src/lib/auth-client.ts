// Custom auth client for our simple authentication system

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://location-data-api.jlutz.workers.dev';

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
}

export interface AuthSession {
  user: AuthUser | null;
}

// Custom sign in function
export const signIn = {
  email: async ({ email, password }: { email: string; password: string }) => {
    try {
      const response = await fetch(`${baseURL}/api/auth/sign-in/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: {
            message: data.error || 'Login failed',
          },
        };
      }

      return {
        data: data.user,
        error: null,
      };
    } catch (error) {
      console.error('Sign in error:', error);
      return {
        error: {
          message: 'Network error occurred',
        },
      };
    }
  },
};

// Custom sign out function
export const signOut = async () => {
  try {
    const response = await fetch(`${baseURL}/api/auth/sign-out`, {
      method: 'POST',
      credentials: 'include',
    });

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('Sign out error:', error);
    return {
      error: {
        message: 'Sign out failed',
      },
    };
  }
};

// Custom get session function
export const getSession = async (): Promise<AuthSession> => {
  try {
    const response = await fetch(`${baseURL}/api/auth/get-session`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      return { user: null };
    }

    const data = await response.json();
    return { user: data.user };
  } catch (error) {
    console.error('Get session error:', error);
    return { user: null };
  }
};

// Custom useSession hook (simplified)
export const useSession = (): { data: AuthSession; isPending: boolean } => {
  // For now, return a simple implementation
  // In a full implementation, you'd use React state and effects
  return {
    data: { user: null },
    isPending: false,
  };
};

// Placeholder for signUp (not implemented)
export const signUp = {
  email: async () => {
    throw new Error('Sign up is not implemented');
  },
};
