import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { GuidelinePanel } from './components/GuidelinePanel';
import { Button } from './components/Button';
import { TextArea } from './components/Input';
import { ImageUpload } from './components/ImageUpload';
import { ApiKeyModal } from './components/ApiKeyModal';
import { FIXED_BRAND_GUIDELINES, GeneratedImage, BRAND_PRESETS } from './types';
import { generateBrandIllustration } from './services/geminiService';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [selectedPresets, setSelectedPresets] = useState<string[]>([]);
  const [customImages, setCustomImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const [apiKey, setApiKey] = useState<string>("");
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // 초기 로드 시 키 확인
  useEffect(() => {
    const initKey = async () => {
      // 1. 수동 저장된 키 확인
      const savedKey = localStorage.getItem('worxphere_manual_key');
      if (savedKey) {
        setApiKey(savedKey);
        return;
      }

      // 2. AI Studio 네이티브 키 확인
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (hasKey) {
          setApiKey(""); // 시스템 키 사용
          return;
        }
      }

      // 3. 둘 다 없으면 설정창 오픈
      setIsSettingsOpen(true);
    };
    initKey();
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    
    // 최종 가용한 키 결정
    const envKey =
  (import.meta as any)?.env?.VITE_API_KEY;

let finalKey = apiKey || envKey;


    // 만약 현재 메모리에 키가 없고, 네이티브 환경에서도 키가 설정되지 않았다면 모달 오픈
    if (!finalKey) {
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          setIsSettingsOpen(true);
          return;
        }
        finalKey = envKey;
      } else {
        setIsSettingsOpen(true);
        return;
      }
    }

    setIsGenerating(true);
    setError(null);

    const activePresetUrls = BRAND_PRESETS
      .filter(p => selectedPresets.includes(p.id))
      .map(p => p.url);
    
    const allReferences = [...activePresetUrls, ...customImages];

    try {
      const base64Image = await generateBrandIllustration(
        prompt, 
        FIXED_BRAND_GUIDELINES, 
        allReferences, 
        finalKey || ""
      );
      
      const newImage: GeneratedImage = {
        id: crypto.randomUUID(),
        url: base64Image,
        prompt: prompt,
        timestamp: Date.now(),
      };

      setGeneratedImages(prev => [newImage, ...prev]);
      setPrompt(""); 
    } catch (err: any) {
      if (err.message?.includes("Requested entity was not found")) {
        setError("API Key가 유효하지 않거나 만료되었습니다. 다시 설정해주세요.");
        setIsSettingsOpen(true);
      } else {
        setError(err.message || "생성 중 오류가 발생했습니다.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handleDownload = (imageUrl: string, id: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `worxphere-${id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex h-screen bg-spectrum-black text-slate-100 overflow-hidden font-sans">
      <GuidelinePanel />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenSettings={() => setIsSettingsOpen(true)} />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-spectrum-black">
          <div className="max-w-5xl mx-auto space-y-8">
            
            <div className="bg-spectrum-slate/10 border border-spectrum-slate/30 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
              <h2 className="text-xl font-bold text-white mb-8">Create New Work Experiences</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col gap-8">
                  <div className="flex-1 min-h-[160px]">
                    <TextArea
                      label="What should I draw?"
                      placeholder="e.g. 이력서 파도를 타고 있는 사람"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="text-lg bg-spectrum-black/60 h-full"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-4">
                    <Button 
                      onClick={handleGenerate} 
                      disabled={!prompt.trim() || isGenerating}
                      isLoading={isGenerating}
                      className="w-24 h-24 rounded-full text-sm shadow-xl shadow-black/20 flex-shrink-0 hover:scale-105 active:scale-95 transition-transform"
                    >
                      Generate
                    </Button>
                  </div>
                </div>

                <div className="bg-spectrum-black/40 p-6 rounded-xl border border-spectrum-slate/30 flex flex-col min-h-[300px]">
                  <h3 className="text-xs font-bold text-spectrum-sage uppercase tracking-widest mb-4">Style Anchors</h3>
                  <div className="flex-1 overflow-y-auto pr-1">
                    <ImageUpload 
                      selectedPresets={selectedPresets}
                      onPresetsChange={setSelectedPresets}
                      customImages={customImages}
                      onCustomImagesChange={setCustomImages}
                    />
                  </div>
                </div>
              </div>
              
              {error && (
                <div className="mt-8 text-red-400 text-sm bg-red-900/10 p-4 rounded-xl border border-red-900/30">
                  {error}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-6">Asset Gallery</h3>
              
              {generatedImages.length === 0 ? (
                <div className="bg-spectrum-slate/5 border-2 border-dashed border-spectrum-slate/20 rounded-2xl py-24 text-center">
                  <p className="text-spectrum-sage">Your generated brand assets will appear here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                  {generatedImages.map((img) => (
                    <div key={img.id} className="group bg-spectrum-slate/10 border border-spectrum-slate/30 rounded-2xl overflow-hidden shadow-xl hover:border-spectrum-highlight/30 transition-all duration-300">
                      <div className="aspect-square bg-white relative overflow-hidden">
                        <img 
                          src={img.url} 
                          alt={img.prompt} 
                          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-spectrum-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                           <Button 
                             variant="primary" 
                             onClick={() => handleDownload(img.url, img.id)}
                             className="w-20 h-20 rounded-full flex-col p-0 shadow-2xl hover:scale-110 active:scale-90 transition-transform"
                           >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                             </svg>
                             <span className="text-[9px] font-bold uppercase tracking-tighter">PNG</span>
                           </Button>
                        </div>
                      </div>
                      <div className="p-5">
                        <p className="text-sm text-spectrum-beige font-medium leading-relaxed line-clamp-2">
                          {img.prompt}
                        </p>
                        <p className="mt-3 text-[10px] text-spectrum-sage uppercase tracking-widest font-bold">
                          {new Date(img.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <ApiKeyModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        onKeySaved={(key) => setApiKey(key)} 
      />
    </div>
  );
};

export default App;