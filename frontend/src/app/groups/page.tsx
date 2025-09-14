'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo, useCallback, memo } from 'react';
import Link from 'next/link';
import { groupAPI } from '@/lib/api';
import type { Group } from './lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { PlusIcon, FunnelIcon, TagIcon } from '@heroicons/react/24/outline';
import { Cog6ToothIcon, UsersIcon, PlayIcon, CalendarDaysIcon, TrashIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Memoized Group Row Component
const GroupRow = memo(({ 
  group, 
  selectedGroups, 
  onGroupSelect,
  onGroupClick
}: {
  group: Group;
  selectedGroups: string[];
  onGroupSelect: (groupId: string) => void;
  onGroupClick: (group: Group) => void;
}) => {
  const handleGroupClick = useCallback(() => onGroupClick(group), [onGroupClick, group]);

  return (
    <TableRow className="border-b border-gray-200">
      {/* Checkbox */}
      <TableCell>
        <Checkbox 
          checked={selectedGroups.includes(group._id)}
          onCheckedChange={() => onGroupSelect(group._id)}
        />
      </TableCell>
      
      {/* Name */}
      <TableCell className="py-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <UsersIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <div 
              onClick={handleGroupClick}
              className="font-medium text-primary cursor-pointer transition-colors"
            >
              {group.name}
            </div>
            <div className="text-xs text-gray-400">
              {group.assets?.length || 0} assets, {group.playlists?.length || 0} playlists
            </div>
            <div className="text-xs text-gray-400">
              {group.orientation || 'landscape'} • {group.resolution || 'auto'}
            </div>
          </div>
        </div>
      </TableCell>
      
      {/* Type */}
      <TableCell>
        <span className="text-sm text-gray-600">Group</span>
      </TableCell>
      
      {/* Categories */}
      <TableCell>
        <span className="text-xs text-gray-400">No categories</span>
      </TableCell>
      
      {/* Actions */}
      <TableCell>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" title="Settings">
            <Cog6ToothIcon className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Deploy">
            <PlayIcon className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Schedule">
            <CalendarDaysIcon className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Delete" className="text-red-500 hover:text-red-700">
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
});

GroupRow.displayName = 'GroupRow';

export default function GroupsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

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

  // Filtered groups based on search term
  const filteredGroups = useMemo(() => {
    if (!searchTerm.trim()) return groups;
    
    const searchLower = searchTerm.toLowerCase();
    return groups.filter((group: Group) => {
      return (
        group.name.toLowerCase().includes(searchLower) ||
        (group.description && group.description.toLowerCase().includes(searchLower))
      );
    });
  }, [groups, searchTerm]);

  const handleSelectAll = useCallback(() => {
    if (selectedGroups.length === filteredGroups.length) {
      setSelectedGroups([]);
    } else {
      setSelectedGroups(filteredGroups.map((group: Group) => group._id));
    }
  }, [selectedGroups.length, filteredGroups]);

  const handleGroupSelect = useCallback((groupId: string) => {
    setSelectedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  }, []);

  const handleGroupClick = useCallback((group: Group) => {
    router.push(`/groups/${encodeURIComponent(group.name)}`);
  }, [router]);

  return (
    <div className="w-full h-full p-4">
      <div className="flex items-center justify-between rounded-md mb-6 p-6 bg-sidebar border border-gray-200">
        <div className="flex items-center space-x-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex items-center space-x-2">
                <PlusIcon className="w-4 h-4" />
                Add Group
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                Create New Group
              </DropdownMenuItem>
              <DropdownMenuItem>
                Import Groups
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Input 
            type="text" 
            placeholder="Search groups..." 
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
      
      {isLoading ? (
        <div className="p-6">Loading...</div>
      ) : groups ? (
        <div className="w-full bg-sidebar rounded-md p-4 border border-gray-200">
          <Table className="w-full bg-white rounded-md">
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox 
                    checked={selectedGroups.length === filteredGroups.length && filteredGroups.length > 0}
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
              {filteredGroups.length > 0 ? (
                filteredGroups.map((group: Group) => (
                  <GroupRow
                    key={group._id}
                    group={group}
                    selectedGroups={selectedGroups}
                    onGroupSelect={handleGroupSelect}
                    onGroupClick={handleGroupClick}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    {searchTerm ? `No groups found matching "${searchTerm}"` : 'No groups available'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="p-6">No data available</div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-4">
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
    </div>
  );
}
