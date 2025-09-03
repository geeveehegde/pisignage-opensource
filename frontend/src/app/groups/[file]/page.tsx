'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { groupAPI } from '@/lib/api';
import type { DeployOptions, TickerSettings, EmergencyMessage } from '../lib/types';
import type { Group } from '../lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { 
  Calendar,
  Settings,
  MessageSquare,
  Play
} from 'lucide-react';
import TickerDialog from '../components/TickerDialog';
import EmergencyMessageDialog from '../components/EmergencyMessageDialog';
import SettingsDialog from '../components/SettingsDialog';

interface GroupDetailPageProps {
  params: Promise<{
    file: string;
  }>;
}

export default function GroupDetailPage({ params }: GroupDetailPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const groupName = decodeURIComponent(resolvedParams.file);
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [defaultPlaylist, setDefaultPlaylist] = useState('default');
  const [deployOptions, setDeployOptions] = useState<DeployOptions>({
    playDefaultAlongside: false,
    combineContent: false,
    shuffleContent: false,
    switchAtEnd: false
  });

  // Dialog states
  const [emergencyMessageOpen, setEmergencyMessageOpen] = useState(false);
  const [tickerDialogOpen, setTickerDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);



  // Load data
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Load groups
      const groupsResponse = await groupAPI.getGroups();

      const allGroups = groupsResponse.data || [];
      setGroups(allGroups);
      
      // Find the current group
      const group = allGroups.find((g: Group) => g.name === groupName);
      setCurrentGroup(group || null);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeployOptionChange = (option: keyof DeployOptions) => {
    setDeployOptions((prev: DeployOptions) => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const handleDeploy = async () => {
    try {
      // Deploy group configuration
      console.log('Deploying group:', groupName, 'with options:', deployOptions);
      // Add actual deploy API call here
    } catch (error) {
      console.error('Error deploying:', error);
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full">
        <div className="flex items-center justify-between mb-6 p-6">
          <h1 className="text-2xl font-bold">Group: {groupName}</h1>
        </div>
        <div className="p-6">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between mb-6 p-6">
        <h1 className="text-2xl font-bold">Group: {currentGroup?.name || groupName}</h1>
        <div className="flex items-center space-x-3">
          <Button onClick={() => setTickerDialogOpen(true)} variant="outline">
            <MessageSquare className="w-4 h-4 mr-2" />
            Group Ticker
          </Button>
          <Button onClick={() => setEmergencyMessageOpen(true)} variant="outline">
            <MessageSquare className="w-4 h-4 mr-2" />
            Emergency Message
          </Button>
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            View Schedule
          </Button>
          <Button onClick={() => setSettingsDialogOpen(true)} variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button onClick={handleDeploy} variant="default">
            <Play className="w-4 h-4 mr-2" />
            DEPLOY
          </Button>
        </div>
      </div>

      {/* Deploy Configuration Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Schedule Playlists for Default</h2>
        
        <div className="flex items-center space-x-4 mb-6">
          <label className="text-sm font-medium text-gray-700">Default Playlist:</label>
          <Select value={defaultPlaylist} onValueChange={setDefaultPlaylist}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">default</SelectItem>
              <SelectItem value="playlist1">playlist1</SelectItem>
              <SelectItem value="playlist2">playlist2</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-600">Default playlist is played when no scheduled playlists are available</span>
        </div>

        <div className="space-y-3 mb-6">
          <h3 className="text-sm font-medium text-gray-700">Deploy Options:</h3>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={deployOptions.playDefaultAlongside}
                onChange={() => handleDeployOptionChange('playDefaultAlongside')}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Play default playlist along with scheduled playlist(s)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={deployOptions.combineContent}
                onChange={() => handleDeployOptionChange('combineContent')}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Combine content of all scheduled playlists</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={deployOptions.shuffleContent}
                onChange={() => handleDeployOptionChange('shuffleContent')}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Shuffle content every cycle</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={deployOptions.switchAtEnd}
                onChange={() => handleDeployOptionChange('switchAtEnd')}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Switch to new at the end of current playlist</span>
            </label>
          </div>
        </div>
      </div>



      {/* Dialogs */}
      <TickerDialog
        open={tickerDialogOpen}
        onOpenChange={setTickerDialogOpen}
      />
      <EmergencyMessageDialog
        open={emergencyMessageOpen}
        onOpenChange={setEmergencyMessageOpen}
      />
      <SettingsDialog
        open={settingsDialogOpen}
        onOpenChange={setSettingsDialogOpen}
      />
    </div>
  );
} 