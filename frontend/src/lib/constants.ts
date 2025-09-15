// Global constants for the application

// Media type detection patterns
export const MEDIA_TYPES = {
  // Image file extensions and patterns
  IMAGE_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.tiff', '.ico'],
  IMAGE_REGEX: /\.(jpe?g|png|gif|bmp|webp|svg|tiff?|ico)$/i,
  IMAGE_MIME_PATTERN: /^image\//i,

  // Video file extensions and patterns
  VIDEO_EXTENSIONS: ['.mp4', '.webm', '.ogg', '.avi', '.mov', '.wmv', '.flv', '.mkv', '.m4v', '.3gp', '.ogv'],
  VIDEO_REGEX: /\.(mp4|webm|ogg|avi|mov|wmv|flv|mkv|m4v|3gp|ogv)$/i,
  VIDEO_MIME_PATTERN: /^video\//i,

  // Audio file extensions and patterns
  AUDIO_EXTENSIONS: ['.mp3', '.wav', '.ogg', '.aac', '.flac', '.m4a', '.wma'],
  AUDIO_REGEX: /\.(mp3|wav|ogg|aac|flac|m4a|wma)$/i,
  AUDIO_MIME_PATTERN: /^audio\//i,

  // Document file extensions
  DOCUMENT_EXTENSIONS: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt'],
  DOCUMENT_REGEX: /\.(pdf|docx?|xlsx?|pptx?|txt)$/i,

  // Special media type extensions
  LIVE_STREAM_EXTENSIONS: ['.tv'],
  LIVE_STREAM_REGEX: /\.tv$/i,
  
  OMX_STREAM_EXTENSIONS: ['.stream'],
  OMX_STREAM_REGEX: /\.stream$/i,
  
  LINK_EXTENSIONS: ['.link'],
  LINK_REGEX: /\.link$/i,
  
  CORS_LINK_EXTENSIONS: ['.weblink'],
  CORS_LINK_REGEX: /\.weblink$/i,
  
  MEDIA_RSS_EXTENSIONS: ['.mrss'],
  MEDIA_RSS_REGEX: /\.mrss$/i,
  
  RADIO_EXTENSIONS: ['.radio'],
  RADIO_REGEX: /\.radio$/i,
  
  LOCAL_EXTENSIONS: ['.local'],
  LOCAL_REGEX: /\.local$/i,
} as const;

