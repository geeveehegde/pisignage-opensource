'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface EmergencyMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EmergencyMessageDialog({ open, onOpenChange }: EmergencyMessageDialogProps) {
  // Emergency message state
  const [emergencyMessage, setEmergencyMessage] = useState('');
  const [emergencyMessageEnabled, setEmergencyMessageEnabled] = useState(true);
  const [emergencyVerticalPosition, setEmergencyVerticalPosition] = useState('middle');

  const handleSave = () => {
    console.log('Saving emergency message:', {
      enabled: emergencyMessageEnabled,
      message: emergencyMessage,
      verticalPosition: emergencyVerticalPosition
    });
    onOpenChange(false);
    setEmergencyMessage('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Display a text message in front of the Signage</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* Enable Message Checkbox */}
          <div className="flex items-center space-x-3">
            <Checkbox
              id="enableMessage"
              checked={emergencyMessageEnabled}
              onCheckedChange={(checked) => setEmergencyMessageEnabled(checked === true)}
            />
            <label htmlFor="enableMessage" className="text-sm font-medium text-gray-700">
              Enable Message
            </label>
          </div>

          {/* Vertical Position Radio Buttons - Only visible when enabled */}
          {emergencyMessageEnabled && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Vertical Position:</label>
              <RadioGroup
                value={emergencyVerticalPosition}
                onValueChange={setEmergencyVerticalPosition}
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="top" id="top" />
                  <label htmlFor="top" className="text-sm text-gray-700">Top</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="middle" id="middle" />
                  <label htmlFor="middle" className="text-sm text-gray-700">Middle</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bottom" id="bottom" />
                  <label htmlFor="bottom" className="text-sm text-gray-700">Bottom</label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Message Input - Only visible when enabled */}
          {emergencyMessageEnabled && (
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-gray-700">
                Message
              </label>
              <Input
                id="message"
                value={emergencyMessage}
                onChange={(e) => setEmergencyMessage(e.target.value)}
                placeholder="Enter the message to be displayed"
                className="w-full"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={handleSave}
            disabled={!emergencyMessageEnabled || !emergencyMessage.trim()}
          >
            SAVE
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
