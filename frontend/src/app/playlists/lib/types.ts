// Playlist related types
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

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

// API parameter types
export interface GetPlaylistsParams {
  page?: number;
  limit?: number;
  filter?: string;
}
