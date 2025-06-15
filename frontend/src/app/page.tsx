import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Toot&apos;n Totum
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Location Data Service
          </p>
          
          <div className="space-y-4">
            <Link
              href="/login"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 block text-center"
            >
              Admin Login
            </Link>
            
            <Link
              href="/dashboard"
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200 block text-center"
            >
              Dashboard
            </Link>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Centralized store location management system
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
