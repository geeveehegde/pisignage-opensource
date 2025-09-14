'use client';

import { useEffect, useState, lazy, Suspense, useMemo, useCallback, memo } from 'react';
import { useRouter } from 'next/navigation';
import { assetAPI, API_BASE_URL } from '@/lib/api';
import type { Asset, UploadFile, PostUploadData, CreateLinkData } from './lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowUpTrayIcon, TagIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
// Lazy load dialog components
const ValidityDialog = lazy(() => import('./components/ValidityDialog'));
const UploadStatusDialog = lazy(() => import('./components/UploadStatusDialog'));
const AddLinkDialog = lazy(() => import('./components/AddLinkDialog'));

// Memoized Thumbnail Component
const AssetThumbnail = memo(({ 
  thumbnail, 
  name, 
  onClick 
}: { 
  thumbnail?: string; 
  name: string; 
  onClick: () => void; 
}) => {
  return (
    <div 
      onClick={onClick}
      className="cursor-pointer hover:opacity-80 transition-opacity"
    >
      {thumbnail ? (
        <img 
          src={`${API_BASE_URL}${thumbnail}`}
          alt={name}
          loading="lazy"
          className="w-12 h-10 object-cover rounded-lg"
        />
      ) : (
        <div className="w-12 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
      )}
    </div>
  );
});

AssetThumbnail.displayName = 'AssetThumbnail';