// Helper functions for media type detection
export const MediaTypeUtils = {
  /**
   * Check if a file is an image based on its type or filename
   */
  isImage: (typeOrFilename: string): boolean => {
    if (!typeOrFilename) return false;
    
    // Check by MIME type pattern
    if (MEDIA_TYPES.IMAGE_MIME_PATTERN.test(typeOrFilename)) {
      return true;
    }
    
    // Check by file extension
    if (typeOrFilename.includes('.')) {
      return MEDIA_TYPES.IMAGE_REGEX.test(typeOrFilename);
    }
    
    // Check if type contains 'image'
    return typeOrFilename.toLowerCase().includes('image');
  },

  /**
   * Check if a file is a video based on its type or filename
   */
  isVideo: (typeOrFilename: string): boolean => {
    if (!typeOrFilename) return false;
    
    // Check by MIME type pattern
    if (MEDIA_TYPES.VIDEO_MIME_PATTERN.test(typeOrFilename)) {
      return true;
    }
    
    // Check by file extension
    if (typeOrFilename.includes('.')) {
      return MEDIA_TYPES.VIDEO_REGEX.test(typeOrFilename);
    }
    
    // Check if type contains 'video'
    return typeOrFilename.toLowerCase().includes('video');
  },

  /**
   * Check if a file is audio based on its type or filename
   */
  isAudio: (typeOrFilename: string): boolean => {
    if (!typeOrFilename) return false;
    
    // Check by MIME type pattern
    if (MEDIA_TYPES.AUDIO_MIME_PATTERN.test(typeOrFilename)) {
      return true;
    }
    
    // Check by file extension
    if (typeOrFilename.includes('.')) {
      return MEDIA_TYPES.AUDIO_REGEX.test(typeOrFilename);
    }
    
    // Check if type contains 'audio'
    return typeOrFilename.toLowerCase().includes('audio');
  },

  /**
   * Check if a file is a document based on its type or filename
   */
  isDocument: (typeOrFilename: string): boolean => {
    if (!typeOrFilename) return false;
    
    // Check by file extension
    if (typeOrFilename.includes('.')) {
      return MEDIA_TYPES.DOCUMENT_REGEX.test(typeOrFilename);
    }
    
    return false;
  },

  /**
   * Check if a file is a live stream (.tv)
   */
  isLiveStream: (typeOrFilename: string): boolean => {
    if (!typeOrFilename) return false;
    return MEDIA_TYPES.LIVE_STREAM_REGEX.test(typeOrFilename);
  },

  /**
   * Check if a file is an OMX stream (.stream)
   */
  isOmxStream: (typeOrFilename: string): boolean => {
    if (!typeOrFilename) return false;
    return MEDIA_TYPES.OMX_STREAM_REGEX.test(typeOrFilename);
  },

  /**
   * Check if a file is a link (.link)
   */
  isLink: (typeOrFilename: string): boolean => {
    if (!typeOrFilename) return false;
    return MEDIA_TYPES.LINK_REGEX.test(typeOrFilename);
  },

  /**
   * Check if a file is a CORS link (.weblink)
   */
  isCorsLink: (typeOrFilename: string): boolean => {
    if (!typeOrFilename) return false;
    return MEDIA_TYPES.CORS_LINK_REGEX.test(typeOrFilename);
  },

  /**
   * Check if a file is media RSS (.mrss)
   */
  isMediaRss: (typeOrFilename: string): boolean => {
    if (!typeOrFilename) return false;
    return MEDIA_TYPES.MEDIA_RSS_REGEX.test(typeOrFilename);
  },

  /**
   * Check if a file is radio (.radio)
   */
  isRadio: (typeOrFilename: string): boolean => {
    if (!typeOrFilename) return false;
    return MEDIA_TYPES.RADIO_REGEX.test(typeOrFilename);
  },

  /**
   * Check if a file is local (.local)
   */
  isLocal: (typeOrFilename: string): boolean => {
    if (!typeOrFilename) return false;
    return MEDIA_TYPES.LOCAL_REGEX.test(typeOrFilename);
  },

  /**
   * Get media type category
   */
  getMediaType: (typeOrFilename: string): 'image' | 'video' | 'audio' | 'document' | 'link' | 'livestream' | 'stream' | 'corslink' | 'rss' | 'radio' | 'local' | 'unknown' => {
    if (!typeOrFilename) return 'unknown';
    
    if (MediaTypeUtils.isLiveStream(typeOrFilename)) return 'livestream';
    if (MediaTypeUtils.isOmxStream(typeOrFilename)) return 'stream';
    if (MediaTypeUtils.isCorsLink(typeOrFilename)) return 'corslink';
    if (MediaTypeUtils.isMediaRss(typeOrFilename)) return 'rss';
    if (MediaTypeUtils.isRadio(typeOrFilename)) return 'radio';
    if (MediaTypeUtils.isLocal(typeOrFilename)) return 'local';
    if (MediaTypeUtils.isLink(typeOrFilename)) return 'link';
    if (MediaTypeUtils.isImage(typeOrFilename)) return 'image';
    if (MediaTypeUtils.isVideo(typeOrFilename)) return 'video';
    if (MediaTypeUtils.isAudio(typeOrFilename)) return 'audio';
    if (MediaTypeUtils.isDocument(typeOrFilename)) return 'document';
    
    return 'unknown';
  }
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3005',
  ENDPOINTS: {
    FILES: '/api/files',
    ASSETS: '/api/assets',
    PLAYLISTS: '/api/playlists',
    GROUPS: '/api/groups',
    PLAYERS: '/api/players',
    SERVER_CONFIG: '/api/serverconfig',
    UPLOAD: '/api/files',
    POST_UPLOAD: '/api/postupload',
    MEDIA: '/media',
  }
} as const;

// Application constants
export const APP_CONSTANTS = {
  // API related
  DEFAULT_PAGE_SIZE: 20,
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  
  // UI constants
  SIDEBAR_WIDTH: 240,
  HEADER_HEIGHT: 64,
  
  // Time constants
  DEFAULT_ASSET_DURATION: 10, // seconds
  MAX_VALIDITY_YEARS: 5,
  
  // File upload
  ACCEPTED_FILE_TYPES: [
    ...MEDIA_TYPES.IMAGE_EXTENSIONS,
    ...MEDIA_TYPES.VIDEO_EXTENSIONS,
    ...MEDIA_TYPES.AUDIO_EXTENSIONS,
    ...MEDIA_TYPES.DOCUMENT_EXTENSIONS
  ].join(','),
} as const;

// Asset validity constants
export const VALIDITY_CONSTANTS = {
  HIDE_TITLE_OPTIONS: ['title', 'none'] as const,
  DEFAULT_ZOOM: 1,
  MIN_ZOOM: 0.1,
  MAX_ZOOM: 3,
  ZOOM_STEP: 0.1,
} as const;
