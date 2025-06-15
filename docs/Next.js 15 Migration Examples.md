# Next.js 15 Migration Examples

This document shows real examples from our project of how we migrated route handlers from Next.js 14 to Next.js 15 to handle the breaking change with dynamic route parameters.

## Example 1: GET /api/inventory/:id

### Before (Next.js 14)

```typescript
// app/api/inventory/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiAuthMiddleware } from '../../../lib/auth/api-auth';
import * as InventoryApi from '../../../lib/api/inventory-api';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return apiAuthMiddleware(request, async () => {
    try {
      const id = params.id;
      const reading = await InventoryApi.getInventoryReadingById(id);
      
      if (!reading) {
        return NextResponse.json(
          { error: `Inventory reading with ID ${id} not found` },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ data: reading });
    } catch (error: unknown) {
      const err = error as Error;
      console.error(`Error fetching inventory reading ${params.id}:`, err);
      
      return NextResponse.json(
        { error: err.message || 'Internal server error' },
        { status: 500 }
      );
    }
  });
}
```

### After (Next.js 15)

```typescript
// app/api/inventory/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiAuthMiddleware } from '../../../lib/auth/api-auth';
import * as InventoryApi from '../../../lib/api/inventory-api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return apiAuthMiddleware(request, async () => {
    try {
      // Await the params Promise to get the actual parameters
      const { id } = await params;
      
      const reading = await InventoryApi.getInventoryReadingById(id);
      
      if (!reading) {
        return NextResponse.json(
          { error: `Inventory reading with ID ${id} not found` },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ data: reading });
    } catch (error: unknown) {
      const err = error as Error;
      
      // Safely get the id for error logging
      const readingId = await params.then(p => p.id).catch(() => 'unknown');
      console.error(`Error fetching inventory reading ${readingId}:`, err);
      
      return NextResponse.json(
        { error: err.message || 'Internal server error' },
        { status: 500 }
      );
    }
  });
}
```

## Example 2: GET /api/tanks/:id/readings

### Before (Next.js 14)

```typescript
// app/api/tanks/[id]/readings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiAuthMiddleware } from '../../../../lib/auth/api-auth';
import * as TanksApi from '../../../../lib/api/tanks-api';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return apiAuthMiddleware(request, async () => {
    try {
      const tankId = params.id;
      
      // Parse query parameters
      const url = new URL(request.url);
      const startDate = url.searchParams.get('startDate') ? new Date(url.searchParams.get('startDate')!) : undefined;
      const endDate = url.searchParams.get('endDate') ? new Date(url.searchParams.get('endDate')!) : undefined;
      const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!, 10) : undefined;
      const offset = url.searchParams.get('offset') ? parseInt(url.searchParams.get('offset')!, 10) : undefined;
      
      const result = await TanksApi.getTankReadings(tankId, {
        startDate,
        endDate,
        limit,
        offset
      });
      
      return NextResponse.json(result);
    } catch (error: unknown) {
      const err = error as Error;
      console.error(`Error fetching tank readings for tank ${params.id}:`, err);
      
      return NextResponse.json(
        { error: err.message || 'Internal server error' },
        { status: 500 }
      );
    }
  });
}
```

### After (Next.js 15)

```typescript
// app/api/tanks/[id]/readings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiAuthMiddleware } from '../../../../lib/auth/api-auth';
import * as TanksApi from '../../../../lib/api/tanks-api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return apiAuthMiddleware(request, async () => {
    try {
      // Await the params Promise to get the actual parameters
      const { id: tankId } = await params;
      
      // Parse query parameters
      const url = new URL(request.url);
      const startDate = url.searchParams.get('startDate') ? new Date(url.searchParams.get('startDate')!) : undefined;
      const endDate = url.searchParams.get('endDate') ? new Date(url.searchParams.get('endDate')!) : undefined;
      const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!, 10) : undefined;
      const offset = url.searchParams.get('offset') ? parseInt(url.searchParams.get('offset')!, 10) : undefined;
      
      const result = await TanksApi.getTankReadings(tankId, {
        startDate,
        endDate,
        limit,
        offset
      });
      
      return NextResponse.json(result);
    } catch (error: unknown) {
      const err = error as Error;
      
      // Safely get the id for error logging
      const tankId = await params.then(p => p.id).catch(() => 'unknown');
      console.error(`Error fetching tank readings for tank ${tankId}:`, err);
      
      return NextResponse.json(
        { error: err.message || 'Internal server error' },
        { status: 500 }
      );
    }
  });
}
```

## Example 3: Dynamic Test Route

### Before (Next.js 14)

```typescript
// app/api/test/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiAuthMiddleware } from '../../../lib/auth/api-auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  return apiAuthMiddleware(request, async () => {
    try {
      const slug = params.slug;
      
      return NextResponse.json({
        message: `Test endpoint for: ${slug}`,
        timestamp: new Date().toISOString()
      });
    } catch (error: unknown) {
      const err = error as Error;
      console.error(`Error in test endpoint for ${params.slug}:`, err);
      
      return NextResponse.json(
        { error: err.message || 'Internal server error' },
        { status: 500 }
      );
    }
  });
}
```

### After (Next.js 15)

```typescript
// app/api/test/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiAuthMiddleware } from '../../../lib/auth/api-auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  return apiAuthMiddleware(request, async () => {
    try {
      // Await the params Promise to get the actual parameters
      const { slug } = await params;
      
      return NextResponse.json({
        message: `Test endpoint for: ${slug}`,
        timestamp: new Date().toISOString()
      });
    } catch (error: unknown) {
      const err = error as Error;
      
      // Safely get the slug for error logging
      const slugValue = await params.then(p => p.slug).catch(() => 'unknown');
      console.error(`Error in test endpoint for ${slugValue}:`, err);
      
      return NextResponse.json(
        { error: err.message || 'Internal server error' },
        { status: 500 }
      );
    }
  });
}
```

## Key Changes Summary

1. **Type Definition**:
   - Changed `{ params: { id: string } }` to `{ params: Promise<{ id: string }> }`

2. **Parameter Access**:
   - Changed `const id = params.id;` to `const { id } = await params;`

3. **Error Handling**:
   - Changed `console.error(`Error for ${params.id}`, err);` to:
     ```typescript
     const paramId = await params.then(p => p.id).catch(() => 'unknown');
     console.error(`Error for ${paramId}`, err);
     ```

4. **Destructuring with Renaming**:
   - Used `const { id: tankId } = await params;` to rename the parameter during destructuring

These changes ensure compatibility with Next.js 15's new Promise-based approach to dynamic route parameters.
