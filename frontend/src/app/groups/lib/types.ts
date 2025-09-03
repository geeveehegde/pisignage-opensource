// Group configuration types

export interface Group {
  _id: string;
  name: string;
  description?: string;
  playlists: string[];
  combineDefaultPlaylist: boolean;
  playAllEligiblePlaylists: boolean;
  shuffleContent: boolean;
  alternateContent: boolean;
  timeToStopVideo: number;
  assets: string[];
  assetsValidity: any[];
  deployedPlaylists: string[];
  deployedAssets: string[];
  enableMpv: boolean;
  mpvAudioDelay: string;
  selectedVideoPlayer: string;
  disableWebUi: boolean;
  disableWarnings: boolean;
  enablePio: boolean;
  disableAp: boolean;
  orientation: string;
  animationEnable: boolean;
  animationType: string | null;
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
  };
  reboot: {
    enable: boolean;
  };
  kioskUi: {
    enable: boolean;
  };
  omxVolume: number;
  logo: string | null;
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
    msg: string;
    hPos: string;
    vPos: string;
  };
  createdAt: string;
  __v: number;
}



export interface EmergencyMessage {
  enable: boolean;
  msg: string;
  hPos: string;
  vPos: string;
}

export interface TickerSettings {
  enable: boolean;
  behavior: string;
  textSpeed: number;
  rss: {
    enable: boolean;
    link: string | null;
    feedDelay: number;
  };
}

export interface DeployOptions {
  playDefaultAlongside: boolean;
  combineContent: boolean;
  shuffleContent: boolean;
  switchAtEnd: boolean;
}

// Component prop types
export interface TickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (tickerData: TickerSettings) => void;
  initialData?: TickerSettings;
}

export interface EmergencyMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (messageData: EmergencyMessage) => void;
  initialData?: EmergencyMessage;
}

export interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (settings: any) => void;
  initialData?: any;
}
