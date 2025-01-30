import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 z-99 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg font-medium text-gray-900 dark:text-white">
          Processing your request...
        </p>
      </div>
    </div>
  );
};

export default LoadingOverlay;