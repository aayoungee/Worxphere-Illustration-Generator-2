import React, { useRef } from 'react';
import { BRAND_PRESETS, BrandPreset } from '../types';

interface ImageUploadProps {
  selectedPresets: string[];
  onPresetsChange: (ids: string[]) => void;
  customImages: string[];
  onCustomImagesChange: (images: string[]) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
  selectedPresets, 
  onPresetsChange,
  customImages,
  onCustomImagesChange 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const togglePreset = (id: string) => {
    if (selectedPresets.includes(id)) {
      onPresetsChange(selectedPresets.filter(p => p !== id));
    } else {
      onPresetsChange([...selectedPresets, id]);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const fileReaders: Promise<string>[] = [];

    Array.from(files).forEach((file) => {
      fileReaders.push(
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result && typeof e.target.result === 'string') {
              resolve(e.target.result);
            } else {
              reject(new Error('Failed to read file'));
            }
          };
          reader.onerror = () => reject(new Error('File reading error'));
          reader.readAsDataURL(file as Blob);
        })
      );
    });

    Promise.all(fileReaders)
      .then((newImages) => {
        onCustomImagesChange([...customImages, ...newImages]);
      })
      .catch((err) => {
        console.error('Error reading files', err);
      })
      .finally(() => {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      });
  };

  const removeCustom = (indexToRemove: number) => {
    onCustomImagesChange(customImages.filter((_, index) => index !== indexToRemove));
  };

  const renderPresetButton = (preset: BrandPreset) => {
    const isSelected = selectedPresets.includes(preset.id);
    return (
      <button
        key={preset.id}
        onClick={() => togglePreset(preset.id)}
        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 group ${
          isSelected 
            ? 'border-spectrum-highlight ring-1 ring-spectrum-highlight ring-offset-1 ring-offset-spectrum-black' 
            : 'border-spectrum-slate/30 opacity-60 hover:opacity-100'
        }`}
      >
        <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
        <div className={`absolute inset-0 bg-spectrum-highlight/10 pointer-events-none transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
        {isSelected && (
          <div className="absolute top-1 right-1 bg-spectrum-highlight text-spectrum-black rounded-full p-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-spectrum-black/60 backdrop-blur-[2px] py-1 px-2">
          <span className="text-[8px] font-bold text-white uppercase tracking-tighter truncate block">{preset.label}</span>
        </div>
      </button>
    );
  };

  const objectPresets = BRAND_PRESETS.filter(p => p.id.startsWith('Object'));
  const personPresets = BRAND_PRESETS.filter(p => p.id.startsWith('Person'));

  return (
    <div className="space-y-6">
      {/* Brand Presets Section */}
      <div className="space-y-2">
        <label className="block text-[10px] font-bold text-spectrum-sage uppercase tracking-widest mb-1">
          Worxphere Illust Presets
        </label>
        
        {/* Person Area (Top) */}
        <div className="grid grid-cols-2 gap-2">
          {personPresets.map(renderPresetButton)}
        </div>

        {/* Object Area (Bottom) */}
        <div className="grid grid-cols-2 gap-2">
          {objectPresets.map(renderPresetButton)}
        </div>
      </div>

      {/* Custom Uploads Section */}
      <div>
        <label className="block text-[10px] font-bold text-spectrum-sage uppercase tracking-widest mb-3">
          More Samples
        </label>
        <div className="grid grid-cols-2 gap-2">
          {customImages.map((img, index) => (
            <div key={index} className="relative aspect-square border border-spectrum-slate/50 rounded-lg overflow-hidden group bg-spectrum-black">
              <img src={img} alt={`Custom ${index + 1}`} className="w-full h-full object-cover" />
              <button 
                onClick={() => removeCustom(index)}
                className="absolute top-1 right-1 bg-spectrum-black/90 hover:bg-red-800 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
          
          {customImages.length < 2 && (
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square border-2 border-dashed border-spectrum-slate/30 rounded-lg cursor-pointer hover:border-spectrum-highlight hover:bg-spectrum-highlight/5 transition-all flex flex-col items-center justify-center text-center group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-spectrum-sage group-hover:text-spectrum-highlight mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-[9px] text-spectrum-sage group-hover:text-spectrum-highlight font-bold uppercase">Upload</span>
            </button>
          )}
        </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        multiple
        className="hidden" 
      />
    </div>
  );
};