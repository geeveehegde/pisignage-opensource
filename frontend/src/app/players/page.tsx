'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { groupAPI, playerAPI } from '@/lib/api';
import type { Player } from './lib/types';
import type { Group } from '@/app/groups/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Settings,
  MoreVertical,
  RefreshCw,
  Download,
  UserPlus,
  Clock,
  ArrowUpDown,
  Play
} from 'lucide-react';

export default function PlayersPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
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
        playerAPI.getPlayers({
          group: selectedGroup !== 'all' ? selectedGroup : undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          search: searchTerm.trim() || undefined,
        }),
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

  const handlePlayerSelect = (playerId: string) => {
    setSelectedPlayers(prev => 
      prev.includes(playerId) 
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    );
  };

  const handleSelectAll = () => {
    setSelectedPlayers(
      selectedPlayers.length === players.length 
        ? [] 
        : players.map(p => p._id)
    );
  };

  const handleRefresh = () => {
    fetchData();
  };

  // Load data on mount and when filters change
  useEffect(() => {
    fetchData();
  }, [selectedGroup, statusFilter, searchTerm]);

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
    <div className="w-full h-full">
      <div className="flex items-center justify-between mb-6 p-6">
        <h1 className="text-2xl font-bold">Players</h1>
      </div>

      {/* Players Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Registered Players</h2>
            <div className="text-sm text-gray-600 mt-1">
              total: {playerStats.total} | online: {playerStats.online} | offline: {playerStats.offline} | licensed: {playerStats.licensed}
            </div>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <Input
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Groups</SelectItem>
              {groups.map((group) => (
                <SelectItem key={group._id} value={group.name}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
              <SelectItem value="playing">Playing</SelectItem>
              <SelectItem value="not-playing">Not Playing</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download List
          </Button>
          <Button variant="outline" size="sm">
            <UserPlus className="w-4 h-4 mr-2" />
            Register Player
          </Button>
        </div>

        {/* Players Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  checked={selectedPlayers.length === players.length && players.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
              </TableHead>
              <TableHead>
                <div className="flex items-center space-x-1">
                  <span>Player Name</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </TableHead>
              <TableHead>Current Playlist</TableHead>
              <TableHead>Group</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player) => (
              <TableRow key={player._id}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedPlayers.includes(player._id)}
                    onChange={() => handlePlayerSelect(player._id)}
                    className="rounded border-gray-300"
                  />
                </TableCell>
                <TableCell>
                  <div className="font-medium text-blue-600 cursor-pointer hover:underline">
                    {player.name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-blue-600 cursor-pointer hover:underline">
                    {player.currentPlaylist || 'default'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-blue-600 cursor-pointer hover:underline">
                    {player.group || 'default'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-blue-600 cursor-pointer hover:underline">
                    {player.location || 'Unknown'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(player.status)}`}></div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Play className="w-4 h-4 mr-2" />
                        Control Player
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="w-4 h-4 mr-2" />
                        Player Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Clock className="w-4 h-4 mr-2" />
                        Schedule
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {players.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No players found</p>
          </div>
        )}
      </div>
    </div>
  );
}