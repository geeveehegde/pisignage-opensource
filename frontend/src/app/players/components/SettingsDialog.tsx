'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CogIcon } from '@heroicons/react/24/outline';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
}

interface Settings {
  // Display settings
  resolution: string;
  orientation: string;
  mirrorScreens: boolean;
  enable4k: boolean;
  tileHorizontal: boolean;
  tileVertical: boolean;
  reverseOrder: boolean;
  animation: string;
  slideDirection: string;
  backgroundColor: string;
  volume: string;
  showLogo: boolean;
  logoX: string;
  logoY: string;
  displayClock: boolean;
  fitImage: string;
  fitVideo: string;
  reloadUrls: boolean;
  keepWebpages: boolean;
  breakVideo: string;
  scheduleDisplayOff: boolean;
  dailyReboot: boolean;
  kioskMenu: boolean;
  videoPlayer: string;
  
  // Player settings
  disableWifiAP: boolean;
  disableWebUI: boolean;
  disablePowerWarning: boolean;
  enableGPIO: boolean;
}

export default function SettingsDialog({ open, onOpenChange, trigger }: SettingsDialogProps) {
  const [settings, setSettings] = useState<Settings>({
    // Display settings
    resolution: 'auto',
    orientation: 'landscape',
    mirrorScreens: true,
    enable4k: false,
    tileHorizontal: false,
    tileVertical: false,
    reverseOrder: false,
    animation: 'disable',
    slideDirection: 'right',
    backgroundColor: '#000',
    volume: '100',
    showLogo: false,
    logoX: '10',
    logoY: '10',
    displayClock: false,
    fitImage: 'stretched',
    fitVideo: 'stretched',
    reloadUrls: false,
    keepWebpages: false,
    breakVideo: '0',
    scheduleDisplayOff: false,
    dailyReboot: false,
    kioskMenu: false,
    videoPlayer: 'default',
    
    // Player settings
    disableWifiAP: false,
    disableWebUI: false,
    disablePowerWarning: false,
    enableGPIO: false
  });

  const updateSetting = (key: keyof Settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleDualScreenChange = (value: string) => {
    setSettings(prev => ({
      ...prev,
      mirrorScreens: value === 'mirror',
      enable4k: value === '4k',
      tileHorizontal: value === 'horizontal',
      tileVertical: value === 'vertical'
    }));
  };

  const handleSave = () => {
    console.log('Saving settings:', {
      display: {
        resolution: settings.resolution,
        orientation: settings.orientation,
        mirrorScreens: settings.mirrorScreens,
        enable4k: settings.enable4k,
        tileHorizontal: settings.tileHorizontal,
        tileVertical: settings.tileVertical,
        reverseOrder: settings.reverseOrder,
        animation: settings.animation,
        slideDirection: settings.slideDirection,
        backgroundColor: settings.backgroundColor,
        volume: settings.volume,
        showLogo: settings.showLogo,
        logoX: settings.logoX,
        logoY: settings.logoY,
        displayClock: settings.displayClock,
        fitImage: settings.fitImage,
        fitVideo: settings.fitVideo,
        reloadUrls: settings.reloadUrls,
        keepWebpages: settings.keepWebpages,
        breakVideo: settings.breakVideo,
        scheduleDisplayOff: settings.scheduleDisplayOff,
        dailyReboot: settings.dailyReboot,
        kioskMenu: settings.kioskMenu,
        videoPlayer: settings.videoPlayer
      },
      player: {
        disableWifiAP: settings.disableWifiAP,
        disableWebUI: settings.disableWebUI,
        disablePowerWarning: settings.disablePowerWarning,
        enableGPIO: settings.enableGPIO
      }
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="default" size="sm" className="flex items-center space-x-2">
            <CogIcon className="h-4 w-4" />
            <span>Settings</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Display Orientation and Resolution</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* Resolution & Orientation */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Resolution:</label>
              <RadioGroup value={settings.resolution} onValueChange={(value) => updateSetting('resolution', value)} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="auto" id="auto" />
                  <label htmlFor="auto" className="text-sm text-gray-700">Auto based on TV settings(EDID)</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1080p" id="1080p" />
                  <label htmlFor="1080p" className="text-sm text-gray-700">Full HD(1080p) Video & Browser 1920x1080</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="720p" id="720p" />
                  <label htmlFor="720p" className="text-sm text-gray-700">HD(720p) Video & Browser 1280x720</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pal" id="pal" />
                  <label htmlFor="pal" className="text-sm text-gray-700">PAL (RCA), 720x576 Video and Browser</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ntsc" id="ntsc" />
                  <label htmlFor="ntsc" className="text-sm text-gray-700">NTSC (RCA), 720x480 Video and Browser</label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Orientation:</label>
              <RadioGroup value={settings.orientation} onValueChange={(value) => updateSetting('orientation', value)} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="landscape" id="landscape" />
                  <label htmlFor="landscape" className="text-sm text-gray-700">Landscape Mode</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="portrait-right" id="portrait-right" />
                  <label htmlFor="portrait-right" className="text-sm text-gray-700">Portrait Right (Hardware)</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="portrait-left" id="portrait-left" />
                  <label htmlFor="portrait-left" className="text-sm text-gray-700">Portrait Left (Hardware)</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="vertical-flip" id="vertical-flip" />
                  <label htmlFor="vertical-flip" className="text-sm text-gray-700">Vertical Flip</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="horizontal-flip" id="horizontal-flip" />
                  <label htmlFor="horizontal-flip" className="text-sm text-gray-700">Horizontal Flip</label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Dual Screen */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Dual Screen (Pi4,v4.x only):</label>
            <div className="grid grid-cols-2 gap-6">
              <RadioGroup 
                value={settings.mirrorScreens ? 'mirror' : settings.enable4k ? '4k' : settings.tileHorizontal ? 'horizontal' : settings.tileVertical ? 'vertical' : 'mirror'} 
                onValueChange={handleDualScreenChange} 
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mirror" id="mirror" />
                  <label htmlFor="mirror" className="text-sm text-gray-700">Mirror Screens</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="4k" id="4k" />
                  <label htmlFor="4k" className="text-sm text-gray-700">Enable 4K</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="horizontal" id="horizontal" />
                  <label htmlFor="horizontal" className="text-sm text-gray-700">Tile Horizontal</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="vertical" id="vertical" />
                  <label htmlFor="vertical" className="text-sm text-gray-700">Tile Vertical</label>
                </div>
              </RadioGroup>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="reverseOrder"
                  checked={settings.reverseOrder}
                  onCheckedChange={(checked) => updateSetting('reverseOrder', checked === true)}
                />
                <label htmlFor="reverseOrder" className="text-sm text-gray-700">Reverse order</label>
              </div>
            </div>
          </div>

          {/* Animation */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Animation:</label>
              <RadioGroup value={settings.animation} onValueChange={(value) => updateSetting('animation', value)} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="disable" id="disable" />
                  <label htmlFor="disable" className="text-sm text-gray-700">Disable</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="blend" id="blend" />
                  <label htmlFor="blend" className="text-sm text-gray-700">Blend</label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Slide Direction:</label>
              <RadioGroup value={settings.slideDirection} onValueChange={(value) => updateSetting('slideDirection', value)} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="right" id="slide-right" />
                  <label htmlFor="slide-right" className="text-sm text-gray-700">Slide right</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="up" id="slide-up" />
                  <label htmlFor="slide-up" className="text-sm text-gray-700">Slide up</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="left" id="slide-left" />
                  <label htmlFor="slide-left" className="text-sm text-gray-700">Slide left</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="down" id="slide-down" />
                  <label htmlFor="slide-down" className="text-sm text-gray-700">Slide down</label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Background & Volume */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Background:</label>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-8 h-8 border border-gray-300 rounded"
                  style={{ backgroundColor: settings.backgroundColor }}
                />
                <Input
                  value={settings.backgroundColor}
                  onChange={(e) => updateSetting('backgroundColor', e.target.value)}
                  className="w-24"
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Volume(%):</label>
              <Input
                type="number"
                value={settings.volume}
                onChange={(e) => updateSetting('volume', e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Show Logo */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Show Logo:</label>
            <div className="flex items-center space-x-4">
              <button className="text-blue-600 hover:text-blue-800 underline text-sm">
                Select a png image from Assets
              </button>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={settings.logoX}
                  onChange={(e) => updateSetting('logoX', e.target.value)}
                  className="w-16"
                  placeholder="X"
                />
                <Input
                  type="number"
                  value={settings.logoY}
                  onChange={(e) => updateSetting('logoY', e.target.value)}
                  className="w-16"
                  placeholder="Y"
                />
              </div>
            </div>
          </div>

          {/* Display Clock */}
          <div className="flex items-center space-x-3">
            <Checkbox
              id="displayClock"
              checked={settings.displayClock}
              onCheckedChange={(checked) => updateSetting('displayClock', checked === true)}
            />
            <label htmlFor="displayClock" className="text-sm font-medium text-gray-700">Display Clock</label>
          </div>

          {/* Fit Image & Video */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Fit image:</label>
              <RadioGroup value={settings.fitImage} onValueChange={(value) => updateSetting('fitImage', value)} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="actual" id="actual" />
                  <label htmlFor="actual" className="text-sm text-gray-700">Actual</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="letterbox" id="letterbox" />
                  <label htmlFor="letterbox" className="text-sm text-gray-700">Letterbox</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="stretched" id="stretched" />
                  <label htmlFor="stretched" className="text-sm text-gray-700">Stretched</label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Fit video:</label>
              <RadioGroup value={settings.fitVideo} onValueChange={(value) => updateSetting('fitVideo', value)} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="letterbox" id="video-letterbox" />
                  <label htmlFor="video-letterbox" className="text-sm text-gray-700">Letterbox</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="stretched" id="video-stretched" />
                  <label htmlFor="video-stretched" className="text-sm text-gray-700">Stretched</label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* URL Reload */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">URL Reload:</label>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="reloadUrls"
                  checked={settings.reloadUrls}
                  onCheckedChange={(checked) => updateSetting('reloadUrls', checked === true)}
                />
                <label htmlFor="reloadUrls" className="text-sm text-gray-700">Reload link URLs each time</label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="keepWebpages"
                  checked={settings.keepWebpages}
                  onCheckedChange={(checked) => updateSetting('keepWebpages', checked === true)}
                />
                <label htmlFor="keepWebpages" className="text-sm text-gray-700">Keep webpages in memory</label>
              </div>
            </div>
          </div>

          {/* Break Video */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Break Video:</label>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Stop video after every</span>
              <Input
                type="number"
                value={settings.breakVideo}
                onChange={(e) => updateSetting('breakVideo', e.target.value)}
                className="w-20"
              />
              <span className="text-sm text-gray-700">seconds (0 to disable) to show adverts</span>
            </div>
          </div>

          {/* Schedule Display OFF */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="scheduleDisplayOff"
                checked={settings.scheduleDisplayOff}
                onCheckedChange={(checked) => updateSetting('scheduleDisplayOff', checked === true)}
              />
              <label htmlFor="scheduleDisplayOff" className="text-sm font-medium text-gray-700">Schedule Display OFF</label>
            </div>
            <p className="text-blue-600 hover:text-blue-800 underline text-sm ml-6">
              For finer control use TV_OFF playlist under group scheduling
            </p>
          </div>

          {/* Optional daily reboot */}
          <div className="flex items-center space-x-3">
            <Checkbox
              id="dailyReboot"
              checked={settings.dailyReboot}
              onCheckedChange={(checked) => updateSetting('dailyReboot', checked === true)}
            />
            <label htmlFor="dailyReboot" className="text-sm font-medium text-gray-700">Optional daily reboot</label>
          </div>

          {/* Kiosk Menu */}
          <div className="flex items-center space-x-3">
            <Checkbox
              id="kioskMenu"
              checked={settings.kioskMenu}
              onCheckedChange={(checked) => updateSetting('kioskMenu', checked === true)}
            />
            <label htmlFor="kioskMenu" className="text-sm font-medium text-gray-700">Kiosk Menu</label>
          </div>

          {/* Video Play */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Video Play:</label>
            <RadioGroup value={settings.videoPlayer} onValueChange={(value) => updateSetting('videoPlayer', value)} className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="default" id="default-player" />
                <label htmlFor="default-player" className="text-sm text-gray-700">
                  Default (omxplayer in versions less than 4, chromium in versions &gt;= 4.x.x)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mpv" id="mpv-player" />
                <label htmlFor="mpv-player" className="text-sm text-gray-700">
                  MPV (for avoiding gap between videos, certain YouTube streaming)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="vlc" id="vlc-player" />
                <label htmlFor="vlc-player" className="text-sm text-gray-700">
                  VLC(Experimental) (for 4K support in versions &gt;= 4.x.x for Raspberry Pi)
                </label>
              </div>
            </RadioGroup>
          </div>

          {/* Player Settings */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Player settings:</label>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="disableWifiAP"
                    checked={settings.disableWifiAP}
                    onCheckedChange={(checked) => updateSetting('disableWifiAP', checked === true)}
                  />
                  <label htmlFor="disableWifiAP" className="text-sm text-gray-700">Disable player wifi AP</label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="disableWebUI"
                    checked={settings.disableWebUI}
                    onCheckedChange={(checked) => updateSetting('disableWebUI', checked === true)}
                  />
                  <label htmlFor="disableWebUI" className="text-sm text-gray-700">Disable player webUI</label>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="disablePowerWarning"
                    checked={settings.disablePowerWarning}
                    onCheckedChange={(checked) => updateSetting('disablePowerWarning', checked === true)}
                  />
                  <label htmlFor="disablePowerWarning" className="text-sm text-red-600">
                    Disable player power/temperature warning
                  </label>
                </div>
                <p className="text-xs italic text-gray-600 ml-6">use caution as this may spoil the hardware</p>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="enableGPIO"
                    checked={settings.enableGPIO}
                    onCheckedChange={(checked) => updateSetting('enableGPIO', checked === true)}
                  />
                  <label htmlFor="enableGPIO" className="text-sm text-gray-700">Enable GPIO media control (17,18,27)</label>
                </div>
                <p className="text-blue-600 hover:text-blue-800 underline text-sm ml-6">for details refer GPIO instructions</p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleSave}
          >
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
