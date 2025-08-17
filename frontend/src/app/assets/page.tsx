'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  PlusIcon, 
  TagIcon
} from '@heroicons/react/24/outline';
import AssetUpload from '@/components/AssetUpload';
import { assetAPI } from '@/lib/api';

export default function AssetsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [assets, setAssets] = useState<any[]>([]);
  const [showLabels, setShowLabels] = useState(false);
  const [filter, setFilter] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [assetsLoading, setAssetsLoading] = useState(false);

  // Temporarily bypass authentication
  // useEffect(() => {
  //   if (!loading && !user) {
  //     router.push('/auth');
  //   }
  // }, [user, loading, router]);

  // Load assets from API
  const loadAssets = async () => {
    try {
      setAssetsLoading(true);
      const response = await assetAPI.getAssets({ filter });
      // Combine files and database assets
      const allAssets = response.files?.map((filename: string) => ({
        _id: filename,
        name: filename.includes('/') ? filename.split('/').pop() : filename, // Extract just the filename
        fullPath: filename, // Keep the full path for operations
        type: getFileType(filename),
        size: '',
        url: `/media/${filename}`,
        uploadedAt: new Date()
      })) || [];
      setAssets(allAssets);
    } catch (error) {
      console.error('Error loading assets:', error);
    } finally {
      setAssetsLoading(false);
    }
  };

  // Helper function to determine file type
  const getFileType = (filename: string): string => {
    // Extract just the filename part if it contains a path
    const actualFilename = filename.includes('/') ? filename.split('/').pop() : filename;
    
    if (!actualFilename) return 'document';
    
    if (actualFilename.match(/\.(jpg|jpeg|png|gif|bmp|tiff|webp)$/i)) return 'image';
    if (actualFilename.match(/\.(mp4|avi|mov|mkv|wmv|flv|webm|m4v)$/i)) return 'video';
    if (actualFilename.match(/\.(mp3|wav|aac|flac|ogg|m4a)$/i)) return 'audio';
    if (actualFilename.match(/\.html?$/i)) return 'html';
    if (actualFilename.match(/\.pdf$/i)) return 'pdf';
    if (actualFilename.match(/\.txt$/i)) return 'text';
    return 'document';
  };

  // Load assets when component mounts or filter changes
  useEffect(() => {
    // Temporarily bypass authentication check
    // if (user) {
      loadAssets();
    // }
  }, [filter]); // Removed user dependency





  const handleUploadAssets = async (files: File[]) => {
    try {
      const formData = new FormData();
      
      // Add each file to FormData with the field name 'assets'
      files.forEach(file => {
        formData.append('assets', file);
      });

      // Upload using FormData
      await assetAPI.uploadAsset(formData);
      
      // Reload assets after upload
      loadAssets();
    } catch (error) {
      console.error('Error uploading assets:', error);
    }
  };

  const handleEditAsset = (asset: any) => {
    console.log('Edit asset:', asset);
  };

  const handleDeleteAsset = async (asset: any) => {
    try {
      // Use fullPath if available, otherwise fall back to assetId
      const pathToDelete = asset.fullPath || asset._id;
      await assetAPI.deleteAsset(pathToDelete);
      // Reload assets after deletion
      loadAssets();
    } catch (error) {
      console.error('Error deleting asset:', error);
    }
  };

  const handleViewAsset = (asset: any) => {
    window.open(asset.url, '_blank');
  };



  // Temporarily bypass authentication checks
  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center py-12">
  //       <div className="text-center">
  //       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
  //       <p className="mt-4 text-gray-600">Loading...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // if (!user) {
  //   return null;
  // }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Assets</h1>
              <p className="text-gray-600 mt-1">Manage your digital signage assets</p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Upload Assets</span>
            </button>
          </div>

          {/* Assets Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {assets.length} Available Assets
                </h2>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowLabels(!showLabels)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                    showLabels
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <TagIcon className="h-4 w-4" />
                  <span>Labels</span>
                </button>
                <input
                  type="text"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Filter assets..."
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-900"
                />
              </div>
            </div>

            {/* Assets Content */}
            {assetsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading assets...</p>
              </div>
            ) : assets.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📁</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No assets found</h3>
                <p className="text-gray-500 mb-4">
                  {filter ? 'No assets match your search criteria.' : 'Get started by uploading your first asset.'}
                </p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Upload Your First Asset
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {assets.map((asset, index) => (
                  <div
                    key={asset._id}
                    className={`flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    {/* Asset Info */}
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {asset.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {asset.type} • {asset.size || 'Unknown size'}
                        </p>
                      </div>
                    </div>

                    {/* Asset Details */}
                    <div className="hidden sm:flex items-center space-x-8 flex-shrink-0">
                      <div className="text-sm text-gray-500">
                        {asset.type}
                      </div>
                      <div className="text-sm text-gray-500">
                        {asset.uploadedAt ? new Date(asset.uploadedAt).toLocaleDateString() : 'Unknown date'}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 ml-4">
                      {/* View Icon */}
                      <button 
                        onClick={() => handleViewAsset(asset)}
                        className="p-2 text-blue-500 hover:text-blue-700 transition-colors" 
                        title="View Asset"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>

                      {/* Edit Icon */}
                      <button 
                        onClick={() => handleEditAsset(asset)}
                        className="p-2 text-blue-500 hover:text-blue-700 transition-colors" 
                        title="Edit Asset"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>

                      {/* Delete Icon */}
                      <button 
                        onClick={() => handleDeleteAsset(asset)}
                        className="p-2 text-red-500 hover:text-red-700 transition-colors" 
                        title="Delete Asset"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>

                      {/* Download Icon */}
                      <button 
                        onClick={() => handleViewAsset(asset)}
                        className="p-2 text-gray-500 hover:text-gray-700 transition-colors" 
                        title="Download Asset"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      {/* Asset Upload Modal */}
      <AssetUpload
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUploadAssets}
      />
    </div>
  );
} 