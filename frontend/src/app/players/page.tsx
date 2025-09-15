'use client';

import React, { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { useRouter } from 'next/navigation';
import { groupAPI, playerAPI } from '@/lib/api';
import type { Player } from './lib/types';
import type { Group } from '@/app/groups/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  UserPlusIcon,
  FunnelIcon,
  TagIcon,
  Cog6ToothIcon,
  EllipsisVerticalIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  ClockIcon,
  PlayIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';

// Memoized Player Row Component
const PlayerRow = memo(({ 
  player, 
  selectedPlayers, 
  onPlayerSelect
}: {
  player: Player;
  selectedPlayers: string[];
  onPlayerSelect: (playerId: string) => void;
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'playing': return 'bg-blue-500';
      case 'offline': return 'bg-red-500';
      case 'not-playing': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <TableRow className="border-b border-gray-200">
      {/* Checkbox */}
      <TableCell>
        <Checkbox 
          checked={selectedPlayers.includes(player._id)}
          onCheckedChange={() => onPlayerSelect(player._id)}
        />
      </TableCell>
      
      {/* Name */}
      <TableCell className="py-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <ComputerDesktopIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-primary">
              {player.name || player._id}
            </div>
            <div className="text-xs text-gray-400">
              {player.location || 'Unknown location'}
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(player.status)}`}></div>
              <span className="text-xs text-gray-500 capitalize">{player.status}</span>
            </div>
          </div>
        </div>
      </TableCell>
      
      {/* Type */}
      <TableCell>
        <span className="text-sm text-gray-600">Player</span>
      </TableCell>
      
      {/* Categories */}
      <TableCell>
        <span className="text-xs text-gray-400">{player.group || 'No group'}</span>
      </TableCell>
      
      {/* Actions */}
      <TableCell>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <EllipsisVerticalIcon className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <PlayIcon className="w-4 h-4 mr-2" />
                Control Player
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Cog6ToothIcon className="w-4 h-4 mr-2" />
                Player Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ClockIcon className="w-4 h-4 mr-2" />
                Schedule
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
});

PlayerRow.displayName = 'PlayerRow';

export default function PlayersPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);

  // Stats
  const [playerStats, setPlayerStats] = useState({
    total: 0,
    online: 0,
    offline: 0,
    licensed: 0
  });

  // Load data
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Load groups and players in parallel
      const [groupsResponse, playersResponse, statsResponse] = await Promise.all([
        groupAPI.getGroups(),
        playerAPI.getPlayers({}),
        playerAPI.getPlayerStats()
      ]);

      setGroups(groupsResponse.data || []);
      setPlayers(playersResponse.data?.objects || []);
      setPlayerStats({
        total: statsResponse.data?.total || 0,
        online: statsResponse.data?.online || 0,
        offline: statsResponse.data?.offline || 0,
        licensed: statsResponse.data?.licensed || 0
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtered players based on search term
  const filteredPlayers = useMemo(() => {
    if (!searchTerm.trim()) return players;
    
    const searchLower = searchTerm.toLowerCase();
    return players.filter((player: Player) => {
      return (
        (player.name && player.name.toLowerCase().includes(searchLower)) ||
        player._id.toLowerCase().includes(searchLower) ||
        (player.location && player.location.toLowerCase().includes(searchLower)) ||
        (player.group && player.group.toLowerCase().includes(searchLower))
      );
    });
  }, [players, searchTerm]);

  const handleSelectAll = useCallback(() => {
    if (selectedPlayers.length === filteredPlayers.length) {
      setSelectedPlayers([]);
    } else {
      setSelectedPlayers(filteredPlayers.map((player: Player) => player._id));
    }
  }, [selectedPlayers.length, filteredPlayers]);

  const handlePlayerSelect = useCallback((playerId: string) => {
    setSelectedPlayers(prev => 
      prev.includes(playerId) 
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    );
  }, []);

  // Load data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'playing': return 'bg-blue-500';
      case 'offline': return 'bg-red-500';
      case 'not-playing': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full">
        <div className="flex items-center justify-between mb-6 p-6">
          <h1 className="text-2xl font-bold">Players</h1>
        </div>
        <div className="p-6">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-4">
      <div className="flex items-center justify-between rounded-md mb-6 p-6 bg-secondary">
        <div className="flex items-center space-x-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex items-center space-x-2">
                <UserPlusIcon className="w-4 h-4" />
                Add Player
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                Register Player
              </DropdownMenuItem>
              <DropdownMenuItem>
                Import Players
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Input 
            type="text" 
            placeholder="Search players..." 
            className="w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" title="Filter">
            <FunnelIcon className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" title="Categories">
            <TagIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      
      {loading ? (
        <div className="p-6">Loading...</div>
      ) : players ? (
        <div className="w-full bg-secondary rounded-md p-4">
          <Table className="w-full bg-white rounded-md">
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox 
                    checked={selectedPlayers.length === filteredPlayers.length && filteredPlayers.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlayers.length > 0 ? (
                filteredPlayers.map((player: Player) => (
                  <PlayerRow
                    key={player._id}
                    player={player}
                    selectedPlayers={selectedPlayers}
                    onPlayerSelect={handlePlayerSelect}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    {searchTerm ? `No players found matching "${searchTerm}"` : 'No players available'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="p-6">No data available</div>
      )}
    </div>
  );
}