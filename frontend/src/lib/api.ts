import axios from 'axios';
import type {
  CreateLinkData,
  PostUploadData,
  GetAssetsParams,
  ApiResponse,
  FilesResponse
} from '@/app/assets/lib/types';
import type { GetPlayersParams } from '@/app/players/lib/types';
import type { Group } from '@/app/groups/lib/types';
import type { Playlist } from '@/app/playlists/lib/types';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';

// Create axios instance with credentials
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect to login page if not already on auth page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth')) {
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  // Login user
  login: async (email: string, password: string) => {
    const response = await api.post('/api/login', { email, password });
    return response.data;
  },

  // Register user
  register: async (email: string, password: string) => {
    const response = await api.post('/api/register', { email, password });
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/api/logout');
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/api/user');
    return response.data;
  },
};

// Player API functions will be defined later in the file

// Asset API functions (using /api/files endpoints only)
export const assetAPI = {
  // Get files from /api/files endpoint (includes dbdata with thumbnails)
  getFiles: async () => {
    const response = await api.get('/api/files');
    return response.data;
  },

  // Update file data (validity, rename, etc.)
  updateFile: async (filename: string, data: any) => {
    const response = await api.post(`/api/files/${filename}`, data);
    return response.data;
  },

  // Get single file details
  getFileDetails: async (filename: string) => {
    const response = await api.get(`/api/files/${filename}`);
    return response.data;
  },

  // Delete file from /api/files endpoint
  deleteFile: async (filename: string) => {
    const response = await api.delete(`/api/files/${filename}`);
    return response.data;
  },

  // Upload files to /api/files
  uploadFiles: async (formData: FormData) => {
    const response = await api.post('/api/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Post upload metadata
  postUpload: async (data: PostUploadData) => {
    const response = await api.post('/api/postupload', data);
    return response.data;
  },

  // Create link file
  createLink: async (linkData: CreateLinkData) => {
    // Map file types to their corresponding extensions
    const getTypeFromFileType = (fileType: string) => {
      switch (fileType) {
        case 'Message':
          return '.txt';
        case 'Local Folder/File':
          return '.local';
        case 'Media RSS':
          return '.rss';
        case 'Streaming':
        case 'Audio Streaming':
        case 'Livestreaming or YouTube':
          return '.stream';
        case 'Web link (shown in iframe)':
        case 'Web page (supports cross origin links)':
        default:
          return '.link';
      }
    };

    const payload = {
      categories: [],
      details: {
        name: linkData.fileName,
        type: getTypeFromFileType(linkData.fileType),
        link: linkData.linkAddress,
        zoom: 1,
        duration: null,
        hideTitle: "title"
      },
    };
    
    const response = await api.post('/api/links', payload);
    return response.data;
  },

  // Get link file details
  getLinkDetails: async (filename: string) => {
    const response = await api.get(`/api/links/${filename}`);
    return response.data;
  },


};

// Playlist API functions will be defined later in the file





// Player API functions
export const playerAPI = {
  // Get all players
  getPlayers: async (params?: GetPlayersParams) => {
    const response = await api.get('/api/players', { params });
    return response.data;
  },

  // Get single player
  getPlayer: async (playerId: string) => {
    const response = await api.get(`/api/players/${playerId}`);
    return response.data;
  },

  // Create new player
  createPlayer: async (playerData: any) => {
    const response = await api.post('/api/players', playerData);
    return response.data;
  },

  // Update player
  updatePlayer: async (playerId: string, playerData: any) => {
    const response = await api.post(`/api/players/${playerId}`, playerData);
    return response.data;
  },

  // Delete player
  deletePlayer: async (playerId: string) => {
    const response = await api.delete(`/api/players/${playerId}`);
    return response.data;
  },

  // Get player statistics
  getPlayerStats: async () => {
    const response = await api.get('/api/players/stats');
    return response.data;
  },

  // Deploy to player
  deployToPlayer: async (playerId: string, deployOptions: any) => {
    const response = await api.post(`/api/players/${playerId}/deploy`, deployOptions);
    return response.data;
  },

  // Send command to player
  sendCommand: async (playerId: string, command: string, data?: any) => {
    const response = await api.post(`/api/players/${playerId}/command`, { command, data });
    return response.data;
  },
};

// Playlist API functions
export const playlistAPI = {
  // Get all playlists
  getPlaylists: async () => {
    const response = await api.get('/api/playlists');
    return response.data;
  },

  // Get single playlist
  getPlaylist: async (playlistName: string) => {
    const response = await api.get(`/api/playlists/${playlistName}`);
    return response.data;
  },

  // Create new playlist
  createPlaylist: async (playlistName: string) => {
    const response = await api.post('/api/playlists', { file: playlistName });
    return response.data;
  },

  // Update playlist
  updatePlaylist: async (playlistName: string, playlistData: any) => {
    const response = await api.post(`/api/playlists/${playlistName}`, playlistData);
    return response.data;
  },

  // Delete playlist
  deletePlaylist: async (playlistName: string) => {
    const response = await api.delete(`/api/playlists/${playlistName}`);
    return response.data;
  },
};

// Settings API functions
export const settingsAPI = {
  // Get all settings
  getSettings: async () => {
    const response = await api.get('/api/settings/');
    return response.data;
  },

  // Update a single setting
  updateSetting: async (key: string, value: any) => {
    const response = await api.post('/api/settings/', { [key]: value });
    return response.data;
  },

  // Update multiple settings
  updateSettings: async (settings: Record<string, any>) => {
    const response = await api.post('/api/settings/', settings);
    return response.data;
  },
};

// Group API functions
export const groupAPI = {
  // Get all groups
  getGroups: async () => {
    const response = await api.get('/api/groups');
    return response.data;
  },

  // Get single group by ID
  getGroup: async (groupId: string) => {
    const response = await api.get(`/api/groups/${groupId}`);
    return response.data;
  },

  // Create new group
  createGroup: async (groupData: { name: string; description?: string }) => {
    const response = await api.post('/api/groups', groupData);
    return response.data;
  },

  // Update group
  updateGroup: async (groupId: string, groupData: any) => {
    const response = await api.post(`/api/groups/${groupId}`, groupData);
    return response.data;
  },

  // Delete group
  deleteGroup: async (groupId: string) => {
    const response = await api.delete(`/api/groups/${groupId}`);
    return response.data;
  },
};

export default api; 