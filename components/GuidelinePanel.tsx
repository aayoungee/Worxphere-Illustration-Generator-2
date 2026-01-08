import React from 'react';
import { FIXED_BRAND_GUIDELINES } from '../types';

export const GuidelinePanel: React.FC = () => {
  return (
    <div className="bg-spectrum-black border-r border-spectrum-slate/30 h-full overflow-y-auto p-6 w-full md:w-80 lg:w-96 flex-shrink-0">
      <div className="flex items-center gap-3 mb-8">
        {/* Logo Circle: Updated to #FAFFDC with diamond removed */}
        <div className="bg-spectrum-highlight w-12 h-12 rounded-full flex items-center justify-center shadow-lg shadow-black/40 shrink-0">
          {/* Inner diamond removed as per user request */}
        </div>
        <div>
          <h2 className="text-lg font-bold text-white leading-tight">Worxphere</h2>
          <p className="text-[10px] text-spectrum-highlight font-bold uppercase tracking-widest">Ver .1.0</p>
        </div>
      </div>
      
      <div className="space-y-6">
        <section>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-spectrum-beige/80 leading-relaxed font-medium">
                Create various work-related experiences, situations, and objects.
              </p>
            </div>
            {/* Palette section removed as per user request to hide in preview */}
          </div>
        </section>

        <div className="border-t border-spectrum-slate/30"></div>

        <section>
          <h3 className="text-xs font-bold text-spectrum-sage uppercase tracking-widest mb-3">Prompt Example</h3>
          <div className="space-y-4">
            <div className="bg-spectrum-slate/20 border border-spectrum-slate/30 p-4 rounded-xl">
              <p className="text-[10px] text-spectrum-highlight font-bold uppercase mb-3 tracking-wider">Person</p>
              <ul className="text-xs text-spectrum-beige/70 space-y-2 list-none font-medium">
                <li className="flex gap-2">
                  <span className="text-spectrum-highlight">•</span>
                  이력서 파도를 타고 있는 사람
                </li>
                <li className="flex gap-2">
                  <span className="text-spectrum-highlight">•</span>
                  시계 바늘 위에서 쉬고 있는 사람
                </li>
                <li className="flex gap-2">
                  <span className="text-spectrum-highlight">•</span>
                  연필 위에 앉아 있는 사람
                </li>
                <li className="flex gap-2">
                  <span className="text-spectrum-highlight">•</span>
                  키보드 위에서 춤추고 있는 사람
                </li>
              </ul>
            </div>
            
            <div className="bg-spectrum-slate/20 border border-spectrum-slate/30 p-4 rounded-xl">
              <p className="text-[10px] text-spectrum-highlight font-bold uppercase mb-3 tracking-wider">Object</p>
              <ul className="text-xs text-spectrum-beige/70 space-y-2 list-none font-medium">
                <li className="flex gap-2">
                  <span className="text-spectrum-highlight">•</span>
                  이력서로 만들어진 종이비행기
                </li>
                <li className="flex gap-2">
                  <span className="text-spectrum-highlight">•</span>
                  띠가 둘러진 지구본
                </li>
                <li className="flex gap-2">
                  <span className="text-spectrum-highlight">•</span>
                  손목 시계 화면
                </li>
                <li className="flex gap-2">
                  <span className="text-spectrum-highlight">•</span>
                  날아다니는 이력서 뭉치
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};