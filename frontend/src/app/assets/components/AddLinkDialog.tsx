'use client';

import { useState, useEffect } from 'react';
import type { AddLinkDialogProps } from '../lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';



export default function AddLinkDialog({
  open,
  onOpenChange,
  onSave,
  preselectedFileType
}: AddLinkDialogProps) {
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('Livestreaming or YouTube');
  const [linkAddress, setLinkAddress] = useState('');
  const [fileNameError, setFileNameError] = useState(false);

  // Set preselected file type when dialog opens
  useEffect(() => {
    if (preselectedFileType) {
      setFileType(preselectedFileType);
    } else {
      setFileType('Livestreaming or YouTube');
    }
  }, [preselectedFileType, open]);

  const handleSave = () => {
    // Validate required fields
    if (!fileName.trim()) {
      setFileNameError(true);
      return;
    }

    // Call the onSave callback with the form data
    onSave({
      fileName: fileName.trim(),
      fileType,
      linkAddress: linkAddress.trim()
    });

    // Reset form
    setFileName('');
    setFileType('Livestreaming or YouTube');
    setLinkAddress('');
    setFileNameError(false);
  };

  const handleFileNameChange = (value: string) => {
    setFileName(value);
    if (fileNameError && value.trim()) {
      setFileNameError(false);
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setFileName('');
    setFileType('Livestreaming or YouTube');
    setLinkAddress('');
    setFileNameError(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium">Stream From Internet</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* File Name Field */}
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium w-24">File Name</label>
              <div className="flex-1 relative">
                <Input
                  placeholder="Data will be saved in this file"
                  value={fileName}
                  onChange={(e) => handleFileNameChange(e.target.value)}
                  className={`${fileNameError ? 'border-red-500' : ''}`}
                />
                {fileNameError && (
                  <div className="absolute -top-8 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg">
                    Please fill in this field.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* File Type Field */}
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium w-24">File Type</label>
              <div className="flex-1">
                <Select value={fileType} onValueChange={setFileType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Livestreaming or YouTube">Livestreaming or YouTube</SelectItem>
                    <SelectItem value="Streaming">Streaming</SelectItem>
                    <SelectItem value="Audio Streaming">Audio Streaming</SelectItem>
                    <SelectItem value="Web link (shown in iframe)">Web link (shown in iframe)</SelectItem>
                    <SelectItem value="Web page (supports cross origin links)">Web page (supports cross origin links)</SelectItem>
                    <SelectItem value="Media RSS">Media RSS</SelectItem>
                    <SelectItem value="Message">Message</SelectItem>
                    <SelectItem value="Local Folder/File">Local Folder/File</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Link Address Field */}
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium w-24">Link Address</label>
              <div className="flex-1">
                <Input
                  placeholder="e.g. http(s)://site.com or rtsp://"
                  value={linkAddress}
                  onChange={(e) => setLinkAddress(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button onClick={handleSave} variant="default">
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
