import React from 'react';

interface HeaderProps {
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-spectrum-slate/30 bg-spectrum-black sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-bold text-white tracking-tight">
          Illustration <span className="text-spectrum-highlight">generator</span>
        </h1>
        <span className="px-2 py-0.5 rounded-full bg-spectrum-slate text-[10px] text-white border border-spectrum-sage">Beta</span>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={onOpenSettings}
          className="p-2 rounded-full hover:bg-spectrum-slate/20 text-spectrum-sage hover:text-spectrum-highlight transition-all"
          title="API Settings"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-spectrum-highlight/5 border border-spectrum-highlight/10 text-spectrum-highlight text-[10px] font-bold uppercase tracking-widest hidden sm:flex">
          <span className="w-1.5 h-1.5 rounded-full bg-spectrum-highlight"></span>
          Worxphere Ver .1.0
        </div>
      </div>
    </header>
  );
};
