import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { X, Square, Maximize2 } from 'lucide-react';

interface CropPreset {
  name: string;
  aspect: number | undefined;
  icon: React.ReactNode;
  label: string;
}

const CROP_PRESETS: CropPreset[] = [
  { 
    name: 'square', 
    aspect: 1, 
    icon: <Square className="h-4 w-4" />, 
    label: '1:1 Square'
  },
  { 
    name: 'free', 
    aspect: undefined, 
    icon: <Maximize2 className="h-4 w-4" />, 
    label: 'Free Form'
  }
];

interface ImageCropModalProps {
  imageUrl: string;
  aspect?: number;
  onCropComplete: (croppedBlob: Blob) => void;
  onCancel: () => void;
}

const ImageCropModal: React.FC<ImageCropModalProps> = ({
  imageUrl,
  aspect: initialAspect,
  onCropComplete,
  onCancel,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('square');
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  // Load image and set initial crop
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const preset = CROP_PRESETS.find(p => p.name === selectedPreset);
    const newCrop = centerAspectCrop(width, height, preset?.aspect || 1);
    setCrop(newCrop);
    imgRef.current = e.currentTarget;

    // Set initial completed crop
    setCompletedCrop({
      unit: 'px',
      width: (width * newCrop.width) / 100,
      height: (height * newCrop.height) / 100,
      x: (width * newCrop.x) / 100,
      y: (height * newCrop.y) / 100,
    });
  };

  function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number,
  ) {
    let height = mediaHeight;
    let width = mediaWidth;

    if (aspect) {
      height = Math.min(mediaHeight, mediaWidth / aspect);
      width = height * aspect;
    }

    return {
      unit: '%' as const,
      width: (width / mediaWidth) * 100,
      height: (height / mediaHeight) * 100,
      x: ((mediaWidth - width) / 2 / mediaWidth) * 100,
      y: ((mediaHeight - height) / 2 / mediaHeight) * 100,
    };
  }

  const handlePresetChange = (presetName: string) => {
    setSelectedPreset(presetName);
    const preset = CROP_PRESETS.find(p => p.name === presetName);
    
    if (imgRef.current && preset) {
      const { width, height } = imgRef.current;
      if (preset.aspect) {
        const newCrop = centerAspectCrop(width, height, preset.aspect);
        setCrop(newCrop);
      }
    }
  };

  const cropImage = async () => {
    try {
      if (!completedCrop || !imgRef.current) {
        console.error('Missing completed crop or image reference');
        return;
      }

      const image = imgRef.current;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        console.error('No 2d context');
        return;
      }

      // Calculate proper scaling
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      // Set canvas dimensions
      canvas.width = Math.floor(completedCrop.width * scaleX);
      canvas.height = Math.floor(completedCrop.height * scaleY);

      // Draw the cropped image
      ctx.drawImage(
        image,
        Math.floor(completedCrop.x * scaleX),
        Math.floor(completedCrop.y * scaleY),
        Math.floor(completedCrop.width * scaleX),
        Math.floor(completedCrop.height * scaleY),
        0,
        0,
        Math.floor(completedCrop.width * scaleX),
        Math.floor(completedCrop.height * scaleY)
      );

      // Return promise to handle the blob conversion
      return new Promise<void>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              onCropComplete(blob);
              resolve();
            } else {
              reject(new Error('Canvas to Blob conversion failed'));
            }
          },
          'image/jpeg',
          1
        );
      });
    } catch (error) {
      console.error('Error during crop:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-4xl rounded-lg bg-white p-6 dark:bg-gray-800">
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <h2 className="mb-4 text-xl font-semibold dark:text-white">Crop Image</h2>
        
        <div className="mb-4 flex space-x-2">
          {CROP_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handlePresetChange(preset.name)}
              className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm ${
                selectedPreset === preset.name
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200'
              }`}
            >
              {preset.icon}
              <span>{preset.label}</span>
            </button>
          ))}
        </div>

        <div className="max-h-[60vh] overflow-auto">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={CROP_PRESETS.find(p => p.name === selectedPreset)?.aspect}
          >
            <img
              ref={imgRef}
              src={imageUrl}
              alt="Crop me"
              onLoad={onImageLoad}
              className="max-h-[60vh] w-auto"
            />
          </ReactCrop>
        </div>
        
        <canvas
          ref={previewCanvasRef}
          style={{ display: 'none' }}
        />
        
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={cropImage}
            disabled={!completedCrop}
            className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            Apply Crop
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;