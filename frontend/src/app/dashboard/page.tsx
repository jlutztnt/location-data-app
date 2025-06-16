'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession, signOut } from '@/lib/auth-client';

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login');
    }
  }, [session, isPending, router]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Sign out error:', error);
      setIsSigningOut(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              Toot&apos;n Totum Location Data Admin
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {session.user?.email || 'Admin'}
              </span>
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                disabled={isSigningOut}
              >
                {isSigningOut ? 'Signing out...' : 'Sign Out'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Locations Management Card */}
            <Card>
              <CardHeader>
                <CardTitle>Store Locations</CardTitle>
                <CardDescription>
                  Manage store information, hours, and contact details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard/locations" passHref>
                  <Button className="w-full">
                    Manage Locations
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Districts Management Card */}
            <Card>
              <CardHeader>
                <CardTitle>Districts</CardTitle>
                <CardDescription>
                  Organize stores by districts and regions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" disabled>
                  Manage Districts
                  <span className="ml-2 text-xs">(Coming Soon)</span>
                </Button>
              </CardContent>
            </Card>

            {/* Managers Management Card */}
            <Card>
              <CardHeader>
                <CardTitle>Store Managers</CardTitle>
                <CardDescription>
                  Update manager information and assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" disabled>
                  Manage Managers
                  <span className="ml-2 text-xs">(Coming Soon)</span>
                </Button>
              </CardContent>
            </Card>

            {/* Data Sync Card */}
            <Card>
              <CardHeader>
                <CardTitle>Data Synchronization</CardTitle>
                <CardDescription>
                  Sync with Google My Business and import CSV data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" disabled>
                  Sync Data
                  <span className="ml-2 text-xs">(Coming Soon)</span>
                </Button>
              </CardContent>
            </Card>

            {/* API Access Card */}
            <Card>
              <CardHeader>
                <CardTitle>API Management</CardTitle>
                <CardDescription>
                  Manage API keys and access permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" disabled>
                  API Settings
                  <span className="ml-2 text-xs">(Coming Soon)</span>
                </Button>
              </CardContent>
            </Card>

            {/* System Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>
                  Monitor system health and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Database</span>
                    <span className="text-sm text-green-600 font-medium">✓ Online</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">API</span>
                    <span className="text-sm text-green-600 font-medium">✓ Online</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Authentication</span>
                    <span className="text-sm text-green-600 font-medium">✓ Working</span>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </main>
    </div>
  );
}
