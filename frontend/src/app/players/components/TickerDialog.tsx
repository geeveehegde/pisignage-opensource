'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { TagIcon } from '@heroicons/react/24/outline';

interface TickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export default function TickerDialog({ open, onOpenChange, trigger }: TickerDialogProps) {
  // Ticker state
  const [tickerShow, setTickerShow] = useState(true);
  const [showAssetText, setShowAssetText] = useState(false);
  const [tickerType, setTickerType] = useState('slide');
  const [tickerSpeed, setTickerSpeed] = useState('full');
  const [tickerHeight, setTickerHeight] = useState('default');
  const [customHeight, setCustomHeight] = useState('');
  const [useRssFeed, setUseRssFeed] = useState(false);
  const [tickerMessages, setTickerMessages] = useState('');
  const [fontSize, setFontSize] = useState('28');
  const [width, setWidth] = useState('0(full)');
  const [xPosition, setXPosition] = useState('0(left)');
  const [yPosition, setYPosition] = useState('0(bottom)');
  const [rssItemDuration, setRssItemDuration] = useState('10');
  const [rssFeedLink, setRssFeedLink] = useState('');
  const [useBinaryEncoding, setUseBinaryEncoding] = useState(false);
  const [useDescriptionField, setUseDescriptionField] = useState(false);
  const [optionalCss, setOptionalCss] = useState('');

