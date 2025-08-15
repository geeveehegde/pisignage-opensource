'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface Layout {
  id: string;
  name: string;
  description: string;
  mainZone: string;
  sideZone?: string;
  bottomZone?: string;
  topZone?: string;
  bannerZone?: string;
  graphic: string;
}

interface LayoutSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLayout: string;
  onLayoutSelect: (layout: string) => void;
}

const layouts: Layout[] = [
  {
    id: '1',
    name: '1: Single Zone Display',
    description: 'main Zone:1280x720',
    mainZone: '1280x720',
    graphic: 'single-zone'
  },
  {
    id: '2a',
    name: '2a: Two Zones with Main Zone on right',
    description: 'main Zone:960x720, side Zone:320x720',
    mainZone: '960x720',
    sideZone: '320x720',
    graphic: 'two-zones-right'
  },
  {
    id: '2ap',
    name: '2ap: Single Zone Portrait Mode, Orient clockwise',
    description: 'main Zone:720x1280',
    mainZone: '720x1280',
    graphic: 'portrait-clockwise'
  },
  {
    id: '2ap270',
    name: '2ap270: Single Zone Portrait Mode, Orient anti-clockwise',
    description: 'main Zone: 720x1280',
    mainZone: '720x1280',
    graphic: 'portrait-anticlockwise'
  },
  {
    id: '2b',
    name: '2b: Two Zones with Main Zone on left',
    description: 'main Zone:960x720, side Zone:320x720',
    mainZone: '960x720',
    sideZone: '320x720',
    graphic: 'two-zones-left'
  },
  {
    id: '2bp',
    name: '2bp: Two Zones Portrait Mode, Orient clockwise',
    description: 'top Zone:720x540,bottom zone:720x740',
    mainZone: '720x540',
    sideZone: '720x740',
    graphic: 'portrait-two-clockwise'
  },
  {
    id: '2bp270',
    name: '2bp270: Two Zone Portrait Mode, Orient anti-clockwise',
    description: 'top Zone:720x540, bottom zone:720x740',
    mainZone: '720x540',
    sideZone: '720x740',
    graphic: 'portrait-two-anticlockwise'
  },
  {
    id: '2c',
    name: '2c: Two Equal Size Zones with Video Zone on left',
    description: 'main Zone:640x720, side Zone:640x720',
    mainZone: '640x720',
    sideZone: '640x720',
    graphic: 'two-equal-left'
  },
  {
    id: '2d',
    name: '2d: Two Equal Size Zones with Video Zone on right',
    description: 'main Zone:640x720, side Zone:640x720',
    mainZone: '640x720',
    sideZone: '640x720',
    graphic: 'two-equal-right'
  },
  {
    id: '3a',
    name: '3a: Three Zones(full bottom) with Main Zone on right',
    description: 'main Zone:960x540, side Zone:320x540, bottom Zone:1280x180',
    mainZone: '960x540',
    sideZone: '320x540',
    bottomZone: '1280x180',
    graphic: 'three-zones-main-right'
  },
  {
    id: '3b',
    name: '3b: Three Zones(full bottom) with Main Zone on left',
    description: 'main Zone:960x540, side Zone:320x540, bottom Zone:1280x180',
    mainZone: '960x540',
    sideZone: '320x540',
    bottomZone: '1280x180',
    graphic: 'three-zones-main-left'
  },
  {
    id: '3c',
    name: '3c: Three Zones(full top) with Main Zone on right (enable in settings)',
    description: 'main Zone:960x540, side Zone:320x540, top Zone:1280x180',
    mainZone: '960x540',
    sideZone: '320x540',
    topZone: '1280x180',
    graphic: 'three-zones-top-main-right'
  },
  {
    id: '3d',
    name: '3d: Three Zones(full top) with Main Zone on left (enable in settings)',
    description: 'main Zone:960x540, side Zone:320x540, top Zone:1280x180',
    mainZone: '960x540',
    sideZone: '320x540',
    topZone: '1280x180',
    graphic: 'three-zones-top-main-left'
  },
  {
    id: '4a',
    name: '4a: Three Zones(full side) with Main Zone on right',
    description: 'main Zone:960x540, side Zone:320x720, bottom Zone:960x180',
    mainZone: '960x540',
    sideZone: '320x720',
    bottomZone: '960x180',
    graphic: 'three-zones-side-main-right'
  },
  {
    id: '4b',
    name: '4b: Three Zones(full side) with Main Zone on left',
    description: 'main Zone:960x540, side Zone:320x720, bottom Zone:960x180',
    mainZone: '960x540',
    sideZone: '320x720',
    bottomZone: '960x180',
    graphic: 'three-zones-side-main-left'
  },
  {
    id: '4c',
    name: '4c: Three Zones(full side) with Main Zone on right (enable in settings)',
    description: 'main Zone:960x540, side Zone:320x720, banner Zone:960x180',
    mainZone: '960x540',
    sideZone: '320x720',
    bannerZone: '960x180',
    graphic: 'three-zones-side-main-right'
  },
  {
    id: '4d',
    name: '4d: Three Zones(full side) with Main Zone on left (enable in settings)',
    description: 'main Zone:960x540, side Zone:320x720, banner Zone:960x180',
    mainZone: '960x540',
    sideZone: '320x720',
    bannerZone: '960x180',
    graphic: 'three-zones-side-main-left'
  },
  {
    id: 'custom',
    name: 'custom: Custom Layout in Landscape Mode (v1.6.0+)',
    description: 'Upload custom_layout.html under Assets Tab(otherwise this option is disabled), Use #main,#side, #bottom, #ticker html ID tags for content, see github e.g.',
    mainZone: '',
    graphic: 'custom-landscape'
  },
  {
    id: 'customp',
    name: 'customp: Custom Layout in Portrait Mode, Orient clockwise',
    description: 'Upload custom_layout.html under Assets Tab(otherwise this option is disabled), Use #main,#side, #bottom, #ticker html ID tags for content, see github e.g.',
    mainZone: '',
    graphic: 'custom-portrait-clockwise'
  },
  {
    id: 'customp270',
    name: 'customp270: Custom Layout in Portrait Mode, Orient anti-clockwise',
    description: 'Upload custom_layout.html under Assets Tab(otherwise this option is disabled), Use #main,#side, #bottom, #ticker html ID tags for content, see github e.g.',
    mainZone: '',
    graphic: 'custom-portrait-anti-clockwise'
  }
];

