'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { API_BASE_URL } from '@/lib/api';

interface ServerConfig {
  version: string;
  date: string;
}

export default function Topbar() {
  const [serverConfig, setServerConfig] = useState<ServerConfig>({
    version: '',
    date: ''
  });
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchServerConfig = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/serverconfig/`,{
          credentials: 'include'
        });
        if (response.ok) {
          const config = await response.json();
          setServerConfig(config.data);
        }
      } catch (error) {
        console.error('Error fetching server config:', error);
        // Keep the initial default values
      }
    };

    fetchServerConfig();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="w-full bg-sidebar border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left side - Follow us message and version info stacked */}
        <div className="flex flex-col space-y-1">
          {/* Follow us message */}
          <div className="flex items-center space-x-1 text-xs text-blue-600">
            <span>follow us on</span>
            <a 
              href="https://twitter.com/pisignage" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center hover:text-blue-800 transition-colors"
            >
              <svg 
                className="w-3 h-3 mx-1" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <span>for latest updates and tips</span>
          </div>
          
          {/* Version info */}
          <div className="text-xs text-gray-500">
            version hash: <span className="font-mono text-gray-700">{serverConfig.version}</span>, {serverConfig.date}
          </div>
        </div>

        {/* Right side - User info and logout */}
        <div className="flex items-center space-x-3">
          {user && (
            <div className="text-xs text-gray-600">
              {user.email}
            </div>
          )}
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-2 py-1 border border-transparent text-xs leading-3 font-medium rounded-md text-red-600 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-3 w-3 mr-1" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
