# App Router API Routes with Dynamic Parameters in Next.js 15

This document provides a quick reference for implementing API routes with dynamic parameters in Next.js 15 using the App Router.

## Basic Example

Here's a minimal example of a dynamic route handler in Next.js 15:

```typescript
// app/api/items/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params Promise to get the actual parameters
    const { id } = await params;
    
    // Return the response
    return NextResponse.json({ id, message: `Item ${id} details` });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
```

## With Authentication Middleware

```typescript
// app/api/protected/items/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiAuthMiddleware } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return apiAuthMiddleware(request, async () => {
    try {
      const { id } = await params;
      
      // Your protected route logic here
      const item = await getItemById(id);
      
      if (!item) {
        return NextResponse.json(
          { error: `Item with ID ${id} not found` },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ data: item });
    } catch (error: unknown) {
      const err = error as Error;
      const paramId = await params.then(p => p.id).catch(() => 'unknown');
      console.error(`API error for item ID ${paramId}:`, err);
      
      return NextResponse.json(
        { error: err.message || 'Internal server error' },
        { status: 500 }
      );
    }
  });
}
```

## Multiple Dynamic Segments

```typescript
// app/api/stores/[storeId]/products/[productId]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string; productId: string }> }
) {
  try {
    const { storeId, productId } = await params;
    
    // Fetch product from store
    const product = await getProductFromStore(storeId, productId);
    
    if (!product) {
      return NextResponse.json(
        { error: `Product ${productId} not found in store ${storeId}` },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ data: product });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('API error:', err);
    
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Catch-All Routes

```typescript
// app/api/docs/[...slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await params;
    
    // Join the slug segments with slashes
    const path = slug.join('/');
    
    // Fetch documentation for the path
    const doc = await getDocumentation(path);
    
    if (!doc) {
      return NextResponse.json(
        { error: `Documentation for ${path} not found` },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ data: doc });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('API error:', err);
    
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## POST Method with Dynamic Parameters

```typescript
// app/api/users/[userId]/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    
    // Parse request body
    const body = await request.json();
    
    // Create a new post for the user
    const newPost = await createPost(userId, body);
    
    return NextResponse.json(
      { data: newPost },
      { status: 201 }
    );
  } catch (error: unknown) {
    const err = error as Error;
    const userIdSafe = await params.then(p => p.userId).catch(() => 'unknown');
    console.error(`Error creating post for user ${userIdSafe}:`, err);
    
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## PUT Method with Dynamic Parameters

```typescript
// app/api/items/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Parse request body
    const body = await request.json();
    
    // Update the item
    const updatedItem = await updateItem(id, body);
    
    if (!updatedItem) {
      return NextResponse.json(
        { error: `Item with ID ${id} not found` },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ data: updatedItem });
  } catch (error: unknown) {
    const err = error as Error;
    const itemId = await params.then(p => p.id).catch(() => 'unknown');
    console.error(`Error updating item ${itemId}:`, err);
    
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## DELETE Method with Dynamic Parameters

```typescript
// app/api/items/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Delete the item
    const result = await deleteItem(id);
    
    if (!result) {
      return NextResponse.json(
        { error: `Item with ID ${id} not found` },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: `Item ${id} deleted successfully` },
      { status: 200 }
    );
  } catch (error: unknown) {
    const err = error as Error;
    const itemId = await params.then(p => p.id).catch(() => 'unknown');
    console.error(`Error deleting item ${itemId}:`, err);
    
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Query Parameters with Dynamic Route Parameters

```typescript
// app/api/products/[category]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params;
    
    // Parse query parameters
    const url = new URL(request.url);
    const sort = url.searchParams.get('sort') || 'name';
    const order = url.searchParams.get('order') || 'asc';
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    
    // Fetch products with filtering and pagination
    const products = await getProductsByCategory(category, {
      sort,
      order,
      limit,
      offset: (page - 1) * limit
    });
    
    return NextResponse.json({
      data: products.items,
      meta: {
        total: products.total,
        page,
        limit,
        pages: Math.ceil(products.total / limit)
      }
    });
  } catch (error: unknown) {
    const err = error as Error;
    const categorySafe = await params.then(p => p.category).catch(() => 'unknown');
    console.error(`Error fetching products for category ${categorySafe}:`, err);
    
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
```

Remember to always await the params Promise before using any of its properties, and handle potential Promise rejections in your error handling code.
