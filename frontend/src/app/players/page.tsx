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
  ArrowPathIcon,
  CalendarIcon, 
  CogIcon, 
  ExclamationTriangleIcon,
  ChevronDownIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon
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
  const [serverVersion, setServerVersion] = useState<any>({});
  const [pagination, setPagination] = useState<any>({});

  // Form states for PiSignage interface
  const [defaultPlaylist, setDefaultPlaylist] = useState('default');
  const [deployOptions, setDeployOptions] = useState({
    playDefaultAlongside: false,
    combineContent: false,
    shuffleContent: false,
    switchAtEnd: false
  });
  const [defaultCustomTemplate, setDefaultCustomTemplate] = useState('default');
  const [filterName, setFilterName] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [useMultiSelection, setUseMultiSelection] = useState(false);

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
        params.groupName = selectedGroup; // Use groupName parameter for filtering by group name
      }
      
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      
      if (searchTerm.trim()) {
        params.string = searchTerm.trim(); // Use 'string' parameter for name search
      }
      
      const response = await playerAPI.getPlayers(params);
      // Extract players from the new response structure
      const playersData = response.data?.objects || [];
      setPlayers(playersData);
      // Store server version information
      setServerVersion(response.data?.currentVersion || {});
      // Store pagination information
      setPagination({
        page: response.data?.page || 0,
        pages: response.data?.pages || 1,
        count: response.data?.count || 0
      });
    } catch (error) {
      console.error('Error loading players:', error);
    } finally {
      setPlayersLoading(false);
    }
  };

  const handleDeployOptionChange = (option: keyof typeof deployOptions) => {
    setDeployOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  // Temporarily bypass authentication
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
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
  //         <p className="mt-4 text-gray-600">Loading...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // if (!user) {
  //   return null;
  // }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Navigation Bar */}
      <div className="flex justify-end space-x-3 mb-6">
        <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm flex items-center space-x-2">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <span>Emergency Message</span>
        </button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm flex items-center space-x-2">
          <TagIcon className="h-4 w-4" />
          <span>Set Group Ticker</span>
        </button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm flex items-center space-x-2">
          <CalendarIcon className="h-4 w-4" />
          <span>view schedule</span>
        </button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm flex items-center space-x-2">
          <CogIcon className="h-4 w-4" />
          <span>Settings</span>
        </button>
      </div>

      <div className="space-y-8">
        {/* Schedule Playlists for default Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Schedule Playlists for default</h2>
          
          {/* Default Playlist Row */}
          <div className="flex items-center space-x-4 mb-6">
            <label className="text-sm font-medium text-gray-700">Default Playlist:</label>
            <div className="relative">
              <select 
                value={defaultPlaylist}
                onChange={(e) => setDefaultPlaylist(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="default">default</option>
                <option value="playlist1">playlist1</option>
                <option value="playlist2">playlist2</option>
              </select>
              <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <span className="text-sm text-gray-600">Default playlist is played when no scheduled playlists are available</span>
          </div>

          {/* Deploy Options */}
          <div className="space-y-3 mb-6">
            <h3 className="text-sm font-medium text-gray-700">Deploy Options:</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={deployOptions.playDefaultAlongside}
                  onChange={() => handleDeployOptionChange('playDefaultAlongside')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Play default playlist along with scheduled playlist(s)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={deployOptions.combineContent}
                  onChange={() => handleDeployOptionChange('combineContent')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Combine content of all scheduled playlists</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={deployOptions.shuffleContent}
                  onChange={() => handleDeployOptionChange('shuffleContent')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Shuffle content every cycle</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={deployOptions.switchAtEnd}
                  onChange={() => handleDeployOptionChange('switchAtEnd')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Switch to new at the end of current playlist</span>
              </label>
            </div>
          </div>

          {/* Schedule Additional Playlists */}
          <div className="mb-6">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm">
              + Schedule additional Playlists
            </button>
          </div>

          {/* Default Settings Row */}
          <div className="flex items-center space-x-6 mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Default Playlist for scheduling:</span>
              <div className="relative">
                <select className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>default</option>
                </select>
                <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Default Custom Template:</span>
              <div className="relative">
                <select className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>default</option>
                </select>
                <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Main Deployment Controls */}
          <div className="flex items-center space-x-4 mb-6">
            <button className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 transition-colors text-lg font-medium">
              DEPLOY
            </button>
            <button className="bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors text-lg font-medium flex items-center space-x-2">
              <ClockIcon className="h-5 w-5" />
              <span>NOW</span>
            </button>
          </div>
        </div>

        {/* Registered Players Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Registered Players </h2>
            <button className="text-blue-600 hover:text-blue-700">
              <ArrowPathIcon className="h-5 w-5" />
            </button>
          </div>
          
          {/* Summary Statistics */}
          <div className="text-sm text-gray-600 mb-6">
            total:1 online:0 not-playing:0 licensed:1
          </div>

          {/* Filter and Action Bar */}
          <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            {/* Filter Inputs */}
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Filter by Name</label>
                <input
                  type="text"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Filter by Location</label>
                <input
                  type="text"
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Enter location"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Filter by category</label>
                <div className="relative">
                  <select 
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    <option value="office">Office</option>
                    <option value="retail">Retail</option>
                    <option value="restaurant">Restaurant</option>
                  </select>
                  <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Filter by status</label>
                <div className="relative">
                  <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All status</option>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="playing">Playing</option>
                    <option value="not-playing">Not Playing</option>
                  </select>
                  <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Checkbox and Action Buttons */}
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={useMultiSelection}
                  onChange={(e) => setUseMultiSelection(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Use multi-selection</span>
              </label>
              <button className="text-blue-600 hover:text-blue-700 text-sm underline">
                Download List
              </button>
              <button className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-sm">
                Schedule Update
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm">
                Register a Player
              </button>
            </div>
          </div>

          {/* Player List Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                      <span>Player name</span>
                      <ArrowUpIcon className="h-3 w-3" />
                      <ClockIcon className="h-3 w-3" />
                      <ArrowDownIcon className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Playlist
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Group
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-600 cursor-pointer hover:underline">
                      piplayer
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-blue-600 cursor-pointer hover:underline">
                      default
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-blue-600 cursor-pointer hover:underline">
                      default
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-blue-600 cursor-pointer hover:underline">
                      Bengaluru, KA
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 