// Asset related types
export interface Asset {
  name: string;
  type: string;
  duration: number;
  size: string;
  thumbnail: string;
  validity: {
    enable: boolean;
    startdate: string;
    enddate: string;
    starthour: number;
    endhour: number;
  };
  groupIds: string[];
  playlists: string[];
  labels: string[];
  resolution: {
    width: string;
    height: string;
  };
}

// Link specific types
export interface LinkDetails {
  name: string;
  type: string;
  link: string;
  zoom: number;
  duration: number | null;
  hideTitle: string;
}

export interface CreateLinkData {
  fileName: string;
  fileType: string;
  linkAddress: string;
}

export interface LinkPayload {
  categories: string[];
  details: LinkDetails;
}

// Upload related types
export interface UploadFile {
  name: string;
  size: number;
  type: string;
}

export interface PostUploadData {
  files: UploadFile[];
  categories: string[];
}

export interface UploadResponse {
  stat_message: string;
  success: boolean;
  data: {
    name: string;
    size: number;
    type: string;
  };
}

export interface FileDetailsResponse {
  stat_message: string;
  data: {
    name: string;
    size: string;
    ctime: string;
    path: string;
    type: string;
    dbdata: Asset;
  };
  success: boolean;
}

// Component prop types
export interface UploadStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  uploadProgress: number;
  uploadStatus: 'uploading' | 'complete' | 'error' | 'processing';
  uploadedFiles: UploadFile[];
  onContinue: (categories: string[]) => void;
}

export interface AddLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (linkData: CreateLinkData) => void;
  preselectedFileType?: string | null;
}

// API parameter types
export interface GetAssetsParams {
  page?: number;
  perPage?: number;
  filter?: string;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

export interface FilesResponse {
  stat_message: string;
  data: {
    sizes: {
      total: number;
      used: number;
    };
    files: string[];
    dbdata: Asset[];
    systemAssets: string[];
  };
  success: boolean;
}
