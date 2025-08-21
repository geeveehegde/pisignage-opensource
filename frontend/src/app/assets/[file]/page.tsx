'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { assetAPI, API_BASE_URL } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Eye, Edit, Save } from 'lucide-react';

export default function AssetDetailsPage() {
  const params = useParams();
  const filename = decodeURIComponent(params.file as string);
  const [asset, setAsset] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssetDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get asset details from the API
        const response = await assetAPI.getFiles();
        const assetData = response.data.dbdata.find((item: any) => item.name === filename);
        
        if (assetData) {
          setAsset({
            ...assetData,
            name: filename,
            url: `/media/${filename}`
          });
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
    link.href = `${API_BASE_URL}/media/${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <ArrowLeft className="w-4 h-4 mr-2" />
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

  const isImage = asset.type && asset.type.toLowerCase().includes('image');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Assets
          </Button>
          
          <div className="flex items-center space-x-3">
            <Button onClick={handleDownload} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="default">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        {/* Asset Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{asset.name}</h1>
              
              {/* Image Display for Image Assets */}
              {isImage && (
                <div className="mb-6">
                  <img 
                    src={`${API_BASE_URL}/media/${filename}`}
                    alt={asset.name}
                    className="w-full h-auto max-h-[70vh] object-contain rounded-lg border border-gray-200 shadow-sm"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      setError('Failed to load image');
                    }}
                  />
                </div>
              )}

              {/* Asset Information */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Type</label>
                    <p className="text-gray-900">{asset.type || 'Unknown'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Size</label>
                    <p className="text-gray-900">{asset.size || 'Unknown'}</p>
                  </div>
                  {asset.resolution && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Resolution</label>
                        <p className="text-gray-900">{asset.resolution.width} x {asset.resolution.height}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Duration</label>
                        <p className="text-gray-900">{asset.duration || 'N/A'}</p>
                      </div>
                    </>
                  )}
                </div>

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

                {asset.playlists && asset.playlists.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Playlists</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {asset.playlists.map((playlist: string, index: number) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                        >
                          {playlist}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {asset.validity && asset.validity.enable && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Validity Period</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">
                        {new Date(asset.validity.startdate).toLocaleDateString()} - {new Date(asset.validity.enddate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Eye className="w-4 h-4 mr-2" />
                    View in Player
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Download Original
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
