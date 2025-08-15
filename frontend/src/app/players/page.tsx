'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  PencilIcon, 
  PlusIcon, 
  TagIcon,
  InformationCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { groupAPI, Group } from '@/lib/api';

export default function PlayersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [newGroup, setNewGroup] = useState('');
  const [groupsLoading, setGroupsLoading] = useState(false);

  // Load groups from API
  const loadGroups = async () => {
    try {
      setGroupsLoading(true);
      const response = await groupAPI.getGroups();
      setGroups(response.data || []);
    } catch (error) {
      console.error('Error loading groups:', error);
    } finally {
      setGroupsLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadGroups();
    }
  }, [user]);



  const addGroup = async () => {
    if (newGroup.trim()) {
      try {
        await groupAPI.createGroup({ name: newGroup.trim() });
        await loadGroups(); // Reload groups after creating
        setNewGroup('');
      } catch (error) {
        console.error('Error creating group:', error);
      }
    }
  };

  const handleGroupKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addGroup();
    }
  };

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section - Groups */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="bg-blue-100 px-4 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Groups</h2>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                      Deploy all
                    </button>
                    <button className="px-3 py-1 bg-white text-red-600 text-sm border border-red-600 rounded hover:bg-red-50 transition-colors">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                {/* Groups List */}
                <div className="mb-4">
                  <div className="border border-gray-300 rounded-md p-2 h-32 overflow-y-auto">
                    {groupsLoading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-sm text-gray-600">Loading groups...</p>
                      </div>
                    ) : groups.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-500">No groups found</p>
                      </div>
                    ) : (
                      groups.map((group) => (
                        <div key={group._id} className="p-2 hover:bg-gray-50 rounded cursor-pointer">
                          <div className="font-medium text-gray-900">{group.name}</div>
                          {group.description && (
                            <div className="text-sm text-gray-500">{group.description}</div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Add New Group */}
                <div className="flex">
                  <input
                    type="text"
                    value={newGroup}
                    onChange={(e) => setNewGroup(e.target.value)}
                    onKeyPress={handleGroupKeyPress}
                    placeholder="Add new group"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-900"
                  />
                  <button
                    onClick={addGroup}
                    className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Reported Players */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="bg-blue-100 px-4 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-lg font-semibold text-gray-900">Reported Players</h2>
                    <InformationCircleIcon className="h-5 w-5 text-gray-500" />
                    <ArrowPathIcon className="h-5 w-5 text-gray-500 hover:text-gray-700 cursor-pointer" />
                  </div>
                  <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors flex items-center space-x-1">
                    <TagIcon className="h-4 w-4" />
                    <span>Labels</span>
                  </button>
                </div>
              </div>
              
              <div className="p-8">
                <div className="text-center">
                  <p className="text-gray-600 text-lg">There are no Players</p>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
} 