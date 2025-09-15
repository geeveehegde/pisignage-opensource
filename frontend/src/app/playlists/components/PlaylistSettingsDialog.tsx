'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Playlist } from '../lib/types';

interface PlaylistSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playlist: Playlist | null;
  onSave?: (settings: PlaylistSettings) => void;
}

interface PlaylistSettings {
  // Ticker settings
  tickerEnable: boolean;
  tickerBehavior: string;
  tickerTextSpeed: number;
  useRssFeed: boolean;
  rssLink: string;
  rssFeedDelay: number;
  
  // Audio settings
  audioEnable: boolean;
  audioRandom: boolean;
  audioVolume: number;
  
  // Ad settings
  adPlaylist: boolean;
  adCount: number;
  adInterval: number;
  
  // General settings
  layout: string;
  templateName: string;
}

export default function PlaylistSettingsDialog({ open, onOpenChange, playlist, onSave }: PlaylistSettingsDialogProps) {
  const [settings, setSettings] = useState<PlaylistSettings>({
    // Ticker settings
    tickerEnable: false,
    tickerBehavior: 'slide',
    tickerTextSpeed: 5,
    useRssFeed: false,
    rssLink: '',
    rssFeedDelay: 60,
    
    // Audio settings
    audioEnable: false,
    audioRandom: false,
    audioVolume: 50,
    
    // Ad settings
    adPlaylist: false,
    adCount: 1,
    adInterval: 5,
    
    // General settings
    layout: '1',
    templateName: '10'
  });

  // Load playlist settings when dialog opens
  useEffect(() => {
    if (playlist && open) {
      setSettings({
        // Ticker settings
        tickerEnable: playlist.settings?.ticker?.enable || false,
        tickerBehavior: playlist.settings?.ticker?.behavior || 'slide',
        tickerTextSpeed: playlist.settings?.ticker?.textSpeed || 5,
        useRssFeed: playlist.settings?.ticker?.rss?.enable || false,
        rssLink: playlist.settings?.ticker?.rss?.link || '',
        rssFeedDelay: playlist.settings?.ticker?.rss?.feedDelay || 60,
        
        // Audio settings
        audioEnable: playlist.settings?.audio?.enable || false,
        audioRandom: playlist.settings?.audio?.random || false,
        audioVolume: playlist.settings?.audio?.volume || 50,
        
        // Ad settings
        adPlaylist: playlist.settings?.ads?.adPlaylist || false,
        adCount: playlist.settings?.ads?.adCount || 1,
        adInterval: playlist.settings?.ads?.adInterval || 5,
        
        // General settings
        layout: playlist.layout || '1',
        templateName: playlist.templateName || '10'
      });
    }
  }, [playlist, open]);

  const handleSave = () => {
    if (onSave) {
      onSave(settings);
    }
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Playlist Settings - {playlist?.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* General Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">General Settings</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Layout</label>
                <Select value={settings.layout} onValueChange={(value) => setSettings(prev => ({ ...prev, layout: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Layout 1</SelectItem>
                    <SelectItem value="2">Layout 2</SelectItem>
                    <SelectItem value="3">Layout 3</SelectItem>
                    <SelectItem value="4">Layout 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Template Duration (seconds)</label>
                <Input
                  value={settings.templateName}
                  onChange={(e) => setSettings(prev => ({ ...prev, templateName: e.target.value }))}
                  placeholder="10"
                />
              </div>
            </div>
          </div>

          {/* Ticker Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Ticker Settings</h3>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={settings.tickerEnable}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, tickerEnable: checked as boolean }))}
              />
              <label className="text-sm font-medium text-gray-700">Enable Ticker</label>
            </div>

            {settings.tickerEnable && (
              <div className="space-y-4 pl-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Ticker Behavior</label>
                    <Select value={settings.tickerBehavior} onValueChange={(value) => setSettings(prev => ({ ...prev, tickerBehavior: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="slide">Slide</SelectItem>
                        <SelectItem value="scroll">Scroll</SelectItem>
                        <SelectItem value="fade">Fade</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Text Speed</label>
                    <Input
                      type="number"
                      value={settings.tickerTextSpeed}
                      onChange={(e) => setSettings(prev => ({ ...prev, tickerTextSpeed: parseInt(e.target.value) || 5 }))}
                      min="1"
                      max="10"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={settings.useRssFeed}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, useRssFeed: checked as boolean }))}
                  />
                  <label className="text-sm font-medium text-gray-700">Use RSS Feed</label>
                </div>

                {settings.useRssFeed && (
                  <div className="space-y-4 pl-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">RSS Feed URL</label>
                      <Input
                        value={settings.rssLink}
                        onChange={(e) => setSettings(prev => ({ ...prev, rssLink: e.target.value }))}
                        placeholder="https://example.com/rss"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Feed Refresh Delay (minutes)</label>
                      <Input
                        type="number"
                        value={settings.rssFeedDelay}
                        onChange={(e) => setSettings(prev => ({ ...prev, rssFeedDelay: parseInt(e.target.value) || 60 }))}
                        min="1"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Audio Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Audio Settings</h3>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={settings.audioEnable}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, audioEnable: checked as boolean }))}
              />
              <label className="text-sm font-medium text-gray-700">Enable Audio</label>
            </div>

            {settings.audioEnable && (
              <div className="space-y-4 pl-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={settings.audioRandom}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, audioRandom: checked as boolean }))}
                  />
                  <label className="text-sm font-medium text-gray-700">Random Audio Playback</label>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Volume (%)</label>
                  <Input
                    type="number"
                    value={settings.audioVolume}
                    onChange={(e) => setSettings(prev => ({ ...prev, audioVolume: parseInt(e.target.value) || 50 }))}
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Ad Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Advertisement Settings</h3>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={settings.adPlaylist}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, adPlaylist: checked as boolean }))}
              />
              <label className="text-sm font-medium text-gray-700">Enable Ad Playlist</label>
            </div>

            {settings.adPlaylist && (
              <div className="space-y-4 pl-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Ad Count</label>
                    <Input
                      type="number"
                      value={settings.adCount}
                      onChange={(e) => setSettings(prev => ({ ...prev, adCount: parseInt(e.target.value) || 1 }))}
                      min="1"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Ad Interval (minutes)</label>
                    <Input
                      type="number"
                      value={settings.adInterval}
                      onChange={(e) => setSettings(prev => ({ ...prev, adInterval: parseInt(e.target.value) || 5 }))}
                      min="1"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}