const LayoutGraphic = ({ layout }: { layout: Layout }) => {
  const getGraphicStyle = () => {
    switch (layout.graphic) {
      case 'single-zone':
        return 'w-16 h-12 bg-black rounded';
      case 'two-zones-right':
        return 'flex gap-1 w-16 h-12';
      case 'two-zones-left':
        return 'flex gap-1 w-16 h-12';
      case 'portrait-clockwise':
      case 'portrait-anticlockwise':
        return 'w-12 h-16 bg-black rounded';
      case 'portrait-two-clockwise':
      case 'portrait-two-anticlockwise':
        return 'flex flex-col gap-1 w-12 h-16';
      default:
        return 'w-16 h-12 bg-black rounded';
    }
  };

  const renderGraphic = () => {
    switch (layout.graphic) {
      case 'two-zones-right':
        return (
          <>
            <div className="w-4 h-12 bg-black rounded"></div>
            <div className="w-11 h-12 bg-black rounded"></div>
          </>
        );
      case 'two-zones-left':
        return (
          <>
            <div className="w-11 h-12 bg-black rounded"></div>
            <div className="w-4 h-12 bg-black rounded"></div>
          </>
        );
      case 'two-equal-left':
        return (
          <>
            <div className="w-8 h-12 bg-black rounded"></div>
            <div className="w-7 h-12 bg-black rounded"></div>
          </>
        );
      case 'two-equal-right':
        return (
          <>
            <div className="w-7 h-12 bg-black rounded"></div>
            <div className="w-8 h-12 bg-black rounded"></div>
          </>
        );
      case 'three-zones-main-right':
        return (
          <div className="w-16 h-12 relative">
            <div className="absolute top-0 left-0 w-4 h-9 bg-black rounded"></div>
            <div className="absolute top-0 right-0 w-11 h-9 bg-black rounded"></div>
            <div className="absolute bottom-0 left-0 w-full h-2 bg-black rounded"></div>
          </div>
        );
      case 'three-zones-main-left':
        return (
          <div className="w-16 h-12 relative">
            <div className="absolute top-0 left-0 w-11 h-9 bg-black rounded"></div>
            <div className="absolute top-0 right-0 w-4 h-9 bg-black rounded"></div>
            <div className="absolute bottom-0 left-0 w-full h-2 bg-black rounded"></div>
          </div>
        );
      case 'three-zones-top-main-right':
        return (
          <div className="w-16 h-12 relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-black rounded"></div>
            <div className="absolute top-2 left-0 w-4 h-9 bg-black rounded"></div>
            <div className="absolute top-2 right-0 w-11 h-9 bg-black rounded"></div>
          </div>
        );
      case 'three-zones-top-main-left':
        return (
          <div className="w-16 h-12 relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-black rounded"></div>
            <div className="absolute top-2 left-0 w-11 h-9 bg-black rounded"></div>
            <div className="absolute top-2 right-0 w-4 h-9 bg-black rounded"></div>
          </div>
        );
      case 'three-zones-side-main-right':
        return (
          <div className="w-16 h-12 relative">
            <div className="absolute top-0 left-0 w-4 h-12 bg-black rounded"></div>
            <div className="absolute top-0 right-0 w-11 h-9 bg-black rounded"></div>
            <div className="absolute bottom-0 right-0 w-11 h-2 bg-black rounded"></div>
          </div>
        );
      case 'three-zones-side-main-left':
        return (
          <div className="w-16 h-12 relative">
            <div className="absolute top-0 left-0 w-11 h-9 bg-black rounded"></div>
            <div className="absolute top-0 right-0 w-4 h-12 bg-black rounded"></div>
            <div className="absolute bottom-0 left-0 w-11 h-2 bg-black rounded"></div>
          </div>
        );
      case 'custom-landscape':
        return (
          <div className="w-16 h-12 bg-black rounded flex items-center justify-center">
            <div className="text-white text-xs font-bold">C</div>
          </div>
        );
      case 'custom-portrait-clockwise':
        return (
          <div className="w-12 h-16 bg-black rounded flex items-center justify-center">
            <div className="text-white text-xs font-bold">C</div>
          </div>
        );
      case 'custom-portrait-anti-clockwise':
        return (
          <div className="w-12 h-16 bg-black rounded flex items-center justify-center">
            <div className="text-white text-xs font-bold">C</div>
          </div>
        );
      case 'portrait-two-clockwise':
      case 'portrait-two-anticlockwise':
        return (
          <>
            <div className="w-12 h-7 bg-black rounded"></div>
            <div className="w-12 h-8 bg-black rounded"></div>
          </>
        );
      default:
        return <div className="w-full h-full bg-black rounded"></div>;
    }
  };

  return (
    <div className={getGraphicStyle()}>
      {renderGraphic()}
    </div>
  );
};