// Memoized Asset Info Component
const AssetInfo = memo(({ 
  asset, 
  isEditing, 
  editedName, 
  onNameChange, 
  onSave, 
  onCancel, 
  onClick 
}: {
  asset: any;
  isEditing: boolean;
  editedName: string;
  onNameChange: (name: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onClick: () => void;
}) => {
  if (isEditing) {
    return (
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          value={editedName}
          onChange={(e) => onNameChange(e.target.value)}
          className="font-medium text-gray-900"
          autoFocus
        />
        <Button
          onClick={onSave}
          size="sm"
          variant="default"
        >
          Save
        </Button>
        <Button
          onClick={onCancel}
          size="sm"
          variant="outline"
        >
          Cancel
        </Button>
      </div>
    );
  }
  
  return (
    <>
      <div 
        onClick={onClick}
        className="font-medium text-primary cursor-pointer transition-colors"
      >
        {asset.name}
      </div>
      <div className="text-xs text-gray-400">
        {asset.resolution ? `${asset.resolution.width}x${asset.resolution.height}` : 'Unknown resolution'}
      </div>
      <div className="text-xs text-gray-400">
        {asset.size}, {asset.createdAt ? new Date(asset.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Unknown'}
      </div>
    </>
  );
});

AssetInfo.displayName = 'AssetInfo';

// Memoized Asset Actions Component
const AssetActions = memo(({ 
  asset, 
  onView, 
  onEdit, 
  onDelete, 
  onValidityOpen 
}: {
  asset: any;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onValidityOpen: () => void;
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-3">
        <button 
          onClick={onValidityOpen}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm">add validity</span>
        </button>
        
        <div className="flex items-center space-x-2">
          
          <Button 
            onClick={onEdit}
            variant="ghost"
            size="icon"
            title="Edit Asset"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Button>
          <Button 
            onClick={onDelete}
            variant="ghost"
            size="icon"
            className="text-red-500 hover:text-red-700 hover:bg-red-50" 
            title="Delete Asset"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </Button>
        </div>
      </div>
      
      {asset.validity && asset.validity.enable && (
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs text-green-600 font-medium">
            Valid: {new Date(asset.validity.startdate).toLocaleDateString()} - {new Date(asset.validity.enddate).toLocaleDateString()}
          </span>
        </div>
      )}
    </div>
  );
});

AssetActions.displayName = 'AssetActions';

// Memoized Asset Row Component
const AssetRow = memo(({ 
  asset, 
  editingAsset, 
  editedName, 
  onAssetClick, 
  onEditAsset, 
  onViewAsset, 
  onDeleteAsset, 
  onValidityOpen, 
  onNameChange, 
  onSaveAssetName, 
  onCancelEdit,
  selectedAssets,
  onAssetSelect
}: {
  asset: any;
  editingAsset: any;
  editedName: string;
  onAssetClick: (asset: any) => void;
  onEditAsset: (asset: any) => void;
  onViewAsset: (asset: any) => void;
  onDeleteAsset: (asset: any) => void;
  onValidityOpen: (asset: any) => void;
  onNameChange: (name: string) => void;
  onSaveAssetName: (asset: any) => void;
  onCancelEdit: () => void;
  selectedAssets: string[];
  onAssetSelect: (assetId: string) => void;
}) => {
  const isEditing = editingAsset && editingAsset._id === asset._id;

  const handleAssetClick = useCallback(() => onAssetClick(asset), [onAssetClick, asset]);
  const handleEditAsset = useCallback(() => onEditAsset(asset), [onEditAsset, asset]);
  const handleViewAsset = useCallback(() => onViewAsset(asset), [onViewAsset, asset]);
  const handleDeleteAsset = useCallback(() => onDeleteAsset(asset), [onDeleteAsset, asset]);
  const handleValidityOpen = useCallback(() => onValidityOpen(asset), [onValidityOpen, asset]);
  const handleSaveAssetName = useCallback(() => onSaveAssetName(asset), [onSaveAssetName, asset]);

  return (
    <TableRow key={asset._id} className="border-b border-gray-200">
      {/* Checkbox */}
      <TableCell>
        <Checkbox 
          checked={selectedAssets.includes(asset._id)}
          onCheckedChange={() => onAssetSelect(asset._id)}
        />
      </TableCell>
      
      {/* Name */}
      <TableCell className="py-4">
        <div className="flex items-center space-x-4">
          {/* Thumbnail */}
          <AssetThumbnail
            thumbnail={asset.thumbnail}
            name={asset.name}
            onClick={handleAssetClick}
          />
          
          {/* File Information */}
          <div className="flex-1">
            <AssetInfo
              asset={asset}
              isEditing={isEditing}
              editedName={editedName}
              onNameChange={onNameChange}
              onSave={handleSaveAssetName}
              onCancel={onCancelEdit}
              onClick={handleAssetClick}
            />
          </div>
        </div>
      </TableCell>
      
      {/* Type */}
      <TableCell>
        <span className="text-sm text-gray-600">{asset.type}</span>
      </TableCell>
      
      {/* Categories */}
      <TableCell>
        {asset.playlists && asset.playlists.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {asset.playlists.slice(0, 2).map((playlist: string, index: number) => (
              <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {playlist}
              </span>
            ))}
            {asset.playlists.length > 2 && (
              <span className="text-xs text-gray-500">+{asset.playlists.length - 2}</span>
            )}
          </div>
        ) : (
          <span className="text-xs text-gray-400">No categories</span>
        )}
      </TableCell>
      
      {/* Actions */}
      <TableCell>
        <AssetActions
          asset={asset}
          onView={handleViewAsset}
          onEdit={handleEditAsset}
          onDelete={handleDeleteAsset}
          onValidityOpen={handleValidityOpen}
        />
      </TableCell>
    </TableRow>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for optimal re-rendering
  return (
    prevProps.asset._id === nextProps.asset._id &&
    prevProps.asset.name === nextProps.asset.name &&
    prevProps.asset.validity === nextProps.asset.validity &&
    prevProps.editingAsset?._id === nextProps.editingAsset?._id &&
    prevProps.editedName === nextProps.editedName &&
    prevProps.selectedAssets.includes(prevProps.asset._id) === nextProps.selectedAssets.includes(nextProps.asset._id)
  );
});

AssetRow.displayName = 'AssetRow';

export default function AssetsPage() {
  const router = useRouter();
  const [filesData, setFilesData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [validityDialogOpen, setValidityDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [assetToDelete, setAssetToDelete] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);
  const [editingAsset, setEditingAsset] = useState<any>(null);
  const [editedName, setEditedName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'uploading' | 'complete' | 'error' | 'processing'>('uploading');
  const [uploadedFiles, setUploadedFiles] = useState<UploadFile[]>([]);
  const [addLinkDialogOpen, setAddLinkDialogOpen] = useState(false);
  const [preselectedFileType, setPreselectedFileType] = useState<string | null>(null);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        const response = await assetAPI.getFiles();
        console.log('Files data:', response);
        setFilesData(response.data);
      } catch (error) {
        console.error('Error fetching files:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  // Memoized expensive calculations
  const assetsWithData = useMemo(() => {
    if (!filesData?.files || !filesData?.dbdata) return [];

  // Filter files that have corresponding dbdata
    const filesWithDbData = filesData.files.filter((filename: string) => 
    filesData.dbdata?.some((dbItem: any) => dbItem.name === filename)
    );

  // Map files to their corresponding dbdata
    return filesWithDbData.map((filename: string) => {
    const dbItem = filesData.dbdata.find((item: any) => item.name === filename);
    return {
      _id: dbItem._id,
      name: filename,
      type: dbItem.type,
      size: dbItem.size,
      duration: dbItem.duration,
      resolution: dbItem.resolution,
      thumbnail: dbItem.thumbnail,
      createdAt: dbItem.createdAt,
      playlists: dbItem.playlists,
      labels: dbItem.labels,
      validity: dbItem.validity,
      url: `/media/${filename}`,
      fullPath: filename
    };
  });
  }, [filesData?.files, filesData?.dbdata]);

  // Filtered assets based on search term
  const filteredAssets = useMemo(() => {
    if (!searchTerm.trim()) return assetsWithData;
    
    const searchLower = searchTerm.toLowerCase();
    return assetsWithData.filter((asset: any) => {
      return (
        asset.name.toLowerCase().includes(searchLower) ||
        asset.type.toLowerCase().includes(searchLower) ||
        (asset.playlists && asset.playlists.some((playlist: string) => 
          playlist.toLowerCase().includes(searchLower)
        )) ||
        (asset.labels && asset.labels.some((label: string) => 
          label.toLowerCase().includes(searchLower)
        ))
      );
    });
  }, [assetsWithData, searchTerm]);

  // Memoized event handlers
  const handleViewAsset = useCallback((asset: any) => {
    router.push(`/assets/${encodeURIComponent(asset.name)}`);
  }, [router]);

  const handleEditAsset = useCallback((asset: any) => {
    setEditingAsset(asset);
    // Remove file extension for editing
    const nameWithoutExtension = asset.name.replace(/\.[^/.]+$/, '');
    setEditedName(nameWithoutExtension);
  }, []);

  const handleDeleteAsset = useCallback((asset: any) => {
    setAssetToDelete(asset);
    setDeleteDialogOpen(true);
  }, []);

  const handleAssetClick = useCallback((asset: any) => {
    router.push(`/assets/${encodeURIComponent(asset.name)}`);
  }, [router]);

  const handleValidityOpen = useCallback((asset: any) => {
    setSelectedAsset(asset);
    setValidityDialogOpen(true);
  }, []);

  const handleNameChange = useCallback((name: string) => {
    setEditedName(name);
  }, []);

  const handleSaveAssetName = useCallback(async (asset: any) => {
    try {
      // Get the file extension from the original name
      const fileExtension = asset.name.match(/\.[^/.]+$/)?.[0] || '';
      const newFullName = editedName + fileExtension;
      
      // Make POST request to rename the file using the API
      const response = await assetAPI.updateFile(asset.name, { newname: newFullName });
      
      if (response.success) {
        // Update local state only after successful API call
        setFilesData((prev: any) => ({
          ...prev,
          files: prev.files.map((filename: string) => 
            filename === asset.name ? newFullName : filename
          ),
          dbdata: prev.dbdata.map((item: any) => 
            item.name === asset.name ? { ...item, name: newFullName } : item
          )
        }));
        
        // Exit editing mode
        setEditingAsset(null);
        setEditedName('');
        
        // Show success toast
        toast.success(response.message || 'Asset renamed successfully');
      } else {
        toast.error(response.message || 'Failed to rename asset');
      }
    } catch (error: any) {
      console.error('Error renaming asset:', error);
      toast.error(error.response?.data?.message || 'Failed to rename asset');
    }
  }, [editedName]);

  const handleCancelEdit = useCallback(() => {
    setEditingAsset(null);
    setEditedName('');
  }, []);

  const confirmDelete = async () => {
    if (!assetToDelete) return;
    
    try {
      setDeleting(true);
      const response = await assetAPI.deleteFile(assetToDelete.name);
      
      if (response.success) {
        // Remove the deleted asset from the local state
        setFilesData((prev: any) => ({
          ...prev,
          files: prev.files.filter((filename: string) => filename !== assetToDelete.name),
          dbdata: prev.dbdata.filter((item: any) => item.name !== assetToDelete.name)
        }));
        
        // Close the dialog
        setDeleteDialogOpen(false);
        setAssetToDelete(null);
      } else {
        throw new Error('Failed to delete asset');
      }
    } catch (error) {
      console.error('Error deleting asset:', error);
      // You might want to show an error message to the user here
    } finally {
      setDeleting(false);
    }
  };


  const saveValidity = (asset: any, validityData: any) => {
    console.log('Saving validity for:', asset.name, validityData);
    // Implement save logic here
  };

  const handleUploadFiles = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '*/*'; // Accept all file types, you can restrict to specific types if needed
    
    input.onchange = async (event) => {
      const target = event.target as HTMLInputElement;
      const files = target.files;
      
      if (!files || files.length === 0) return;
      
      // Show upload dialog
      setUploadDialogOpen(true);
      setUploadProgress(0);
      setUploadStatus('uploading');
      setUploading(true);
      
      // Get file metadata for display and API call
      const fileMetadata = Array.from(files).map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
      }));
      setUploadedFiles(fileMetadata);
      
      try {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
          formData.append('assets', files[i]);
        }
        
        // Use XMLHttpRequest for progress tracking
        const xhr = new XMLHttpRequest();
        
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(progress);
          }
        };
        
        xhr.onload = async () => {
          if (xhr.status === 200) {
            setUploadStatus('complete');
            // Refresh the files list after successful upload
            const refreshResponse = await assetAPI.getFiles();
            setFilesData(refreshResponse.data);
            console.log('Files uploaded successfully');
          } else {
            setUploadStatus('error');
            console.error('Upload failed with status:', xhr.status);
          }
          setUploading(false);
        };
        
        xhr.onerror = () => {
          setUploadStatus('error');
          setUploading(false);
          console.error('Upload failed');
        };
        
        xhr.open('POST', `${API_BASE_URL}/api/files`);
        xhr.withCredentials = true;
        xhr.send(formData);
        
      } catch (error) {
        console.error('Error uploading files:', error);
        setUploadStatus('error');
        setUploading(false);
      }
    };
    
    input.click();
  };

  const handleContinueAfterUpload = async (categories: string[]) => {
    try {
      // Make POST request to /api/postupload
      const payload = {
        files: uploadedFiles,
        categories: categories
      };
      
      const response = await assetAPI.postUpload(payload);
      console.log('Post upload response:', response);
      
      // Show processing status after successful POST request
      setUploadStatus('processing');
      
    } catch (error) {
      console.error('Error in post upload:', error);
      setUploadStatus('error');
    }
  };

  const handleDialogClose = (open: boolean) => {
    setUploadDialogOpen(open);
    if (!open) {
      // Reset states when dialog is closed
      setUploadedFiles([]);
      setUploadProgress(0);
      setUploadStatus('uploading');
    }
  };

  const handleOpenAddDialog = (fileType: string) => {
    setPreselectedFileType(fileType);
    setAddLinkDialogOpen(true);
  };

  const handleSaveLink = async (linkData: CreateLinkData) => {
    try {
      const response = await assetAPI.createLink(linkData);
      console.log('Link created successfully:', response);
      
      // Refresh the files list after successful link creation
      const refreshResponse = await assetAPI.getFiles();
      setFilesData(refreshResponse.data);
      
      // Close the dialog and reset preselected type
      setAddLinkDialogOpen(false);
      setPreselectedFileType(null);
    } catch (error) {
      console.error('Error creating link:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleCloseAddDialog = () => {
    setAddLinkDialogOpen(false);
    setPreselectedFileType(null);
  };

  const handleSelectAll = useCallback(() => {
    if (selectedAssets.length === filteredAssets.length) {
      setSelectedAssets([]);
    } else {
      setSelectedAssets(filteredAssets.map((asset: any) => asset._id));
    }
  }, [selectedAssets.length, filteredAssets]);

  const handleAssetSelect = useCallback((assetId: string) => {
    setSelectedAssets(prev => 
      prev.includes(assetId) 
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  }, []);

  return (
    <div className="w-full h-full p-4">
        <div className="flex items-center justify-between rounded-md mb-6 p-6 bg-sidebar border border-gray-200">
        <div className="flex items-center space-x-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex items-center space-x-2">
                <ArrowUpTrayIcon className="w-4 h-4" />
              Upload Asset
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleUploadFiles} disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Files'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setAddLinkDialogOpen(true)}>
              Add a link
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleOpenAddDialog('Message')}>
              Add a message
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleOpenAddDialog('Local Folder/File')}>
              Add local Folder/Files
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
          <Input 
            type="text" 
            placeholder="Search assets..." 
            className="w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" title="Filter">
            <FunnelIcon className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" title="Categories">
            <TagIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="p-6">Loading...</div>
      ) : filesData ? (
         <div className="w-full bg-sidebar rounded-md p-4 border border-gray-200">
          <Table className="w-full bg-white rounded-md">
            <TableHeader>
              <TableRow>
                <TableHead >
                  <Checkbox 
                    checked={selectedAssets.length === filteredAssets.length && filteredAssets.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead >Name</TableHead>
                <TableHead >Type</TableHead>
                <TableHead >Categories</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.length > 0 ? (
                filteredAssets.map((asset: any) => (
                  <AssetRow
                    key={asset._id}
                    asset={asset}
                    editingAsset={editingAsset}
                    editedName={editedName}
                    onAssetClick={handleAssetClick}
                    onEditAsset={handleEditAsset}
                    onViewAsset={handleViewAsset}
                    onDeleteAsset={handleDeleteAsset}
                    onValidityOpen={handleValidityOpen}
                    onNameChange={handleNameChange}
                    onSaveAssetName={handleSaveAssetName}
                    onCancelEdit={handleCancelEdit}
                    selectedAssets={selectedAssets}
                    onAssetSelect={handleAssetSelect}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    {searchTerm ? `No assets found matching "${searchTerm}"` : 'No assets available'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="p-6">No data available</div>
      )}

      {/* Validity Dialog */}
      {validityDialogOpen && (
        <Suspense fallback={<></>}>
          <ValidityDialog
            open={validityDialogOpen}
            onOpenChange={setValidityDialogOpen}
            asset={selectedAsset}
            onSave={saveValidity}
          />
        </Suspense>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{assetToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upload Status Dialog */}
      {uploadDialogOpen && (
        <Suspense fallback={<></>}>
          <UploadStatusDialog
            open={uploadDialogOpen}
            onOpenChange={handleDialogClose}
            uploadProgress={uploadProgress}
            uploadStatus={uploadStatus}
            uploadedFiles={uploadedFiles}
            onContinue={handleContinueAfterUpload}
          />
        </Suspense>
      )}

      {/* Add Link Dialog */}
      {addLinkDialogOpen && (
        <Suspense fallback={<></>}>
          <AddLinkDialog
            open={addLinkDialogOpen}
            onOpenChange={handleCloseAddDialog}
            onSave={handleSaveLink}
            preselectedFileType={preselectedFileType}
          />
        </Suspense>
      )}
    </div>
  );
} 