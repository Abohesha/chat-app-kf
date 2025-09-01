'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="text-center px-4 max-w-lg">
        <h1 className="text-6xl font-bold text-white mb-4">⚠️</h1>
        <h2 className="text-2xl text-white/90 mb-8">Something went wrong!</h2>
        <p className="text-white/70 mb-8">
          An unexpected error occurred. Please try again or return to the home page.
        </p>
        <div className="space-x-4">
          <button
            onClick={reset}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform duration-300 inline-block"
          >
            Try Again
          </button>
          <Link 
            href="/"
            className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform duration-300 inline-block"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}