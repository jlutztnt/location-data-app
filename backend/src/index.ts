import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createAuth } from './lib/auth';
import { createDB } from './db';
import type { Env } from './types';
import locationRoutes from './routes/locations';

const app = new Hono<{ Bindings: Env }>();

// Add CORS middleware
app.use('*', cors({
	origin: ['http://localhost:3000', 'https://your-frontend-domain.vercel.app'],
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

// Better Auth integration - mount the handler properly
app.on(["POST", "GET"], "/api/auth/*", async (c) => {
	try {
		console.log('Auth route hit:', c.req.method, c.req.url);
		console.log('Environment variables:', {
			hasDB: !!c.env.DB,
			hasSecret: !!c.env.BETTER_AUTH_SECRET,
			hasURL: !!c.env.BETTER_AUTH_URL
		});
		
		const auth = createAuth(c.env.DB, c.env.BETTER_AUTH_SECRET, c.env.BETTER_AUTH_URL);
		console.log('Auth instance created successfully');
		
		const response = await auth.handler(c.req.raw);
		console.log('Auth handler response:', response.status);
		
		return response;
	} catch (error) {
		console.error('Auth handler error:', error);
		return c.json({ 
			error: 'Authentication error', 
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