  const handleSave = () => {
    console.log('Saving ticker configuration:', {
      show: tickerShow,
      showAssetText,
      type: tickerType,
      speed: tickerSpeed,
      height: tickerHeight,
      customHeight: tickerHeight === 'custom' ? customHeight : null,
      fontSize,
      width,
      xPosition,
      yPosition,
      useRssFeed,
      rssItemDuration: useRssFeed ? rssItemDuration : null,
      rssFeedLink: useRssFeed ? rssFeedLink : null,
      useBinaryEncoding: useRssFeed ? useBinaryEncoding : null,
      useDescriptionField: useRssFeed ? useDescriptionField : null,
      messages: useRssFeed ? null : tickerMessages
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <TagIcon className="h-4 w-4" />
            <span>Set Group Ticker</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ticker for the Play-list</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* Ticker Visibility & Asset Text */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="tickerShow"
                checked={tickerShow}
                onCheckedChange={(checked) => setTickerShow(checked === true)}
              />
              <label htmlFor="tickerShow" className="text-sm font-medium text-gray-700">
                Enable ticker
              </label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="showAssetText"
                checked={showAssetText}
                onCheckedChange={(checked) => setShowAssetText(checked === true)}
              />
              <label htmlFor="showAssetText" className="text-sm font-medium text-gray-700">
                Show asset associated text
              </label>
            </div>
          </div>

          {/* All ticker configuration fields - Only visible when ticker is enabled */}
          {tickerShow && (
            <>
              {/* Type */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Type:</label>
                <RadioGroup
                  value={tickerType}
                  onValueChange={setTickerType}
                  className="flex flex-wrap gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="slide" id="slide" />
                    <label htmlFor="slide" className="text-sm text-gray-700">Slide</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="scroll-left" id="scroll-left" />
                    <label htmlFor="scroll-left" className="text-sm text-gray-700">Scroll left</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="scroll-right" id="scroll-right" />
                    <label htmlFor="scroll-right" className="text-sm text-gray-700">Scroll right</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hardware-left" id="hardware-left" />
                    <label htmlFor="hardware-left" className="text-sm text-gray-700">Hardware left</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hardware-right" id="hardware-right" />
                    <label htmlFor="hardware-right" className="text-sm text-gray-700">Hardware right</label>
                  </div>
                </RadioGroup>
              </div>

              {/* Conditional Appearance Settings or Optional CSS */}
              {(tickerType === 'hardware-left' || tickerType === 'hardware-right') ? (
                /* Appearance Settings - Only visible for hardware types */
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Appearance Settings:</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="fontSize" className="text-sm font-medium text-gray-700">Font Size:</label>
                      <Input
                        id="fontSize"
                        value={fontSize}
                        onChange={(e) => setFontSize(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="width" className="text-sm font-medium text-gray-700">Width:</label>
                      <Input
                        id="width"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="xPosition" className="text-sm font-medium text-gray-700">x position:</label>
                      <Input
                        id="xPosition"
                        value={xPosition}
                        onChange={(e) => setXPosition(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="yPosition" className="text-sm font-medium text-gray-700">y position:</label>
                      <Input
                        id="yPosition"
                        value={yPosition}
                        onChange={(e) => setYPosition(e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* Optional CSS - Visible for non-hardware types */
                <div className="space-y-2">
                  <label htmlFor="optionalCss" className="text-sm font-medium text-gray-700">
                    Optional CSS
                  </label>
                  <Input
                    id="optionalCss"
                    value={optionalCss}
                    onChange={(e) => setOptionalCss(e.target.value)}
                    placeholder="e.g. color:#eee; font-style:italic;"
                    className="w-full"
                  />
                </div>
              )}

              {/* Ticker Speed */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Ticker Speed:</label>
                <RadioGroup
                  value={tickerSpeed}
                  onValueChange={setTickerSpeed}
                  className="flex space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="slow" id="slow" />
                    <label htmlFor="slow" className="text-sm text-gray-700">Slow</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <label htmlFor="medium" className="text-sm text-gray-700">Medium</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="full" id="full" />
                    <label htmlFor="full" className="text-sm text-gray-700">Full</label>
                  </div>
                </RadioGroup>
              </div>

              {/* Ticker Height */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Ticker Height:</label>
                <div className="flex items-center space-x-4">
                  <RadioGroup
                    value={tickerHeight}
                    onValueChange={setTickerHeight}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="default" id="default-height" />
                      <label htmlFor="default-height" className="text-sm text-gray-700">Default(60px)</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="large" id="large-height" />
                      <label htmlFor="large-height" className="text-sm text-gray-700">Large(100px)</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="custom" id="custom-height" />
                      <label htmlFor="custom-height" className="text-sm text-gray-700">custom</label>
                    </div>
                  </RadioGroup>
                  {tickerHeight === 'custom' && (
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={customHeight}
                        onChange={(e) => setCustomHeight(e.target.value)}
                        placeholder="px"
                        className="w-20"
                      />
                      <span className="text-sm text-gray-700">Custom</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Use RSS Feed */}
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="useRssFeed"
                  checked={useRssFeed}
                  onCheckedChange={(checked) => setUseRssFeed(checked === true)}
                />
                <label htmlFor="useRssFeed" className="text-sm font-medium text-gray-700">
                  Use RSS feed
                </label>
              </div>

              {/* RSS Feed Configuration - Only visible when RSS feed is enabled */}
              {useRssFeed ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="rssItemDuration" className="text-sm font-medium text-gray-700">
                      Item duration:
                    </label>
                    <Input
                      id="rssItemDuration"
                      value={rssItemDuration}
                      onChange={(e) => setRssItemDuration(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="rssFeedLink" className="text-sm font-medium text-gray-700">
                      RSS feed Link:
                    </label>
                    <Input
                      id="rssFeedLink"
                      value={rssFeedLink}
                      onChange={(e) => setRssFeedLink(e.target.value)}
                      placeholder="enter your rss link ...."
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="useBinaryEncoding"
                        checked={useBinaryEncoding}
                        onCheckedChange={(checked) => setUseBinaryEncoding(checked === true)}
                      />
                      <label htmlFor="useBinaryEncoding" className="text-sm text-gray-700">
                        Use Binary encoding for RSS, enable this if characters are not displayed properly
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="useDescriptionField"
                        checked={useDescriptionField}
                        onCheckedChange={(checked) => setUseDescriptionField(checked === true)}
                      />
                      <label htmlFor="useDescriptionField" className="text-sm text-gray-700">
                        Use description field of rss stream instead of title field
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                /* Add Messages for the ticker - Only visible when RSS feed is disabled */
                <div className="space-y-2">
                  <label htmlFor="tickerMessages" className="text-sm font-medium text-gray-700">
                    Add Messages for the ticker
                  </label>
                  <textarea
                    id="tickerMessages"
                    value={tickerMessages}
                    onChange={(e) => setTickerMessages(e.target.value)}
                    placeholder="Enter messages here"
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              )}
            </>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="default"
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            SAVE
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
