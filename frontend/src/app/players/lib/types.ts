// Player related types

export interface Player {
  _id: string;
  name: string;
  group?: string;
  location?: string;
  status: 'online' | 'offline' | 'playing' | 'not-playing';
  currentPlaylist?: string;
  lastSeen?: string;
  version?: string;
  platform?: string;
  resolution?: string;
  orientation?: string;
  cpuUsage?: number;
  memoryUsage?: number;
  diskUsage?: number;
  temperature?: number;
  uptime?: number;
  shell?: boolean;
  licensed?: boolean;
  createdAt?: string;
  updatedAt?: string;
  settings?: PlayerSettings;
}

export interface PlayerSettings {
  animationEnable?: boolean;
  animationType?: string;
  resizeAssets?: boolean;
  videoKeepAspect?: boolean;
  videoShowSubtitles?: boolean;
  imageLetterboxed?: boolean;
  signageBackgroundColor?: string;
  urlReloadDisable?: boolean;
  keepWeblinksInMemory?: boolean;
  loadPlaylistOnCompletion?: boolean;
  resolution?: string;
  orientation?: string;
  sleep?: SleepSettings;
  reboot?: RebootSettings;
  enableMpv?: boolean;
  mpvAudioDelay?: string;
  selectedVideoPlayer?: string;
  disableWebUi?: boolean;
  disableWarnings?: boolean;
  enablePio?: boolean;
  disableAp?: boolean;
  omxVolume?: number;
  logo?: string;
  logox?: number;
  logoy?: number;
  showClock?: ClockSettings;
  monitorArrangement?: MonitorSettings;
}

export interface SleepSettings {
  enable: boolean;
  ontime?: string;
  offtime?: string;
}

export interface RebootSettings {
  enable: boolean;
  time?: string;
  absoluteTime?: string;
}

export interface ClockSettings {
  enable: boolean;
  format: string;
  position: string;
}

export interface MonitorSettings {
  mode: string;
  reverse: boolean;
}

// API parameter types
export interface GetPlayersParams {
  page?: number;
  limit?: number;
  status?: string;
  group?: string;
  search?: string;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PlayerStatsResponse {
  total: number;
  online: number;
  offline: number;
  groups: Record<string, number>;
}
