'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { playlistAPI, assetAPI, API_BASE_URL } from '@/lib/api';
import type { Playlist } from '../lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Settings } from 'lucide-react';
import PlaylistSettingsDialog from '../components/PlaylistSettingsDialog';

interface PlaylistDetailPageProps {
  params: Promise<{
    file: string;
  }>;
}

export default function PlaylistDetailPage({ params }: PlaylistDetailPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const playlistName = resolvedParams.file;
  
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [allFiles, setAllFiles] = useState<string[]>([]);
  const [allAssets, setAllAssets] = useState<any[]>([]);
  const [assetDurations, setAssetDurations] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    if (playlistName) {
      fetchPlaylistDetails();
    }
  }, [playlistName]);

  const fetchPlaylistDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load playlist details and files data (which includes dbdata with thumbnails)
      const [playlistResponse, filesResponse] = await Promise.all([
        playlistAPI.getPlaylist(playlistName),
        assetAPI.getFiles()
      ]);
      
      setPlaylist(playlistResponse.data);
      setAllFiles(filesResponse.data?.files || []);
      setAllAssets(filesResponse.data?.dbdata || []);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch playlist details');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (settings: any) => {
    try {
      // Update playlist with new settings
      const updatedPlaylist = {
        ...playlist,
        layout: settings.layout,
        templateName: settings.templateName,
        settings: {
          ticker: {
            enable: settings.tickerEnable,
            behavior: settings.tickerBehavior,
            textSpeed: settings.tickerTextSpeed,
            rss: {
              enable: settings.useRssFeed,
              link: settings.rssLink,
              feedDelay: settings.rssFeedDelay
            }
          },
          audio: {
            enable: settings.audioEnable,
            random: settings.audioRandom,
            volume: settings.audioVolume
          },
          ads: {
            adPlaylist: settings.adPlaylist,
            adCount: settings.adCount,
            adInterval: settings.adInterval
          }
        }
      };
      
      await playlistAPI.updatePlaylist(playlistName, updatedPlaylist);
      setPlaylist(updatedPlaylist as Playlist);
      console.log('Playlist settings saved successfully');
    } catch (error) {
      console.error('Error saving playlist settings:', error);
    }
  };

  const handleAssetToggle = async (fileName: string, enabled: boolean) => {
    if (!playlist) return;

    try {
      let updatedAssets: string[];
      
      if (enabled) {
        // Add asset to playlist if not already present
        updatedAssets = playlist.assets?.includes(fileName) 
          ? playlist.assets 
          : [...(playlist.assets || []), fileName];
        
        // Set default duration if not exists
        if (!assetDurations[fileName]) {
          setAssetDurations(prev => ({ ...prev, [fileName]: 10 }));
        }
      } else {
        // Remove asset from playlist
        updatedAssets = playlist.assets?.filter(asset => asset !== fileName) || [];
        // Remove duration setting
        setAssetDurations(prev => {
          const newDurations = { ...prev };
          delete newDurations[fileName];
          return newDurations;
        });
      }

      const updatedPlaylist = { ...playlist, assets: updatedAssets };
      await playlistAPI.updatePlaylist(playlistName, updatedPlaylist);
      setPlaylist(updatedPlaylist);
    } catch (error) {
      console.error('Error updating asset:', error);
    }
  };

  const handleDurationChange = (fileName: string, duration: number) => {
    setAssetDurations(prev => ({ ...prev, [fileName]: duration }));
  };

  const saveDurations = async () => {
    if (!playlist) return;

    try {
      // Here you would typically save the durations to the backend
      // For now, we'll just log them
      console.log('Asset durations:', assetDurations);
      
      // You could extend the playlist model to include asset durations
      // const updatedPlaylist = { ...playlist, assetDurations };
      // await playlistAPI.updatePlaylist(playlistName, updatedPlaylist);
    } catch (error) {
      console.error('Error saving durations:', error);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full">
        <div className="flex items-center justify-between mb-6 p-6">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => router.back()} 
              variant="outline" 
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Loading...</h1>
          </div>
        </div>
        <div className="p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full">
        <div className="flex items-center justify-between mb-6 p-6">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => router.back()} 
              variant="outline" 
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Error</h1>
          </div>
        </div>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
            <Button
              onClick={fetchPlaylistDetails}
              variant="link"
              size="sm"
              className="mt-2 text-red-600 hover:text-red-800 p-0 h-auto"
            >
              Try again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between mb-6 p-6">
        <div className="flex items-center space-x-4">
          <Button 
            onClick={() => router.back()} 
            variant="outline" 
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">{playlist?.name || playlistName}</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => setSettingsOpen(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button variant="default">
            Deploy
          </Button>
        </div>
      </div>

      {/* Playlist Assets */}
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Assets in Playlist</h2>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {playlist?.assets?.length || 0} of {allFiles.length} assets selected
              </div>
              {Object.keys(assetDurations).length > 0 && (
                <Button onClick={saveDurations} variant="outline" size="sm">
                  Save Durations
                </Button>
              )}
            </div>
          </div>
          
          {allFiles.length > 0 ? (
            <div className="space-y-3">
              {allFiles.map((file, index) => {
                const isEnabled = playlist?.assets?.includes(file) || false;
                const duration = assetDurations[file] || 10;
                // Find the corresponding asset data for this file
                const assetData = allAssets.find(asset => asset.name === file);
                
                return (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border ${
                      isEnabled 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        {/* Thumbnail */}
                        <div className="flex-shrink-0">
                          {assetData?.thumbnail ? (
                            <img 
                              src={`${API_BASE_URL}${assetData.thumbnail}`}
                              alt={file}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              <div className="w-6 h-6 bg-gray-300 rounded-sm"></div>
                            </div>
                          )}
                        </div>
                        
                        {/* File Name */}
                        <span className={`font-medium ${
                          isEnabled ? 'text-green-900' : 'text-gray-700'
                        }`}>
                          {file}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {isEnabled && (
                          <div className="flex items-center space-x-2">
                            <label className="text-xs font-medium text-gray-600">Duration (sec):</label>
                            <Input
                              type="number"
                              value={duration}
                              onChange={(e) => handleDurationChange(file, parseInt(e.target.value) || 10)}
                              min="1"
                              max="3600"
                              className="w-20 h-8 text-xs"
                            />
                          </div>
                        )}
                        
                        {/* Checkbox moved to the right */}
                        <Checkbox
                          checked={isEnabled}
                          onCheckedChange={(checked) => handleAssetToggle(file, checked as boolean)}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">📁</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No assets found</h3>
              <p className="text-gray-500">No files are available in the system</p>
            </div>
          )}


        </div>
      </div>

      {/* Settings Dialog */}
      <PlaylistSettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        playlist={playlist}
        onSave={handleSaveSettings}
      />
    </div>
  );
}
