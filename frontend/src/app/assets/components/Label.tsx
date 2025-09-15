'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { labelsAPI } from '@/lib/api';

interface LabelData {
  _id: string;
  name: string;
  createdAt: string;
  __v: number;
}

interface LabelProps {
  categories?: string[];
}

export default function Label({ categories }: LabelProps) {
  const [labels, setLabels] = useState<LabelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        setLoading(true);
        const response = await labelsAPI.getLabels();
        const labelsData = response.data || response || [];
        setLabels(Array.isArray(labelsData) ? labelsData : []);
      } catch (err: any) {
        console.error('Error fetching labels:', err);
        setError(err.response?.data?.message || 'Failed to fetch labels');
        // Fallback to categories prop if API fails
        if (categories) {
          setLabels(categories.map(name => ({ _id: name, name, createdAt: '', __v: 0 })));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLabels();
  }, [categories]);

  if (loading) {
    return (
      <div className="mt-6 text-center py-8 text-gray-500">
        Loading labels...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 text-center py-8 text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-3">
      {labels.map((label) => (
        <div
          key={label._id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
        >
          <span className="text-sm font-medium text-gray-900">{label.name}</span>
          <Badge variant="secondary" className="text-xs">
            Label
          </Badge>
        </div>
      ))}
      {labels.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No labels available
        </div>
      )}
    </div>
  );
}
