'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { assetAPI } from '@/lib/api';
import { API_BASE_URL } from '@/lib/api';
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
import { Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ValidityDialog from './components/ValidityDialog';

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

  // Filter files that have corresponding dbdata
  const filesWithDbData = filesData?.files?.filter((filename: string) => 
    filesData.dbdata?.some((dbItem: any) => dbItem.name === filename)
  ) || [];

  // Map files to their corresponding dbdata
  const assetsWithData = filesWithDbData.map((filename: string) => {
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

  const handleViewAsset = (asset: any) => {
    router.push(`/assets/${encodeURIComponent(asset.name)}`);
  };

  const handleEditAsset = (asset: any) => {
    setEditingAsset(asset);
    // Remove file extension for editing
    const nameWithoutExtension = asset.name.replace(/\.[^/.]+$/, '');
    setEditedName(nameWithoutExtension);
  };

  const handleDeleteAsset = (asset: any) => {
    setAssetToDelete(asset);
    setDeleteDialogOpen(true);
  };

  const handleSaveAssetName = async (asset: any) => {
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
      } else {
        throw new Error('Failed to rename asset');
      }
    } catch (error) {
      console.error('Error renaming asset:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleCancelEdit = () => {
    setEditingAsset(null);
    setEditedName('');
  };

  const handleAssetClick = (asset: any) => {
    router.push(`/assets/${encodeURIComponent(asset.name)}`);
  };

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

  const openValidityDialog = (asset: any) => {
    setSelectedAsset(asset);
    setValidityDialogOpen(true);
  };

  const saveValidity = (asset: any, validityData: any) => {
    console.log('Saving validity for:', asset.name, validityData);
    // Implement save logic here
  };

  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between mb-6 p-6">
        <h1 className="text-2xl font-bold">Assets</h1>
        <Button className="flex items-center space-x-2">
          <Upload className="w-4 h-4" />
          Upload Asset
        </Button>
      </div>
      
      {loading ? (
        <div className="p-6">Loading...</div>
      ) : filesData ? (
        <div className="w-full">
          <Table className="w-full">
            <TableBody>
              {assetsWithData.map((asset: any) => (
                <TableRow key={asset._id} className="border-b border-gray-200">
                  <TableCell className="py-4">
                    <div className="flex items-center space-x-4">
                      {/* Thumbnail */}
                      <div 
                        onClick={() => handleAssetClick(asset)}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                      >
                        {asset.thumbnail ? (
                          <img 
                            src={`${API_BASE_URL}${asset.thumbnail}`}
                            alt={asset.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                          </div>
                        )}
                      </div>
                      
                      {/* File Information */}
                      <div className="flex-1">
                        {editingAsset && editingAsset._id === asset._id ? (
                          <div className="flex items-center space-x-2">
                            <Input
                              type="text"
                              value={editedName}
                              onChange={(e) => setEditedName(e.target.value)}
                              className="font-medium text-gray-900"
                              autoFocus
                            />
                            <Button
                              onClick={() => handleSaveAssetName(asset)}
                              size="sm"
                              variant="default"
                              >
                              Save
                            </Button>
                            <Button
                              onClick={handleCancelEdit}
                              size="sm"
                              variant="outline"
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div 
                            onClick={() => handleAssetClick(asset)}
                            className="font-medium text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                          >
                            {asset.name}
                          </div>
                        )}
                        <div className="text-sm text-gray-600">
                          {asset.resolution ? `${asset.resolution.width}x${asset.resolution.height}` : 'Unknown resolution'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {asset.type}, {asset.size}, {asset.createdAt ? new Date(asset.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Unknown'}
                        </div>
                        {asset.playlists && asset.playlists.length > 0 && (
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-xs text-blue-600 font-medium">
                              Playlists: {asset.playlists.join(', ')}
                            </span>
                          </div>
                        )}
                        

                      </div>
                    </div>
                  </TableCell>
                  

                  
                  {/* Actions */}
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => openValidityDialog(asset)}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">add validity</span>
                      </button>
                      

                      
                      <div className="flex items-center space-x-2">
                        <Button 
                          onClick={() => handleViewAsset(asset)}
                          variant="ghost"
                          size="icon"
                          title="View Asset"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Button>
                        <Button 
                          onClick={() => handleEditAsset(asset)}
                          variant="ghost"
                          size="icon"
                          title="Edit Asset"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Button>
                        <Button 
                          onClick={() => handleDeleteAsset(asset)}
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
                  </TableCell>
                  
                  {/* Checkbox */}
                  <TableCell>
                    <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="p-6">No data available</div>
      )}

      {/* Validity Dialog */}
      <ValidityDialog
        open={validityDialogOpen}
        onOpenChange={setValidityDialogOpen}
        asset={selectedAsset}
        onSave={saveValidity}
      />

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
    </div>
  );
} 