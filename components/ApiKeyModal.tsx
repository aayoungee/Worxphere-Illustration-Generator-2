import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { GoogleGenAI } from "@google/genai";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onKeySaved }) => {
  const [manualKey, setManualKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);

  // 로컬 스토리지에서 기존 수동 키 로드
  useEffect(() => {
    const savedKey = localStorage.getItem('worxphere_manual_key');
    if (savedKey) setManualKey(savedKey);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConnectAiStudio = async () => {
    try {
      if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
        await window.aistudio.openSelectKey();
        onKeySaved(""); // 상위 컴포넌트에 환경 변수 키 사용 신호 전달
        onClose();
      } else {
        window.open('https://aistudio.google.com/app/apikey', '_blank');
      }
    } catch (error) {
      console.error("Native selection failed:", error);
    }
  };

  const handleSaveManualKey = async () => {
    if (!manualKey.trim()) return;
    
    setIsTesting(true);
    setTestError(null);

    try {
      // 키 유효성 즉시 검증
      const testAi = new GoogleGenAI({ apiKey: manualKey });
      const response = await testAi.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: 'test'
      });
      
      if (response.text) {
        localStorage.setItem('worxphere_manual_key', manualKey);
        onKeySaved(manualKey);
        onClose();
      }
    } catch (err: any) {
      setTestError("유효하지 않은 API Key입니다. 다시 확인해주세요.");
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
      <div className="bg-spectrum-black border border-spectrum-slate/40 w-full max-w-md rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-white tracking-tight">Gemini API Setup</h2>
          <button onClick={onClose} className="text-spectrum-sage hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-8">
          {/* Method 1: Native Selector */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-spectrum-highlight/10 text-spectrum-highlight text-[10px] font-bold uppercase">방법 1</span>
              <h3 className="text-sm font-bold text-slate-300">구글 계정으로 연결</h3>
            </div>
            <Button 
              onClick={handleConnectAiStudio}
              className="w-full py-4 rounded-xl shadow-lg"
              variant="primary"
            >
              Get / Select Key via AI Studio
            </Button>
            <p className="text-[11px] text-spectrum-sage leading-relaxed">
              Google AI Studio의 공식 창을 통해 가장 빠르고 안전하게 키를 선택할 수 있습니다.
            </p>
          </section>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-spectrum-slate/20"></div></div>
            <span className="relative bg-spectrum-black px-4 text-[10px] text-spectrum-sage font-bold uppercase tracking-widest">OR</span>
          </div>

          {/* Method 2: Manual Input */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-spectrum-slate/30 text-spectrum-beige text-[10px] font-bold uppercase">방법 2</span>
              <h3 className="text-sm font-bold text-slate-300">직접 입력</h3>
            </div>
            <div className="space-y-3">
              <Input 
                label="API KEY"
                type="password"
                placeholder="AIzaSy..."
                value={manualKey}
                onChange={(e) => setManualKey(e.target.value)}
                className="bg-black/50"
              />
              {testError && <p className="text-[10px] text-red-400 font-medium">{testError}</p>}
              <Button 
                onClick={handleSaveManualKey}
                isLoading={isTesting}
                disabled={!manualKey.trim()}
                className="w-full py-3"
                variant="secondary"
              >
                Verify & Save Key
              </Button>
            </div>
          </section>

          <p className="text-[10px] text-center text-spectrum-sage/60 border-t border-spectrum-slate/20 pt-6">
            API 사용을 위해 <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline hover:text-spectrum-highlight">결제 계정</a>이 활성화되어 있어야 할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
};