'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
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
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TickerDialog from './components/TickerDialog';
import EmergencyMessageDialog from './components/EmergencyMessageDialog';
import SettingsDialog from './components/SettingsDialog';

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
  
  // Dialog state
  const [emergencyMessageOpen, setEmergencyMessageOpen] = useState(false);
  const [groupTickerOpen, setGroupTickerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

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
                <EmergencyMessageDialog
          open={emergencyMessageOpen}
          onOpenChange={setEmergencyMessageOpen}
        />
        <TickerDialog
          open={groupTickerOpen}
          onOpenChange={setGroupTickerOpen}
        />
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <CalendarIcon className="h-4 w-4" />
          <span>view schedule</span>
        </Button>
        <SettingsDialog
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
        />
        <Button variant="default" size="sm" >
              DEPLOY
            </Button>

      </div>

      <div className="space-y-8">
        {/* Schedule Playlists for default Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Schedule Playlists for default</h2>
          
          {/* Default Playlist Row */}
          <div className="flex items-center space-x-4 mb-6">
            <label className="text-sm font-medium text-gray-700">Default Playlist:</label>
            <Select value={defaultPlaylist} onValueChange={setDefaultPlaylist}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select playlist" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">default</SelectItem>
                <SelectItem value="playlist1">playlist1</SelectItem>
                <SelectItem value="playlist2">playlist2</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-600">Default playlist is played when no scheduled playlists are available</span>
          </div>

          {/* Deploy Options */}
          <div className="space-y-3 mb-6">
            <h3 className="text-sm font-medium text-gray-700">Deploy Options:</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={deployOptions.playDefaultAlongside}
                  onCheckedChange={(checked) => handleDeployOptionChange('playDefaultAlongside')}
                />
                <span className="text-sm text-gray-700">Play default playlist along with scheduled playlist(s)</span>
              </label>
              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={deployOptions.combineContent}
                  onCheckedChange={(checked) => handleDeployOptionChange('combineContent')}
                />
                <span className="text-sm text-gray-700">Combine content of all scheduled playlists</span>
              </label>
              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={deployOptions.shuffleContent}
                  onCheckedChange={(checked) => handleDeployOptionChange('shuffleContent')}
                />
                <span className="text-sm text-gray-700">Shuffle content every cycle</span>
              </label>
              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={deployOptions.switchAtEnd}
                  onCheckedChange={(checked) => handleDeployOptionChange('switchAtEnd')}
                />
                <span className="text-sm text-gray-700">Switch to new at the end of current playlist</span>
              </label>
            </div>
          </div>

          {/* Schedule Additional Playlists */}
          <div className="mb-6">
            <Button variant="default" size="sm">
              + Schedule additional Playlists
            </Button>
          </div>

          {/* Default Settings Row */}
          <div className="flex items-center space-x-6 mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Default Playlist for scheduling:</span>
              <Select value="default" onValueChange={() => {}}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select playlist" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">default</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Default Custom Template:</span>
              <Select value="default" onValueChange={() => {}}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">default</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

        </div>

        {/* Registered Players Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Registered Players </h2>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
              <ArrowPathIcon className="h-5 w-5" />
            </Button>
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
                <Input
                  type="text"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  placeholder="Enter name"
                  className="text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Filter by Location</label>
                <Input
                  type="text"
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  placeholder="Enter location"
                  className="text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Filter by category</label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Filter by status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="All status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All status</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="playing">Playing</SelectItem>
                    <SelectItem value="not-playing">Not Playing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Checkbox and Action Buttons */}
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={useMultiSelection}
                  onCheckedChange={(checked) => setUseMultiSelection(checked as boolean)}
                />
                <span className="text-sm text-gray-700">Use multi-selection</span>
              </label>
              <Button variant="link" size="sm" className="text-blue-600 hover:text-blue-700 underline">
                Download List
              </Button>
              <Button variant="outline" size="sm">
                Schedule Update
              </Button>
              <Button variant="default" size="sm">
                Register a Player
              </Button>
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