'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { settingsAPI } from '@/lib/api';

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [settings, setSettings] = useState<{
    username: string;
    sshPassword: string | null;
    defaultDuration: number;
    useYoutubeDl: boolean;
    keepTvOn: boolean;
    disableCecPowerCheck: boolean;
    hideSystemMessages: boolean;
    skipStartupScreen: boolean;
    reportingInterval: number;
    enableLogPlayCount: boolean;
    authCredentials: {
      user: string;
      password: string;
    };
    installation: string;
    newLayoutsEnable: boolean;
    systemMessagesHide: boolean;
    forceTvOn: boolean;
    disableCECPowerCheck: boolean;
    language: string;
    enableLog: boolean;
    hideWelcomeNotice: boolean;
    reportIntervalMinutes: number;
    enableYoutubeDl: boolean;
    serverIp: string;
    date: string;
    version: string;
  }>({
    username: '',
    sshPassword: null,
    defaultDuration: 10,
    useYoutubeDl: false,
    keepTvOn: false,
    disableCecPowerCheck: false,
    hideSystemMessages: false,
    skipStartupScreen: false,
    reportingInterval: 5,
    enableLogPlayCount: false,
    authCredentials: {
      user: 'pi',
      password: 'pi'
    },
    installation: '',
    newLayoutsEnable: false,
    systemMessagesHide: false,
    forceTvOn: false,
    disableCECPowerCheck: false,
    language: 'en',
    enableLog: false,
    hideWelcomeNotice: false,
    reportIntervalMinutes: 5,
    enableYoutubeDl: false,
    serverIp: '',
    date: '',
    version: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch settings from API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await settingsAPI.getSettings();
        // Extract data from the nested response structure
        const data = response.data || response;
        setSettings(prev => ({ ...prev, ...data }));
      } catch (err) {
        console.error('Error fetching settings:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch settings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Temporarily bypass authentication
  // useEffect(() => {
  //   if (!loading && !user) {
  //     router.push('/auth');
  //   }
  // }, [user, loading, router]);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleAuthCredentialsChange = (field: 'user' | 'password', value: string) => {
    setSettings(prev => ({
      ...prev,
      authCredentials: {
        ...prev.authCredentials,
        [field]: value
      }
    }));
  };

  const handleCheckboxChange = async (key: string, checked: boolean) => {
    try {
      // Update local state immediately
      setSettings(prev => ({ ...prev, [key]: checked }));
      
      // Save to server
      await settingsAPI.updateSetting(key, checked);
      console.log(`Successfully saved ${key}:`, checked);
    } catch (err) {
      console.error(`Error saving ${key}:`, err);
      // Revert local state on error
      setSettings(prev => ({ ...prev, [key]: !checked }));
      // You could add a toast notification here for better UX
    }
  };

  const handleSaveSetting = async (key: string) => {
    try {
      await settingsAPI.updateSetting(key, settings[key as keyof typeof settings]);
      console.log(`Successfully saved ${key}:`, settings[key as keyof typeof settings]);
    } catch (err) {
      console.error(`Error saving ${key}:`, err);
      // You could add a toast notification here for better UX
    }
  };

  const handleSaveAuthCredentials = async () => {
    try {
      await settingsAPI.updateSetting('authCredentials', settings.authCredentials);
      console.log('Successfully saved auth credentials');
    } catch (err) {
      console.error('Error saving auth credentials:', err);
    }
  };

  // Temporarily bypass authentication checks
  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center py-12">
  //       <div className="text-center">
  //       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
  //       <p className="text-gray-600">Loading...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // if (!user) {
  //   return null;
  // }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Settings</h2>
          <p className="text-red-700">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Available Licenses Section */}
          <Card>
            <CardHeader >
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Available Licenses in the server</CardTitle>
                  <CardDescription>
                    Please register the player ID at pisignage.com to generate the license files. Then either save the license file from the email or download at pisignage.com/subscriptions.
                  </CardDescription>
                </div>
                <Button variant="default" size="sm">
                  Upload
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
            </CardContent>
          </Card>

          {/* Download Access Section */}
          <Card>
            <CardHeader>
              <CardTitle>Download Access</CardTitle>
              <CardDescription>
                Set username and password for download access to media files and content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Download Username */}
              <div className="flex items-center justify-between">
                <label className="text-gray-700 font-medium">Username:</label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    value={String(settings.authCredentials?.user || '')}
                    onChange={(e) => handleAuthCredentialsChange('user', e.target.value)}
                    placeholder="Enter username"
                    className="w-48"
                  />
                </div>
              </div>

              {/* Download Password */}
              <div className="flex items-center justify-between">
                <label className="text-gray-700 font-medium">Password:</label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="password"
                    value={String(settings.authCredentials?.password || '')}
                    onChange={(e) => handleAuthCredentialsChange('password', e.target.value)}
                    placeholder="Enter password"
                    className="w-48"
                  />
                </div>
              </div>

              {/* Save Button for Download Access */}
              <div className="flex justify-end">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleSaveAuthCredentials()}
                >
                  Save Download Access
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Installation Settings Section */}
          <Card>
            <CardHeader>
              <CardTitle>Installation Settings</CardTitle>
              <CardDescription>
                Configure system-wide settings for your PiSignage installation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Username */}
              <div className="flex items-center justify-between">
                <label className="text-gray-700 font-medium">username at pisignage.com:</label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    value={String(settings.installation || '')}
                    onChange={(e) => handleSettingChange('installation', e.target.value)}
                    className="w-48"
                  />
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleSaveSetting('installation')}
                  >
                    SAVE
                  </Button>
                </div>
              </div>

              {/* SSH Password */}
              <div className="flex items-center justify-between">
                <label className="text-gray-700 font-medium">SSH Password:</label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="password"
                    value={String(settings.sshPassword || '')}
                    onChange={(e) => handleSettingChange('sshPassword', e.target.value)}
                    className="w-48"
                  />
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleSaveSetting('sshPassword')}
                  >
                    Save
                  </Button>
                </div>
              </div>

              {/* Default Duration */}
              <div className="flex items-center justify-between">
                <label className="text-gray-700 font-medium">Default Duration for Slides:</label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={String(settings.defaultDuration || '')}
                    onChange={(e) => handleSettingChange('defaultDuration', e.target.value)}
                    className="w-20"
                  />
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleSaveSetting('defaultDuration')}
                  >
                    Save
                  </Button>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="useYoutubeDl"
                    checked={Boolean(settings.enableYoutubeDl)}
                    onCheckedChange={(checked) => handleCheckboxChange('enableYoutubeDl', checked === true)}
                  />
                  <label htmlFor="useYoutubeDl" className="text-gray-700">
                    Use youtube-dl program for livestreaming instead of livestreamer
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="keepTvOn"
                    checked={Boolean(settings.forceTvOn)}
                    onCheckedChange={(checked) => handleCheckboxChange('forceTvOn', checked === true)}
                  />
                  <label htmlFor="keepTvOn" className="text-gray-700">
                    Keep TV on by sending CEC tv-on/off message every 3 minutes
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="disableCecPowerCheck"
                    checked={Boolean(settings.disableCECPowerCheck)}
                    onCheckedChange={(checked) => handleCheckboxChange('disableCECPowerCheck', checked === true)}
                  />
                  <label htmlFor="disableCecPowerCheck" className="text-gray-700">
                    Disable CEC power check of TV every 3 minutes
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hideSystemMessages"
                    checked={Boolean(settings.systemMessagesHide)}
                    onCheckedChange={(checked) => handleCheckboxChange('systemMessagesHide', checked === true)}
                  />
                  <label htmlFor="hideSystemMessages" className="text-gray-700">
                    Hide system messages on TV Screen (e.g. Download in Progress)
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="skipStartupScreen"
                    checked={Boolean(settings.hideWelcomeNotice)}
                    onCheckedChange={(checked) => handleCheckboxChange('hideWelcomeNotice', checked === true)}
                  />
                  <label htmlFor="skipStartupScreen" className="text-gray-700">
                    Do not show startup welcome screen & skip network diagnostics
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="enableLogPlayCount"
                    checked={Boolean(settings.enableLog)}
                    onCheckedChange={(checked) => handleCheckboxChange('enableLog', checked === true)}
                  />
                  <label htmlFor="enableLogPlayCount" className="text-gray-700">
                    Enable log for file play count/details (network intensive, do not enable unless you need it!)
                  </label>
                </div>
              </div>

              {/* Reporting Interval */}
              <div className="flex items-center justify-between">
                <label className="text-gray-700 font-medium">Player reporting interval in minutes:</label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={String(settings.reportingInterval || '')}
                    onChange={(e) => handleSettingChange('reportingInterval', e.target.value)}
                    className="w-20"
                  />
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleSaveSetting('reportingInterval')}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
    </div>
  );
} 