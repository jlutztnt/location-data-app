import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createDB } from './db';
import type { Env } from './types';
import locationRoutes from './routes/locations';
import { createSimpleAuth } from './lib/simple-auth';

const app = new Hono<{ Bindings: Env }>();

// Add CORS middleware
app.use('*', cors({
	origin: ['http://localhost:3000', 'https://location-data-app.vercel.app'],
	credentials: true,
}));

// Root endpoint
app.get('/', (c) => {
	return c.text('Toot\'n Totum Location Data API - v1.0.0');
});

// Health check endpoint
app.get('/health', (c) => {
	const env = c.env;
	return c.json({
		status: 'healthy',
		timestamp: new Date().toISOString(),
		environment: env.ENVIRONMENT || 'unknown'
	});
});

// Simple Auth endpoints
app.post("/api/auth/sign-in/email", async (c) => {
	try {
		console.log('Simple auth sign-in attempt');
		
		if (!c.env.BETTER_AUTH_SECRET) {
			console.error('BETTER_AUTH_SECRET is not available in environment');
			return c.json({ error: 'Server configuration error: Missing authentication secret' }, 500);
		}
		
		const body = await c.req.json();
		const { email, password } = body;
		
		if (!email || !password) {
			return c.json({ error: 'Email and password are required' }, 400);
		}
		
		const auth = createSimpleAuth(c.env.DB, c.env.BETTER_AUTH_SECRET);
		const result = await auth.signIn(email, password);
		
		if (!result) {
			return c.json({ error: 'Invalid credentials' }, 401);
		}
		
		console.log('Sign-in successful for:', email);
		
		// Set session cookie
		const response = c.json({ 
			success: true, 
			user: result.user,
			message: 'Sign in successful'
		});
		
		// Set HTTP-only cookie for session
		response.headers.set('Set-Cookie', 
			`session=${result.sessionToken}; HttpOnly; Secure; SameSite=None; Max-Age=${7 * 24 * 60 * 60}; Path=/`
		);
		
		return response;
	} catch (error) {
		console.error('Auth sign-in error:', error);
		return c.json({ 
			error: 'Authentication error', 
			details: error instanceof Error ? error.message : 'Unknown error' 
		}, 500);
	}
});

app.post("/api/auth/sign-out", async (c) => {
	try {
		console.log('Sign-out request');
		
		const response = c.json({ success: true, message: 'Signed out successfully' });
		
		// Clear session cookie
		response.headers.set('Set-Cookie', 
			`session=; HttpOnly; Secure; SameSite=None; Max-Age=0; Path=/`
		);
		
		return response;
	} catch (error) {
		console.error('Auth sign-out error:', error);
		return c.json({ 
			error: 'Sign out error', 
			details: error instanceof Error ? error.message : 'Unknown error' 
		}, 500);
	}
});

app.get("/api/auth/session", async (c) => {
	try {
		console.log('Session check request');
		
		// For now, return a simple response
		// In a full implementation, you'd verify the session cookie
		return c.json({ user: null });
	} catch (error) {
		console.error('Auth session error:', error);
		return c.json({ 
			error: 'Session error', 
			details: error instanceof Error ? error.message : 'Unknown error' 
		}, 500);
	}
});

app.get("/api/auth/get-session", async (c) => {
	try {
		console.log('Get session request');
		
		// For now, return a simple response
		// In a full implementation, you'd verify the session cookie
		return c.json({ user: null });
	} catch (error) {
		console.error('Auth get-session error:', error);
		return c.json({ 
			error: 'Session error', 
			details: error instanceof Error ? error.message : 'Unknown error' 
		}, 500);
	}
});

// Mount location routes
app.route('/api/locations', locationRoutes);

// Public routes (no authentication required)
const publicApi = app.basePath('/public');

publicApi.get('/locations', async (c) => {
	// TODO: Implement public location listing (limited data)
	return c.json({ message: 'Public locations endpoint coming soon!' }, 501);
});

publicApi.get('/locations/:storeNumber/hours', async (c) => {
	const storeNumber = c.req.param('storeNumber');
	// TODO: Implement public store hours lookup
	return c.json({ message: `Public hours for store ${storeNumber} coming soon!` }, 501);
});

// 404 handler
app.notFound((c) => {
	return c.json({ error: 'Not Found' }, 404);
});

// Error handler
app.onError((err, c) => {
	console.error('API Error:', err);
	return c.json({ error: 'Internal Server Error' }, 500);
});

export default app;
