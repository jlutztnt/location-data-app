import { Hono } from 'hono';
import { createAuth } from '../lib/auth';
import { createDB } from '../db';
import { locations, districts, managers, storeHours } from '../db/schema';
import { eq, and, desc, ne } from 'drizzle-orm';
import type { Env } from '../types';

const app = new Hono<{ Bindings: Env }>();

// Authentication middleware
const authMiddleware = async (c: any, next: any) => {
  try {
    const auth = createAuth(c.env.DB, c.env.BETTER_AUTH_SECRET, c.env.BETTER_AUTH_URL);
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    c.set('user', session.user);
    c.set('session', session.session);
    await next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return c.json({ error: 'Authentication failed' }, 401);
  }
};

// Apply auth middleware to all routes
app.use('*', authMiddleware);

// GET /api/locations - List all locations
app.get('/', async (c) => {
  try {
    const db = createDB(c.env.DB);
    
    const allLocations = await db
      .select({
        id: locations.id,
        storeNumber: locations.storeNumber,
        storeName: locations.storeName,
        address: locations.address,
        city: locations.city,
        state: locations.state,
        zipCode: locations.zipCode,
        phoneNumber: locations.phoneNumber,
        latitude: locations.latitude,
        longitude: locations.longitude,
        isActive: locations.isActive,
        createdAt: locations.createdAt,
        updatedAt: locations.updatedAt,
        district: {
          districtId: districts.id,
          districtNumber: districts.districtNumber,
          districtName: districts.districtName,
        },
        storeManager: {
          managerId: managers.id,
          firstName: managers.firstName,
          lastName: managers.lastName,
          email: managers.email,
          phoneNumber: managers.phoneNumber,
        }
      })
      .from(locations)
      .leftJoin(districts, eq(locations.districtId, districts.id))
      .leftJoin(managers, eq(locations.storeManagerId, managers.id))
      .orderBy(desc(locations.createdAt));

    return c.json({
      success: true,
      data: allLocations,
      count: allLocations.length
    });
  } catch (error) {
    console.error('Error fetching locations:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to fetch locations',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// GET /api/locations/:id - Get single location with full details
app.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const db = createDB(c.env.DB);

    const location = await db
      .select({
        id: locations.id,
        storeNumber: locations.storeNumber,
        storeName: locations.storeName,
        address: locations.address,
        city: locations.city,
        state: locations.state,
        zipCode: locations.zipCode,
        phoneNumber: locations.phoneNumber,
        latitude: locations.latitude,
        longitude: locations.longitude,
        googlePlaceId: locations.googlePlaceId,
        isActive: locations.isActive,
        createdAt: locations.createdAt,
        updatedAt: locations.updatedAt,
        district: {
          districtId: districts.id,
          districtNumber: districts.districtNumber,
          districtName: districts.districtName,
        },
        storeManager: {
          managerId: managers.id,
          firstName: managers.firstName,
          lastName: managers.lastName,
          email: managers.email,
          phoneNumber: managers.phoneNumber,
          role: managers.role,
        }
      })
      .from(locations)
      .leftJoin(districts, eq(locations.districtId, districts.id))
      .leftJoin(managers, eq(locations.storeManagerId, managers.id))
      .where(eq(locations.id, id))
      .limit(1);

    if (location.length === 0) {
      return c.json({ 
        success: false, 
        error: 'Location not found' 
      }, 404);
    }

    // Get store hours for this location
    const hours = await db
      .select()
      .from(storeHours)
      .where(eq(storeHours.locationId, id))
      .orderBy(storeHours.dayOfWeek);

    return c.json({
      success: true,
      data: {
        ...location[0],
        hours: hours
      }
    });
  } catch (error) {
    console.error('Error fetching location:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to fetch location',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// POST /api/locations - Create new location
app.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const db = createDB(c.env.DB);

    // Validate required fields
    const requiredFields = ['storeNumber', 'storeName', 'address', 'city', 'state', 'zipCode'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return c.json({ 
          success: false, 
          error: `Missing required field: ${field}` 
        }, 400);
      }
    }

    // Check if store number already exists
    const existingStore = await db
      .select()
      .from(locations)
      .where(eq(locations.storeNumber, body.storeNumber))
      .limit(1);

    if (existingStore.length > 0) {
      return c.json({ 
        success: false, 
        error: 'Store number already exists' 
      }, 409);
    }

    const now = new Date();
    const locationId = crypto.randomUUID();

    const newLocation = {
      id: locationId,
      storeNumber: body.storeNumber,
      storeName: body.storeName,
      address: body.address,
      city: body.city,
      state: body.state,
      zipCode: body.zipCode,
      phoneNumber: body.phoneNumber || null,
      latitude: body.latitude || null,
      longitude: body.longitude || null,
      googlePlaceId: body.googlePlaceId || null,
      districtId: body.districtId || null,
      storeManagerId: body.storeManagerId || null,
      districtManagerId: body.districtManagerId || null,
      isActive: body.isActive !== undefined ? body.isActive : true,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(locations).values(newLocation);

    // If hours are provided, insert them
    if (body.hours && Array.isArray(body.hours)) {
      const hoursData = body.hours.map((hour: any) => ({
        id: crypto.randomUUID(),
        locationId: locationId,
        dayOfWeek: hour.dayOfWeek,
        openTime: hour.openTime || null,
        closeTime: hour.closeTime || null,
        isClosed: hour.isClosed || false,
        createdAt: now,
        updatedAt: now,
      }));

      await db.insert(storeHours).values(hoursData);
    }

    return c.json({
      success: true,
      data: newLocation,
      message: 'Location created successfully'
    }, 201);
  } catch (error) {
    console.error('Error creating location:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to create location',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// PUT /api/locations/:id - Update location
app.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const db = createDB(c.env.DB);

    // Check if location exists
    const existingLocation = await db
      .select()
      .from(locations)
      .where(eq(locations.id, id))
      .limit(1);

    if (existingLocation.length === 0) {
      return c.json({ 
        success: false, 
        error: 'Location not found' 
      }, 404);
    }

    // If store number is being changed, check for conflicts
    if (body.storeNumber && body.storeNumber !== existingLocation[0]?.storeNumber) {
      const conflictingStore = await db
        .select()
        .from(locations)
        .where(and(
          eq(locations.storeNumber, body.storeNumber),
          ne(locations.id, id)
        ))
        .limit(1);

      if (conflictingStore.length > 0) {
        return c.json({ 
          success: false, 
          error: 'Store number already exists' 
        }, 409);
      }
    }

    const updateData = {
      ...(body.storeNumber && { storeNumber: body.storeNumber }),
      ...(body.storeName && { storeName: body.storeName }),
      ...(body.address && { address: body.address }),
      ...(body.city && { city: body.city }),
      ...(body.state && { state: body.state }),
      ...(body.zipCode && { zipCode: body.zipCode }),
      ...(body.phoneNumber !== undefined && { phoneNumber: body.phoneNumber }),
      ...(body.latitude !== undefined && { latitude: body.latitude }),
      ...(body.longitude !== undefined && { longitude: body.longitude }),
      ...(body.googlePlaceId !== undefined && { googlePlaceId: body.googlePlaceId }),
      ...(body.districtId !== undefined && { districtId: body.districtId }),
      ...(body.storeManagerId !== undefined && { storeManagerId: body.storeManagerId }),
      ...(body.districtManagerId !== undefined && { districtManagerId: body.districtManagerId }),
      ...(body.isActive !== undefined && { isActive: body.isActive }),
      updatedAt: new Date(),
    };

    await db
      .update(locations)
      .set(updateData)
      .where(eq(locations.id, id));

    // Update hours if provided
    if (body.hours && Array.isArray(body.hours)) {
      // Delete existing hours
      await db
        .delete(storeHours)
        .where(eq(storeHours.locationId, id));

      // Insert new hours
      const hoursData = body.hours.map((hour: any) => ({
        id: crypto.randomUUID(),
        locationId: id,
        dayOfWeek: hour.dayOfWeek,
        openTime: hour.openTime || null,
        closeTime: hour.closeTime || null,
        isClosed: hour.isClosed || false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      await db.insert(storeHours).values(hoursData);
    }

    return c.json({
      success: true,
      message: 'Location updated successfully'
    });
  } catch (error) {
    console.error('Error updating location:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to update location',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// DELETE /api/locations/:id - Delete location (soft delete)
app.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const db = createDB(c.env.DB);

    // Check if location exists
    const existingLocation = await db
      .select()
      .from(locations)
      .where(eq(locations.id, id))
      .limit(1);

    if (existingLocation.length === 0) {
      return c.json({ 
        success: false, 
        error: 'Location not found' 
      }, 404);
    }

    // Soft delete by setting isActive to false
    await db
      .update(locations)
      .set({ 
        isActive: false,
        updatedAt: new Date()
      })
      .where(eq(locations.id, id));

    return c.json({
      success: true,
      message: 'Location deactivated successfully'
    });
  } catch (error) {
    console.error('Error deleting location:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to delete location',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

export default app;
