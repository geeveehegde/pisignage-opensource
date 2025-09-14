'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { assetAPI } from '@/lib/api';

interface ValidityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: any;
  onSave: (asset: any, validityData: any) => void;
}

export default function ValidityDialog({ open, onOpenChange, asset, onSave }: ValidityDialogProps) {
  const [validityData, setValidityData] = useState({
    enable: true,
    startdate: undefined as Date | undefined,
    enddate: undefined as Date | undefined,
    starthour: 0,
    endhour: 24
  });

  // Update form data when asset changes (for editing existing validity)
  useEffect(() => {
    if (asset?.validity && asset.validity.enable) {
      setValidityData({
        enable: true,
        startdate: asset.validity.startdate ? new Date(asset.validity.startdate) : undefined,
        enddate: asset.validity.enddate ? new Date(asset.validity.enddate) : undefined,
        starthour: asset.validity.starthour || 0,
        endhour: asset.validity.endhour || 24
      });
    } else {
      setValidityData({
        enable: true,
        startdate: undefined,
        enddate: undefined,
        starthour: 0,
        endhour: 24
      });
    }
  }, [asset]);

  const handleSave = async () => {
    try {
      // Prepare the data to send - include all asset properties and override validity
      const dbdata = {
        ...asset,
        validity: {
          enable: validityData.enable,
          startdate: validityData.startdate ? validityData.startdate.toISOString() : null,
          starthour: validityData.starthour,
          enddate: validityData.enddate ? validityData.enddate.toISOString() : null,
          endhour: validityData.endhour
        }
      };

      // Make POST request to update validity
      const response = await assetAPI.updateFile(asset.name, { dbdata });

      if (response.success) {
        // Call the parent onSave callback
        onSave(asset, validityData);
        onOpenChange(false);
        
        // Reset form data
        setValidityData({
          enable: true,
          startdate: undefined,
          enddate: undefined,
          starthour: 0,
          endhour: 24
        });
      } else {
        throw new Error('Failed to update validity');
      }
    } catch (error) {
      console.error('Error updating validity:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset form data when closing
      setValidityData({
        enable: true,
        startdate: undefined,
        enddate: undefined,
        starthour: 0,
        endhour: 24
      });
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {asset?.validity && asset.validity.enable ? 'Edit' : 'Add'} validity period for the asset: {asset?.name}
          </DialogTitle>
          <DialogDescription>
            You can add validity period for an asset to be shown on the screen (for e.g. sale duration)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={validityData.enable}
              onCheckedChange={(checked) => setValidityData(prev => ({ ...prev, enable: checked as boolean }))}
            />
            <span className="text-sm text-gray-700">Add validity period</span>
          </div>

          {validityData.enable && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Valid from</label>
                <DatePicker
                  date={validityData.startdate}
                  onDateChange={(date) => setValidityData(prev => ({ ...prev, startdate: date }))}
                  placeholder="Select start date"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Till</label>
                <DatePicker
                  date={validityData.enddate}
                  onDateChange={(date) => setValidityData(prev => ({ ...prev, enddate: date }))}
                  placeholder="Select end date"
                />
              </div>

              {/* Show hour fields only when start and end dates are the same */}
              {validityData.startdate && validityData.enddate && 
               validityData.startdate.toDateString() === validityData.enddate.toDateString() && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Hour</label>
                    <Input
                      type="number"
                      min="0"
                      max="23"
                      value={validityData.starthour || 0}
                      onChange={(e) => setValidityData(prev => ({ ...prev, starthour: parseInt(e.target.value) || 0 }))}
                      placeholder="0-23"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Hour</label>
                    <Input
                      type="number"
                      min="0"
                      max="23"
                      value={validityData.endhour || 24}
                      onChange={(e) => setValidityData(prev => ({ ...prev, endhour: parseInt(e.target.value) || 24 }))}
                      placeholder="0-23"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {asset?.validity && asset.validity.enable ? 'UPDATE' : 'SAVE'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
