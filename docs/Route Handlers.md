# Next.js 15 Dynamic Route Handlers Guide

## Overview

Next.js 15 introduced a breaking change in how dynamic route parameters are handled in App Router route handlers. This document provides guidance on how to properly implement and fix issues with dynamic route handlers in Next.js 15.

## The Breaking Change

In Next.js 15, dynamic route parameters are now provided as a Promise that needs to be awaited, rather than directly as an object. This change affects all route handlers that use dynamic segments in their paths (e.g., `[id]`, `[slug]`, etc.).

### Before (Next.js 14 and earlier)

```typescript
// In app/api/items/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id; // Direct access to id
  // ...
}
```

### After (Next.js 15)

```typescript
// In app/api/items/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // Must await the params Promise
  // ...
}
```

## Common Issues and Solutions

### Issue 1: TypeScript Errors

```
Property 'id' does not exist on type 'Promise<{ id: string; }>'
```

#### Solution

Update the type definition and await the params:

```typescript
// Change this:
{ params }: { params: { id: string } }

// To this:
{ params }: { params: Promise<{ id: string }> }

// And then await the params:
const { id } = await params;
```

### Issue 2: Runtime Errors

```
Cannot read properties of undefined (reading 'id')
```

#### Solution

Make sure to await the params Promise before accessing its properties:

```typescript
// Incorrect:
const id = params.id;

// Correct:
const { id } = await params;
```

### Issue 3: Error Handling

When using params in error handling or logging, you need to handle the Promise nature of params:

#### Solution

Use Promise methods to safely access params in catch blocks:

```typescript
try {
  const { id } = await params;
  // Use id...
} catch (error: unknown) {
  const err = error as Error;
  // Safely get the id for error logging
  const paramId = await params.then(p => p.id).catch(() => 'unknown');
  console.error(`API error for ID ${paramId}:`, err);
  // ...
}
```

## Complete Example

Here's a complete example of a properly implemented dynamic route handler in Next.js 15:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params Promise to get the actual parameters
    const { id } = await params;
    
    // Use the id parameter
    const result = await someService.getById(id);
    
    if (!result) {
      return NextResponse.json(
        { error: `Item with ID ${id} not found` },
        { status: 404 }
      );
    }
    
    // Return the response
    return NextResponse.json({ data: result });
  } catch (error: unknown) {
    const err = error as Error;
    
    // Safely get the id for error logging
    const paramId = await params.then(p => p.id).catch(() => 'unknown');
    console.error(`API error for ID ${paramId}:`, err);
    
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Multiple Dynamic Segments

For routes with multiple dynamic segments (e.g., `/api/[storeId]/products/[productId]`), all parameters are still provided in a single params object:

```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string; productId: string }> }
) {
  try {
    const { storeId, productId } = await params;
    // ...
  } catch (error) {
    // ...
  }
}
```

## Catch-All and Optional Catch-All Segments

For catch-all (`[...slug]`) and optional catch-all (`[[...slug]]`) segments, the parameter will be an array:

```typescript
// For /api/posts/[...slug]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params; // slug is an array of path segments
  // ...
}
```

## Middleware and Authentication

When using middleware or authentication with dynamic routes, make sure to await the params before using them:

```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return authMiddleware(request, async () => {
    try {
      const { id } = await params;
      // Protected route logic...
    } catch (error) {
      // Error handling...
    }
  });
}
```

## Testing Dynamic Routes

When testing dynamic routes, remember to mock the params as a Promise:

```typescript
// Instead of:
const params = { id: '123' };

// Use:
const params = Promise.resolve({ id: '123' });
```

## Migration Checklist

When migrating from Next.js 14 (or earlier) to Next.js 15, follow these steps for each dynamic route handler:

1. Update the type definition to use `Promise<{ ... }>` for params
2. Add `await` before accessing params
3. Update error handling to safely access params in catch blocks
4. Test all dynamic routes to ensure they work correctly

## References

- [Next.js 15 Release Notes](https://nextjs.org/blog/next-15)
- [Next.js Route Handlers Documentation](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Dynamic Routes in Next.js](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