export default function LayoutSelector({ isOpen, onClose, selectedLayout, onLayoutSelect }: LayoutSelectorProps) {
  const [activeTab, setActiveTab] = useState<'layouts' | 'mainVideo' | 'sideVideo'>('layouts');

  const handleLayoutSelect = (layoutId: string) => {
    onLayoutSelect(layoutId);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-white bg-opacity-20 backdrop-blur-md z-40 transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Slideover */}
      <div className={`fixed inset-y-0 right-0 w-[500px] bg-white shadow-xl z-50 transform transition-all duration-500 ease-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Select Display Layout (default 1)
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('layouts')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'layouts'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Layouts
          </button>
          <button
            onClick={() => setActiveTab('mainVideo')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'mainVideo'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Main Video Window
          </button>
          <button
            onClick={() => setActiveTab('sideVideo')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'sideVideo'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Side/Bottom Video Window
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)]">
          {activeTab === 'layouts' && (
            <div className="p-6">
              {/* Instructions */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 leading-relaxed">
                  The Display can be divided into multiple zones with each zone playing different content. 
                  Video files can be played only in the main Zone. Select a file in the playlist to play 
                  in the main zone, add other zone files to the main file by clicking zone file button. 
                  If there is no file attached to a particular zone, the previous content for that zone 
                  will continue to play.
                </p>
              </div>

              {/* Layout Options */}
              <div className="space-y-3 pb-4">
                {layouts.map((layout) => (
                  <div
                    key={layout.id}
                    className={`flex items-center space-x-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      selectedLayout === layout.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleLayoutSelect(layout.id)}
                  >
                    <input
                      type="radio"
                      name="layout"
                      value={layout.id}
                      checked={selectedLayout === layout.id}
                      onChange={() => handleLayoutSelect(layout.id)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <LayoutGraphic layout={layout} />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{layout.name}</div>
                      <div className="text-sm text-gray-500">{layout.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'mainVideo' && (
            <div className="p-6">
              <div className="text-center py-12">
                <p className="text-gray-500">Main Video Window configuration coming soon...</p>
              </div>
            </div>
          )}

          {activeTab === 'sideVideo' && (
            <div className="p-6">
              <div className="text-center py-12">
                <p className="text-gray-500">Side/Bottom Video Window configuration coming soon...</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            DONE
          </button>
        </div>
      </div>
    </>
  );
} 