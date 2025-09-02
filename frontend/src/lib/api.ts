import axios from 'axios';

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

// Player API functions
export const playerAPI = {
  // Get all players with filtering and pagination
  getPlayers: async (params?: { 
    page?: number; 
    limit?: number; 
    status?: string; 
    group?: string; 
    search?: string 
  }) => {
    const response = await api.get('/api/players', { params });
    return response.data;
  },

  // Get single player by ID
  getPlayer: async (id: string) => {
    const response = await api.get(`/api/players/${id}`);
    return response.data;
  },

  // Get player statistics
  getPlayerStats: async () => {
    const response = await api.get('/api/players/stats');
    return response.data;
  },
};

// Asset API functions
export const assetAPI = {
  // Get all assets with pagination
  getAssets: async (params?: { page?: number; perPage?: number; filter?: string }) => {
    const response = await api.get('/api/assets', { params });
    return response.data;
  },

  // Get files from /api/files endpoint
  getFiles: async () => {
    const response = await api.get('/api/files');
    return response.data;
  },

  // Update file data (validity, rename, etc.)
  updateFile: async (filename: string, data: any) => {
    const response = await api.post(`/api/files/${filename}`, data);
    return response.data;
  },

  // Get single asset by filename
  getAsset: async (filename: string) => {
    const response = await api.get(`/api/assets/file/${filename}`);
    return response.data;
  },

  // Create new asset
  createAsset: async (assetData: any) => {
    const response = await api.post('/api/assets', assetData);
    return response.data;
  },

  // Update asset
  updateAsset: async (id: string, assetData: any) => {
    const response = await api.put(`/api/assets/${id}`, assetData);
    return response.data;
  },

  // Delete asset
  deleteAsset: async (filename: string) => {
    const response = await api.delete(`/api/assets/file/${filename}`);
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
  postUpload: async (data: { files: Array<{ name: string; size: number; type: string; }>; categories: string[]; }) => {
    const response = await api.post('/api/postupload', data);
    return response.data;
  },

  // Create link file
  createLink: async (linkData: { fileName: string; fileType: string; linkAddress: string }) => {
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

  // Get assets by playlist
  getAssetsByPlaylist: async (playlist: string) => {
    const response = await api.get(`/api/assets/playlist/${playlist}`);
    return response.data;
  },

  // Add asset to playlist
  addAssetToPlaylist: async (assetId: string, playlist: string) => {
    const response = await api.post('/api/assets/playlist/add', { assetId, playlist });
    return response.data;
  },

  // Remove asset from playlist
  removeAssetFromPlaylist: async (assetId: string, playlist: string) => {
    const response = await api.post('/api/assets/playlist/remove', { assetId, playlist });
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

  // Save playlist
  savePlaylist: async (playlistName: string, playlistData: any) => {
    const response = await api.put(`/api/playlists/${playlistName}`, playlistData);
    return response.data;
  },
};

// Playlist interface
export interface Playlist {
  name: string;
  settings: {
    ticker?: {
      enable: boolean;
      behavior: string;
      textSpeed: number;
      rss: {
        enable: boolean;
        link: string | null;
        feedDelay: number;
      };
    };
    ads?: {
      adPlaylist: boolean;
      adCount: number;
      adInterval: number;
    };
    audio?: {
      enable: boolean;
      random: boolean;
      volume: number;
    };
  };
  assets: string[];
  layout: string;
  templateName: string;
  videoWindow?: any;
  zoneVideoWindow?: any;
  schedule: any;
  version?: number;
}

// Group interface
export interface Group {
  _id: string;
  name: string;
  description?: string;
  playlists: string[];
  playlistToSchedule?: string;
  defaultCustomTemplate?: string;
  combineDefaultPlaylist: boolean;
  playAllEligiblePlaylists: boolean;
  shuffleContent: boolean;
  alternateContent: boolean;
  timeToStopVideo: number;
  assets: string[];
  assetsValidity: any[];
  ticker: any;
  deployedPlaylists: string[];
  deployedAssets: string[];
  deployedTicker: any;
  lastDeployed?: string;
  enableMpv: boolean;
  mpvAudioDelay: string;
  selectedVideoPlayer: string;
  disableWebUi: boolean;
  disableWarnings: boolean;
  enablePio: boolean;
  disableAp: boolean;
  orientation: string;
  animationEnable: boolean;
  animationType?: string;
  resizeAssets: boolean;
  videoKeepAspect: boolean;
  videoShowSubtitles: boolean;
  imageLetterboxed: boolean;
  signageBackgroundColor: string;
  urlReloadDisable: boolean;
  keepWeblinksInMemory: boolean;
  loadPlaylistOnCompletion: boolean;
  resolution: string;
  sleep: {
    enable: boolean;
    ontime?: string;
    offtime?: string;
  };
  reboot: {
    enable: boolean;
    time?: string;
    absoluteTime?: string;
  };
  kioskUi: {
    enable: boolean;
    url?: string;
    timeout?: number;
  };
  omxVolume: number;
  logo?: string;
  logox: number;
  logoy: number;
  showClock: {
    enable: boolean;
    format: string;
    position: string;
  };
  monitorArrangement: {
    mode: string;
    reverse: boolean;
  };
  emergencyMessage: {
    enable: boolean;
    msg: string;
    hPos: string;
    vPos: string;
  };
  createdAt: string;
  createdBy: {
    _id: string;
    name: string;
  };
}

// Group API functions
export const groupAPI = {
  // Get all groups
  getGroups: async () => {
    const response = await api.get('/api/groups');
    return response.data;
  },

  // Get single group
  getGroup: async (groupId: string) => {
    const response = await api.get(`/api/groups/${groupId}`);
    return response.data;
  },

  // Create new group
  createGroup: async (groupData: Partial<Group>) => {
    const response = await api.post('/api/groups', groupData);
    return response.data;
  },

  // Update group
  updateGroup: async (groupId: string, groupData: Partial<Group>) => {
    const response = await api.put(`/api/groups/${groupId}`, groupData);
    return response.data;
  },

  // Delete group
  deleteGroup: async (groupId: string) => {
    const response = await api.delete(`/api/groups/${groupId}`);
    return response.data;
  },

  // Deploy group
  deployGroup: async (groupId: string) => {
    const response = await api.post(`/api/groups/${groupId}/deploy`);
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

export default api; 