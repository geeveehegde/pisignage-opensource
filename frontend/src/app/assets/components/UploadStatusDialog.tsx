'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

interface UploadStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  uploadProgress: number;
  uploadStatus: 'uploading' | 'complete' | 'error' | 'processing';
  uploadedFiles: Array<{ name: string; size: number; type: string; }>;
  onContinue: (categories: string[]) => void;
}

export default function UploadStatusDialog({
  open,
  onOpenChange,
  uploadProgress,
  uploadStatus,
  uploadedFiles,
  onContinue
}: UploadStatusDialogProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['new']);
  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = () => {
    if (newCategory.trim() && !selectedCategories.includes(newCategory.trim())) {
      setSelectedCategories([...selectedCategories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (category: string) => {
    setSelectedCategories(selectedCategories.filter(cat => cat !== category));
  };

  const handleContinue = () => {
    onContinue(selectedCategories);
    // Reset states
    setSelectedCategories(['new']);
    setNewCategory('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Status</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {uploadStatus === 'uploading' && (
            <div>
              <h3 className="text-lg font-medium mb-4">Uploading...</h3>
              <Progress value={uploadProgress} className="mb-2" />
              <p className="text-sm text-gray-600">{uploadProgress}% complete</p>
            </div>
          )}
          
          {uploadStatus === 'complete' && (
            <div>
              <h3 className="text-lg font-medium mb-4">Upload Complete</h3>
              
              <div className="mb-6">
                <h4 className="font-medium mb-2">Select Categories for the files</h4>
                
                {/* Category Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedCategories.map((category) => (
                    <div key={category} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                      <span>{category}</span>
                      {category !== 'new' && (
                        <button
                          onClick={() => handleRemoveCategory(category)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Add Category Input */}
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add new category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                    className="flex-1"
                  />
                  <Button onClick={handleAddCategory} size="sm" variant="outline">
                    +
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleContinue} variant="default">
                  Continue
                </Button>
              </div>
            </div>
          )}
          
          {uploadStatus === 'processing' && (
            <div>
              <h3 className="text-lg font-medium mb-4 text-yellow-700">Queued in for Processing Status</h3>
              <p className="text-sm text-gray-600 mb-4">If there is a need for conversion, it will take few minutes to appear in assets</p>
              <div className="flex justify-end">
                <Button onClick={() => onOpenChange(false)} variant="default">
                  OK
                </Button>
              </div>
            </div>
          )}
          
          {uploadStatus === 'error' && (
            <div>
              <h3 className="text-lg font-medium mb-4 text-red-600">Upload Failed</h3>
              <p className="text-sm text-gray-600 mb-4">There was an error uploading your files. Please try again.</p>
              <div className="flex justify-end">
                <Button onClick={() => onOpenChange(false)} variant="outline">
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
