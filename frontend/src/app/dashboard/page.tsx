'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Player Reporting Status */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Player reporting status</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-green-500 text-white p-4 rounded-lg text-center">
                <div className="text-sm font-medium mb-1">NOW</div>
                <div className="text-2xl font-bold">0</div>
              </div>
              <div className="bg-blue-400 text-white p-4 rounded-lg text-center">
                <div className="text-sm font-medium mb-1">LAST 60 MINUTES</div>
                <div className="text-2xl font-bold">0</div>
              </div>
              <div className="bg-purple-500 text-white p-4 rounded-lg text-center">
                <div className="text-sm font-medium mb-1">LAST 4 HOURS</div>
                <div className="text-2xl font-bold">0</div>
              </div>
              <div className="bg-yellow-500 text-white p-4 rounded-lg text-center">
                <div className="text-sm font-medium mb-1">TODAY</div>
                <div className="text-2xl font-bold">0</div>
              </div>
              <div className="bg-pink-400 text-white p-4 rounded-lg text-center">
                <div className="text-sm font-medium mb-1">LAST 7 DAYS</div>
                <div className="text-2xl font-bold">0</div>
              </div>
              <div className="bg-red-500 text-white p-4 rounded-lg text-center">
                <div className="text-sm font-medium mb-1">&gt; 7 DAYS</div>
                <div className="text-2xl font-bold">0</div>
              </div>
            </div>
          </div>

          {/* Players Expected to Report Now */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Players expected to report now</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">There are no players went offline just now</p>
            </div>
          </div>

          {/* Additional Sections */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Players expected to report now</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-100 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Group wise</h3>
              </div>
              <div className="bg-blue-100 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Playlists playing</h3>
              </div>
              <div className="bg-blue-100 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Software version</h3>
              </div>
              <div className="bg-blue-100 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Location wise</h3>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
