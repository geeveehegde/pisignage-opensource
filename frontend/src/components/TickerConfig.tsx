'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface TickerConfigProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: TickerConfig) => void;
  initialConfig?: TickerConfig;
}

export interface TickerConfig {
  show: boolean;
  showAssetText: boolean;
  type: 'slide' | 'scroll-left' | 'scroll-right' | 'hardware' | 'left' | 'right';
  speed: 'slow' | 'medium' | 'full';
  height: 'default' | 'large' | 'custom';
  customHeight?: string;
  customCSS?: string;
  useRSS: boolean;
  messages: string;
}

export default function TickerConfig({ isOpen, onClose, onSave, initialConfig }: TickerConfigProps) {
  const [config, setConfig] = useState<TickerConfig>(initialConfig || {
    show: true,
    showAssetText: false,
    type: 'scroll-left',
    speed: 'full',
    height: 'default',
    customHeight: '',
    customCSS: '',
    useRSS: false,
    messages: ''
  });

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-30 backdrop-blur-md z-40 transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ease-in-out ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Ticker for the Play-list
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Ticker Options */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.show}
                    onChange={(e) => setConfig({ ...config, show: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Show</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.showAssetText}
                    onChange={(e) => setConfig({ ...config, showAssetText: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Show asset associated text</span>
                </label>
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type:</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'slide', label: 'Slide' },
                    { value: 'scroll-left', label: 'Scroll left' },
                    { value: 'scroll-right', label: 'Scroll right' },
                    { value: 'hardware', label: 'Hardware' },
                    { value: 'left', label: 'left' },
                    { value: 'right', label: 'right' }
                  ].map((type) => (
                    <label key={type.value} className="flex items-center">
                      <input
                        type="radio"
                        name="type"
                        value={type.value}
                        checked={config.type === type.value}
                        onChange={(e) => setConfig({ ...config, type: e.target.value as any })}
                        className="border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Optional CSS */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Optional CSS:</label>
                <input
                  type="text"
                  value={config.customCSS}
                  onChange={(e) => setConfig({ ...config, customCSS: e.target.value })}
                  placeholder="e.g. color:#eee; font-style:italic;"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Ticker Speed */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ticker Speed:</label>
                <div className="flex space-x-4">
                  {[
                    { value: 'slow', label: 'Slow' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'full', label: 'Full' }
                  ].map((speed) => (
                    <label key={speed.value} className="flex items-center">
                      <input
                        type="radio"
                        name="speed"
                        value={speed.value}
                        checked={config.speed === speed.value}
                        onChange={(e) => setConfig({ ...config, speed: e.target.value as any })}
                        className="border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{speed.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Ticker Height */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ticker Height:</label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="height"
                      value="default"
                      checked={config.height === 'default'}
                      onChange={(e) => setConfig({ ...config, height: e.target.value as any })}
                      className="border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Default(60px)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="height"
                      value="large"
                      checked={config.height === 'large'}
                      onChange={(e) => setConfig({ ...config, height: e.target.value as any })}
                      className="border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Large(100px)</span>
                  </label>
                  <div className="flex items-center space-x-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="height"
                        value="custom"
                        checked={config.height === 'custom'}
                        onChange={(e) => setConfig({ ...config, height: e.target.value as any })}
                        className="border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">custom</span>
                    </label>
                    <input
                      type="text"
                      value={config.customHeight}
                      onChange={(e) => setConfig({ ...config, customHeight: e.target.value })}
                      placeholder="Custom"
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Use RSS Feed */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.useRSS}
                    onChange={(e) => setConfig({ ...config, useRSS: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Use RSS feed</span>
                </label>
              </div>
            </div>

            {/* Messages Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Messages for the ticker:
              </label>
              <textarea
                value={config.messages}
                onChange={(e) => setConfig({ ...config, messages: e.target.value })}
                placeholder="Enter messages here"
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end p-6 border-t border-gray-200">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
            >
              SAVE
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 