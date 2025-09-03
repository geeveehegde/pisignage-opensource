// Asset related types
export interface Asset {
  _id: string;
  name: string;
  type: string;
  size: string;
  duration?: string | null;
  resolution?: {
    width: number;
    height: number;
  };
  thumbnail?: string;
  createdAt?: string;
  playlists?: string[];
  labels?: string[];
  validity?: {
    enable: boolean;
    startdate?: string;
    enddate?: string;
  };
  url?: string;
  fullPath?: string;
  details?: LinkDetails;
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
  files: string[];
  dbdata: Asset[];
  systemAssets?: string[];
  pagination?: {
    page: number;
    perPage: number;
    total: number;
    pages: number;
  };
}
