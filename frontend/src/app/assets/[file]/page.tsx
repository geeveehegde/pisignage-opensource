'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { assetAPI } from '@/lib/api';
import { MediaTypeUtils, API_CONFIG } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeftIcon, ArrowDownTrayIcon, EyeIcon, PencilIcon, CheckIcon, PlusIcon, CalendarDaysIcon, TrashIcon } from '@heroicons/react/24/outline';

interface AssetDetailsPageProps {
  params: Promise<{
    file: string;
  }>;
}

export default function AssetDetailsPage({ params }: AssetDetailsPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const filename = decodeURIComponent(resolvedParams.file);
  const [asset, setAsset] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLinkData, setEditedLinkData] = useState<{
    link: string;
    zoom: number;
    duration: number | null;
    hideTitle: string;
  }>({
    link: '',
    zoom: 1,
    duration: null,
    hideTitle: 'title'
  });

  useEffect(() => {
    const fetchAssetDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First, get basic asset info from files API
        const filesResponse = await assetAPI.getFiles();
        const assetData = filesResponse.data.dbdata.find((item: any) => item.name === filename);
        console.log('Asset data:', assetData);
        if (assetData) {
          let detailedAssetData = assetData;
          
          // If it's a link asset, get detailed information from links API
          if (assetData.type === '.link') {
            try {
              const linkResponse = await assetAPI.getLinkDetails(filename);
              detailedAssetData = {
                ...assetData,
                ...linkResponse,
                details: linkResponse.details || linkResponse
              };
            } catch (linkError) {
              console.warn('Could not fetch link details, using basic asset data:', linkError);
            }
          }
          
          const assetWithUrl = {
            ...detailedAssetData,
            name: filename,
            url: `/media/${filename}`
          };
          setAsset(assetWithUrl);
          
          // Initialize link editing data if it's a link asset
          if (detailedAssetData.type === '.link') {
            const details = detailedAssetData.details || detailedAssetData;
            setEditedLinkData({
              link: details.link || '',
              zoom: details.zoom || 1,
              duration: details.duration || null,
              hideTitle: details.hideTitle || 'title'
            });
          }
        } else {
          setError('Asset not found');
        }
      } catch (err) {
        setError('Failed to load asset details');
        console.error('Error fetching asset:', err);
      } finally {
        setLoading(false);
      }
    };

    if (filename) {
      fetchAssetDetails();
    }
  }, [filename]);

  const handleBack = () => {
    window.history.back();
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MEDIA}/${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveLinkConfiguration = async () => {
    try {
      // Update the link configuration
      const payload = {
        categories: asset.categories || [],
        details: {
          name: asset.name,
          type: asset.type,
          link: editedLinkData.link,
          zoom: editedLinkData.zoom,
          duration: editedLinkData.duration,
          hideTitle: editedLinkData.hideTitle
        }
      };

      // Use the existing API endpoint to update link details
      const response = await assetAPI.updateFile(filename, payload);
      console.log('Link configuration updated:', response);

      // Update local asset state
      setAsset({
        ...asset,
        details: payload.details
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating link configuration:', error);
      // You might want to show an error message to the user here
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <Button onClick={handleBack} variant="outline" className="mb-6">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Assets
          </Button>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Asset Not Found</h1>
            <p className="text-gray-600">{error || 'The requested asset could not be found.'}</p>
          </div>
        </div>
      </div>
    );
  }

  const isImage = MediaTypeUtils.isImage(asset.type);
  const isVideo = MediaTypeUtils.isVideo(asset.type);
  const isLink = asset.type === '.link';

  return (
    <div className="w-full h-full p-4">
        {/* Header */}
        <div className="flex items-center justify-between rounded-md mb-6 p-6 bg-secondary">
        <div className="flex items-center space-x-3">
          <Button onClick={handleBack} variant="default">
              <ArrowLeftIcon className="w-4 h-4" />
            </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={handleDownload}
          >
            <ArrowDownTrayIcon className="w-4 h-4" />  
          </Button>
          <Button variant="outline">
            <PlusIcon className="w-4 h-4" />
          </Button>
          <Button variant="outline">
            <CalendarDaysIcon className="w-4 h-4" />
          </Button>
          <Button 
            variant="destructive" 
          >
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

        {/* Asset Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h1 className="text-xl font-bold text-gray-900 mb-6">{asset.name}</h1>
              
              {/* Image Display for Image Assets */}
              {isImage && (
                <div className="mb-6">
                  <img 
                    src={`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MEDIA}/${filename}`}
                    alt={asset.name}
                    loading="lazy"
                    className="w-full h-auto max-h-[70vh] object-contain rounded-lg border border-gray-200 shadow-sm"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      setError('Failed to load image');
                    }}
                  />
                </div>
              )}

              {/* Video Display for Video Assets */}
              {isVideo && (
                <div className="mb-6">
                  <video 
                    src={`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MEDIA}/${filename}`}
                    controls
                    preload="metadata"
                    className="w-full h-auto max-h-[70vh] rounded-lg border border-gray-200 shadow-sm"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      setError('Failed to load video');
                    }}
                  >
                    <p className="text-gray-500 p-4">
                      Your browser does not support the video tag.
                      <a 
                        href={`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MEDIA}/${filename}`} 
                        className="text-blue-600 hover:underline ml-1"
                        download={filename}
                      >
                        Download the video instead.
                      </a>
                    </p>
                  </video>
                </div>
              )}

              {/* Link Configuration for Link Assets */}
              {isLink && (
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Link Configuration</h3>
                  
                  <div className="space-y-4">
                    {/* Link URL */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Link URL</label>
                      {isEditing ? (
                        <Input
                          type="url"
                          value={editedLinkData.link}
                          onChange={(e) => setEditedLinkData({ ...editedLinkData, link: e.target.value })}
                          placeholder="https://example.com"
                          className="w-full"
                        />
                      ) : (
                        <p className="text-gray-900 bg-white px-3 py-2 rounded border">
                          {asset.details?.link || 'No link specified'}
                        </p>
                      )}
                    </div>

                    {/* Zoom Level */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Zoom Level</label>
                      {isEditing ? (
                        <Input
                          type="number"
                          min="0.1"
                          max="3"
                          step="0.1"
                          value={editedLinkData.zoom}
                          onChange={(e) => setEditedLinkData({ ...editedLinkData, zoom: parseFloat(e.target.value) || 1 })}
                          className="w-32"
                        />
                      ) : (
                        <p className="text-gray-900 bg-white px-3 py-2 rounded border w-32">
                          {asset.details?.zoom || 1}
                        </p>
                      )}
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Duration (seconds)</label>
                      {isEditing ? (
                        <Input
                          type="number"
                          min="0"
                          value={editedLinkData.duration || ''}
                          onChange={(e) => setEditedLinkData({ ...editedLinkData, duration: e.target.value ? parseInt(e.target.value) : null })}
                          placeholder="Leave empty for no limit"
                          className="w-48"
                        />
                      ) : (
                        <p className="text-gray-900 bg-white px-3 py-2 rounded border w-48">
                          {asset.details?.duration || 'No limit'}
                        </p>
                      )}
                    </div>

                    {/* Hide Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hide Title</label>
                      {isEditing ? (
                        <select
                          value={editedLinkData.hideTitle}
                          onChange={(e) => setEditedLinkData({ ...editedLinkData, hideTitle: e.target.value })}
                          className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="title">Title</option>
                          <option value="none">None</option>
                        </select>
                      ) : (
                        <p className="text-gray-900 bg-white px-3 py-2 rounded border w-32">
                          {asset.details?.hideTitle || 'title'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Type Section */}
            <div className="bg-secondary rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Type</h3>
              <p className="text-gray-900 text-lg">{asset.type || 'Unknown'}</p>
            </div>

            {/* Details Section */}
            <div className="bg-secondary rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Size</label>
                  <p className="text-gray-900">{asset.size || 'Unknown'}</p>
                </div>
                {asset.resolution && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Resolution</label>
                    <p className="text-gray-900">{asset.resolution.width} x {asset.resolution.height}</p>
                  </div>
                )}
                {asset.duration && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Duration</label>
                    <p className="text-gray-900">{asset.duration}</p>
                  </div>
                )}
                {asset.createdAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Created</label>
                    <p className="text-gray-900">
                      {new Date(asset.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Categories Section */}
            <div className="bg-secondary rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Categories</h3>
              {asset.playlists && asset.playlists.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {asset.playlists.map((playlist: string, index: number) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {playlist}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No categories assigned</p>
              )}
            </div>

            {/* Validity Section (if applicable) */}
            {asset.validity && asset.validity.enable && (
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Validity Period</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">
                    {new Date(asset.validity.startdate).toLocaleDateString()} - {new Date(asset.validity.enddate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
  );
}
