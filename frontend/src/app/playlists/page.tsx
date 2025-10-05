'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo, useCallback, memo } from 'react';
import Link from 'next/link';
import { playlistAPI } from '@/lib/api';
import type { Playlist } from './lib/types';
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
import { CalendarDaysIcon, PlayIcon, TrashIcon, DocumentDuplicateIcon, QueueListIcon } from '@heroicons/react/24/outline';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Memoized Playlist Row Component
const PlaylistRow = memo(({ 
  playlist, 
  selectedPlaylists, 
  onPlaylistSelect,
  onPlaylistClick
}: {
  playlist: Playlist;
  selectedPlaylists: string[];
  onPlaylistSelect: (playlistId: string) => void;
  onPlaylistClick: (playlist: Playlist) => void;
}) => {
  const handlePlaylistClick = useCallback(() => onPlaylistClick(playlist), [onPlaylistClick, playlist]);

  return (
    <TableRow className="border-b border-gray-200">
      {/* Checkbox */}
      <TableCell>
        <Checkbox 
          checked={selectedPlaylists.includes(playlist.name)}
          onCheckedChange={() => onPlaylistSelect(playlist.name)}
        />
      </TableCell>
      
      {/* Name */}
      <TableCell className="py-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <QueueListIcon className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <div 
              onClick={handlePlaylistClick}
              className="font-medium text-primary cursor-pointer transition-colors"
            >
              {playlist.name}
            </div>
            <div className="text-xs text-gray-400">
              {playlist.assets?.length || 0} assets
            </div>
            <div className="text-xs text-gray-400">
              Layout: {playlist.layout || '1'} • {playlist.templateName || '10'} secs
            </div>
          </div>
        </div>
      </TableCell>
      
      {/* Type */}
      <TableCell>
        <span className="text-sm text-gray-600">Playlist</span>
      </TableCell>
      
      {/* Categories */}
      <TableCell>
        <span className="text-xs text-gray-400">No categories</span>
      </TableCell>
      
      {/* Actions */}
      <TableCell>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" title="Schedule">
            <CalendarDaysIcon className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Deploy">
            <PlayIcon className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Copy">
            <DocumentDuplicateIcon className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Delete" className="text-red-500 hover:text-red-700">
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
});

PlaylistRow.displayName = 'PlaylistRow';

export default function PlaylistsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);

  // Temporarily bypass authentication
  // useEffect(() => {
  //   if (!loading && !user) {
  //     router.push('/auth');
  //   }
  // }, [user, loading, router]);

  useEffect(() => {
    // Temporarily bypass authentication check
    // if (user) {
      fetchPlaylists();
    // }
  }, []); // Removed user dependency

  const fetchPlaylists = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await playlistAPI.getPlaylists();
      const playlistsData = response.data || [];
      setPlaylists(playlistsData);
    } catch (error: unknown) {
      setError((error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to fetch playlists');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered playlists based on search term
  const filteredPlaylists = useMemo(() => {
    if (!searchTerm.trim()) return playlists;
    
    const searchLower = searchTerm.toLowerCase();
    return playlists.filter((playlist: Playlist) => {
      return playlist.name.toLowerCase().includes(searchLower);
    });
  }, [playlists, searchTerm]);

  const handleSelectAll = useCallback(() => {
    if (selectedPlaylists.length === filteredPlaylists.length) {
      setSelectedPlaylists([]);
    } else {
      setSelectedPlaylists(filteredPlaylists.map((playlist: Playlist) => playlist.name));
    }
  }, [selectedPlaylists.length, filteredPlaylists]);

  const handlePlaylistSelect = useCallback((playlistId: string) => {
    setSelectedPlaylists(prev => 
      prev.includes(playlistId) 
        ? prev.filter(id => id !== playlistId)
        : [...prev, playlistId]
    );
  }, []);

  const handlePlaylistClick = useCallback((playlist: Playlist) => {
    router.push(`/playlists/${encodeURIComponent(playlist.name)}`);
  }, [router]);



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
    <div className="w-full h-full p-4">
      <div className="flex items-center justify-between rounded-md mb-6 p-6 bg-secondary">
        <div className="flex items-center space-x-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex items-center space-x-2">
                <PlusIcon className="w-4 h-4" />
                Add Playlist
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                Create New Playlist
              </DropdownMenuItem>
              <DropdownMenuItem>
                Import Playlists
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Input 
            type="text" 
            placeholder="Search playlists..." 
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
      ) : playlists ? (
        <div className="w-full bg-secondary rounded-md p-4">
          <Table className="w-full bg-white rounded-md">
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox 
                    checked={selectedPlaylists.length === filteredPlaylists.length && filteredPlaylists.length > 0}
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
              {filteredPlaylists.length > 0 ? (
                filteredPlaylists.map((playlist: Playlist) => (
                  <PlaylistRow
                    key={playlist.name}
                    playlist={playlist}
                    selectedPlaylists={selectedPlaylists}
                    onPlaylistSelect={handlePlaylistSelect}
                    onPlaylistClick={handlePlaylistClick}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    {searchTerm ? `No playlists found matching "${searchTerm}"` : 'No playlists available'}
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
            onClick={fetchPlaylists}
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
