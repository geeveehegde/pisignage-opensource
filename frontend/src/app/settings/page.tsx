'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [settings, setSettings] = useState<Record<string, string | boolean>>({
    username: 'geevi',
    sshPassword: '',
    defaultDuration: '10',
    useYoutubeDl: true,
    keepTvOn: false,
    disableCecPowerCheck: false,
    hideSystemMessages: false,
    skipStartupScreen: false,
    reportingInterval: '5',
    enableLogPlayCount: false
  });

  // Temporarily bypass authentication
  // useEffect(() => {
  //   if (!loading && !user) {
  //     router.push('/auth');
  //   }
  // }, [user, loading, router]);



  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSetting = (key: string) => {
    // Here you would typically save to backend
    console.log(`Saving ${key}:`, settings[key]);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Available Licenses Section */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="bg-blue-100 px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Available Licenses in the server</h2>
                <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                  Upload
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-2">
                Please register the player ID at pisignage.com to generate the license files. Then either save the license file from the email or download at pisignage.com/subscriptions.
              </p>
              <p className="text-gray-700">
                By uploading license files to your local server, they are downloaded to players automatically.
              </p>
            </div>
          </div>

          {/* Installation Settings Section */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="bg-blue-100 px-4 py-3 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Installation Settings</h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Username */}
              <div className="flex items-center justify-between">
                <label className="text-gray-700 font-medium">username at pisignage.com:</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={String(settings.username)}
                    onChange={(e) => handleSettingChange('username', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                  <button
                    onClick={() => handleSaveSetting('username')}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    SAVE
                  </button>
                </div>
              </div>

              {/* SSH Password */}
              <div className="flex items-center justify-between">
                <label className="text-gray-700 font-medium">SSH Password:</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="password"
                    value={String(settings.sshPassword)}
                    onChange={(e) => handleSettingChange('sshPassword', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                  <button
                    onClick={() => handleSaveSetting('sshPassword')}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>

              {/* Default Duration */}
              <div className="flex items-center justify-between">
                <label className="text-gray-700 font-medium">Default Duration for Slides:</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={String(settings.defaultDuration)}
                    onChange={(e) => handleSettingChange('defaultDuration', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-20 text-gray-900"
                  />
                  <button
                    onClick={() => handleSaveSetting('defaultDuration')}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={Boolean(settings.useYoutubeDl)}
                    onChange={(e) => handleSettingChange('useYoutubeDl', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-gray-700">
                    Use youtube-dl program for livestreaming instead of livestreamer
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={Boolean(settings.keepTvOn)}
                    onChange={(e) => handleSettingChange('keepTvOn', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-gray-700">
                    Keep TV on by sending CEC tv-on/off message every 3 minutes
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={Boolean(settings.disableCecPowerCheck)}
                    onChange={(e) => handleSettingChange('disableCecPowerCheck', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-gray-700">
                    Disable CEC power check of TV every 3 minutes
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={Boolean(settings.hideSystemMessages)}
                    onChange={(e) => handleSettingChange('hideSystemMessages', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-gray-700">
                    Hide system messages on TV Screen (e.g. Download in Progress)
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={Boolean(settings.skipStartupScreen)}
                    onChange={(e) => handleSettingChange('skipStartupScreen', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-gray-700">
                    Do not show startup welcome screen & skip network diagnostics
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={Boolean(settings.enableLogPlayCount)}
                    onChange={(e) => handleSettingChange('enableLogPlayCount', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-gray-700">
                    Enable log for file play count/details (network intensive, do not enable unless you need it!)
                  </label>
                </div>
              </div>

              {/* Reporting Interval */}
              <div className="flex items-center justify-between">
                <label className="text-gray-700 font-medium">Player reporting interval in minutes:</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={String(settings.reportingInterval)}
                    onChange={(e) => handleSettingChange('reportingInterval', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-20 text-gray-900"
                  />
                  <button
                    onClick={() => handleSaveSetting('reportingInterval')}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
} 