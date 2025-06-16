'use client';

import { useState } from 'react';

export default function SignUpPage() {
  const [email, setEmail] = useState('jlutz@tootntotum.com');
  const [password, setPassword] = useState('password');
  const [name, setName] = useState('John Lutz');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('Sign up is disabled. Admin accounts are created by system administrators.');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Create Admin Account</h2>
            <p className="mt-2 text-sm text-gray-600">
              One-time admin account creation
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={true}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-400 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
            >
              Sign Up Disabled
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/login" className="text-sm text-blue-600 hover:text-blue-500">
              Back to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
