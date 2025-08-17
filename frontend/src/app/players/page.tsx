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
import { playerAPI } from '@/lib/api';

export default function PlayersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [newGroup, setNewGroup] = useState('');
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [players, setPlayers] = useState<any[]>([]);
  const [playersLoading, setPlayersLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

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

  // Load players from API
  const loadPlayers = async () => {
    try {
      setPlayersLoading(true);
      const params: any = {};
      
      if (selectedGroup !== 'all') {
        params.group = selectedGroup;
      }
      
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      
      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }
      
      const response = await playerAPI.getPlayers(params);
      setPlayers(response.data || []);
    } catch (error) {
      console.error('Error loading players:', error);
    } finally {
      setPlayersLoading(false);
    }
  };

  // Temporarily bypass authentication
  // useEffect(() => {
  //   if (!loading && !user) {
  //     router.push('/auth');
  //   }
  // }, [user, loading, router]);

  useEffect(() => {
    // Temporarily bypass authentication check
    // if (user) {
      loadGroups();
      loadPlayers();
    // }
  }, []); // Removed user dependency

  // Reload players when filters change
  useEffect(() => {
    loadPlayers();
  }, [selectedGroup, statusFilter, searchTerm]);



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

  // Temporarily bypass authentication checks
  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center py-12">
  //       <div className="text-center">
  //       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
  //       <p className="mt-12 text-gray-600">Loading...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // if (!user) {
  //   return null;
  // }

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
                      <>
                        <div 
                          key="all" 
                          className={`p-2 hover:bg-gray-50 rounded cursor-pointer ${selectedGroup === 'all' ? 'bg-blue-50 border border-blue-200' : ''}`}
                          onClick={() => setSelectedGroup('all')}
                        >
                          <div className="font-medium text-gray-900">All Groups</div>
                          <div className="text-sm text-gray-500">{players.length} players</div>
                        </div>
                        {groups.map((group) => {
                          const groupPlayers = players.filter(p => p.group?.name === group.name);
                          return (
                            <div 
                              key={group._id} 
                              className={`p-2 hover:bg-gray-50 rounded cursor-pointer ${selectedGroup === group.name ? 'bg-blue-50 border border-blue-200' : ''}`}
                              onClick={() => setSelectedGroup(group.name)}
                            >
                              <div className="font-medium text-gray-900">{group.name}</div>
                              <div className="text-sm text-gray-500">{groupPlayers.length} players</div>
                            </div>
                          );
                        })}
                      </>
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

          {/* Right Section - Players List */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="bg-blue-100 px-4 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-lg font-semibold text-gray-900">Players</h2>
                    <InformationCircleIcon className="h-5 w-5 text-gray-500" />
                    <ArrowPathIcon 
                      className="h-5 w-5 text-gray-500 hover:text-gray-700 cursor-pointer" 
                      onClick={loadPlayers}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="connected">Connected</option>
                      <option value="disconnected">Disconnected</option>
                    </select>
                    <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors flex items-center space-x-1">
                      <TagIcon className="h-4 w-4" />
                      <span>Labels</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Search Bar */}
              <div className="p-4 border-b border-gray-200">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search players by name or CPU serial number..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-900"
                />
              </div>
              
              {/* Players List */}
              <div className="p-4">
                {playersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading players...</p>
                  </div>
                ) : players.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-2">📺</div>
                    <p className="text-gray-600 text-lg">No players found</p>
                    <p className="text-gray-500 text-sm">
                      {searchTerm || statusFilter !== 'all' || selectedGroup !== 'all' 
                        ? 'Try adjusting your filters' 
                        : 'Players will appear here when they connect'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {players.map((player) => (
                      <div 
                        key={player._id} 
                        className={`p-4 border rounded-lg transition-colors ${
                          player.isConnected 
                            ? 'border-green-200 bg-green-50' 
                            : 'border-red-200 bg-red-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${
                                player.isConnected ? 'bg-green-500' : 'bg-red-500'
                              }`}></div>
                              <div>
                                <h3 className="font-medium text-gray-900">
                                  {player.name || `Player-${player.cpuSerialNumber}`}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {player.cpuSerialNumber}
                                </p>
                              </div>
                            </div>
                            <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">IP:</span> {player.ip || 'Unknown'}
                              </div>
                              <div>
                                <span className="font-medium">Group:</span> {player.group?.name || 'default'}
                              </div>
                              <div>
                                <span className="font-medium">Version:</span> {player.version || 'Unknown'}
                              </div>
                              <div>
                                <span className="font-medium">Last Seen:</span> {
                                  player.lastReported 
                                    ? new Date(player.lastReported).toLocaleString()
                                    : 'Never'
                                }
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-blue-500 hover:text-blue-700 transition-colors" title="View Details">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button className="p-2 text-green-500 hover:text-green-700 transition-colors" title="Deploy">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
    </div>
  );
} 