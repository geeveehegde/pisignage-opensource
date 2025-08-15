'use client';

import { useState } from 'react';
import { 
  PhotoIcon, 
  VideoCameraIcon, 
  DocumentIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon, 
  ArrowDownTrayIcon 
} from '@heroicons/react/24/outline';

interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  size: number;
  url: string;
  thumbnail?: string;
  uploadedAt: Date;
}

interface AssetCardProps {
  asset: Asset;
  onEdit: (asset: Asset) => void;
  onDelete: (assetId: string) => void;
  onView: (asset: Asset) => void;
}

export default function AssetCard({ asset, onEdit, onDelete, onView }: AssetCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getFileIcon = () => {
    switch (asset.type) {
      case 'image':
        return <PhotoIcon className="h-8 w-8 text-green-500" />;
      case 'video':
        return <VideoCameraIcon className="h-8 w-8 text-blue-500" />;
      case 'document':
        return <DocumentIcon className="h-8 w-8 text-gray-500" />;
      default:
        return <DocumentIcon className="h-8 w-8 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div
      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail/Preview */}
      <div className="relative h-48 bg-gray-100 flex items-center justify-center">
        {asset.thumbnail ? (
          <img
            src={asset.thumbnail}
            alt={asset.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center">
            {getFileIcon()}
            <p className="text-sm text-gray-500 mt-2">{asset.type.toUpperCase()}</p>
          </div>
        )}
        
        {/* Overlay Actions */}
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center space-x-2">
                         <button
               onClick={() => onView(asset)}
               className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
               title="View"
             >
               <EyeIcon className="h-4 w-4" />
             </button>
             <button
               onClick={() => onEdit(asset)}
               className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
               title="Edit"
             >
               <PencilIcon className="h-4 w-4" />
             </button>
             <button
               onClick={() => onDelete(asset.id)}
               className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
               title="Delete"
             >
               <TrashIcon className="h-4 w-4" />
             </button>
          </div>
        )}
      </div>

      {/* Asset Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-medium text-gray-900 text-sm truncate flex-1">
            {asset.name}
          </h3>
                     <button
             onClick={() => window.open(asset.url, '_blank')}
             className="text-blue-600 hover:text-blue-800 ml-2"
             title="Download"
           >
             <ArrowDownTrayIcon className="h-3 w-3" />
           </button>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{formatFileSize(asset.size)}</span>
          <span>{formatDate(asset.uploadedAt)}</span>
        </div>
      </div>
    </div>
  );
} 