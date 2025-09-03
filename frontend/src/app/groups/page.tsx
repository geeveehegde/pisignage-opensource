'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { groupAPI } from '@/lib/api';
import type { Group } from './lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings, Users, Play, Calendar, Trash2, Copy } from 'lucide-react';

export default function GroupsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Temporarily bypass authentication
  // useEffect(() => {
  //   if (!loading && !user) {
  //     router.push('/auth');
  //   }
  // }, [user, loading, router]);

  useEffect(() => {
    // Temporarily bypass authentication check
    // if (user) {
      fetchGroups();
    // }
  }, []); // Removed user dependency

  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await groupAPI.getGroups();
      const groupsData = response.data || [];
      setGroups(groupsData);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch groups');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    
    try {
      setIsCreating(true);
      setError(null);
      await groupAPI.createGroup({ name: newGroupName.trim() });
      setNewGroupName('');
      await fetchGroups(); // Refresh the list
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create group');
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateGroup();
    }
  };

  // Temporarily bypass authentication checks
  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center py-12">
  //       <div className="text-center">
  //       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
  //       <p className="mt-4 text-gray-600">Loading...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // if (!user) {
  //   return null;
  // }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Available Groups</h1>
            </div>
            <div className="flex space-x-3">
              <Button variant="default" size="sm">
                Download list
              </Button>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <Input
                type="text"
                placeholder="Filter by Name"
                className="text-sm"
              />
              <Button variant="outline" size="sm" className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.586V4z" />
                </svg>
                <span>Filter by category</span>
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">multiple</span>
              <select className="text-sm border border-gray-300 rounded px-2 py-1">
                <option>Select</option>
              </select>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800">{error}</p>
              <Button
                onClick={fetchGroups}
                variant="link"
                size="sm"
                className="mt-2 text-red-600 hover:text-red-800 p-0 h-auto"
              >
                Try again
              </Button>
            </div>
          )}

          {/* Add New Group */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Add a new group"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isCreating}
                className="flex-1"
              />
              <Button 
                onClick={handleCreateGroup}
                disabled={isCreating || !newGroupName.trim()}
                variant="default"
                >
                {isCreating ? 'ADDING...' : 'ADD'}
              </Button>
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            /* Groups List */
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {!Array.isArray(groups) || groups.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">👥</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No groups found</h3>
                  <p className="text-gray-500 mb-4">Get started by creating your first group</p>
                  <Button variant="default">
                    Create Your First Group
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {groups.map((group, index) => (
                    <div
                      key={group._id}
                      className={`flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      {/* Group Info */}
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <Link href={`/groups/${encodeURIComponent(group.name)}`}>
                            <h3 className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer truncate">
                              {group.name}
                            </h3>
                          </Link>
                          {group.description && (
                            <p className="text-xs text-gray-500 truncate mt-1">
                              {group.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Group Details */}
                      <div className="hidden sm:flex items-center space-x-8 flex-shrink-0">
                        <div className="text-sm text-gray-500">
                          {group.assets?.length || 0} assets, {group.playlists?.length || 0} playlists
                        </div>
                        <div className="text-sm text-gray-500">
                          {group.orientation || 'landscape'} • {group.resolution || 'auto'}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2 ml-4">
                        {/* Settings Icon */}
                        <Button variant="ghost" size="sm" className="p-2 text-blue-500 hover:text-blue-700" title="Settings">
                          <Settings className="w-4 h-4" />
                        </Button>

                        {/* Deploy Icon */}
                        <Button variant="ghost" size="sm" className="p-2 text-blue-500 hover:text-blue-700" title="Deploy">
                          <Play className="w-4 h-4" />
                        </Button>

                        {/* Schedule Icon */}
                        <Button variant="ghost" size="sm" className="p-2 text-blue-500 hover:text-blue-700" title="Schedule">
                          <Calendar className="w-4 h-4" />
                        </Button>

                        {/* Delete Icon */}
                        <Button variant="ghost" size="sm" className="p-2 text-red-500 hover:text-red-700" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </Button>

                        {/* Copy Icon */}
                        <Button variant="ghost" size="sm" className="p-2 text-gray-500 hover:text-gray-700" title="Copy">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
    </div>
  );
}
