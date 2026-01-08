import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => (
  <div className="flex flex-col">
    <label className="block text-xs font-semibold text-spectrum-sage uppercase tracking-wider mb-2">
      {label}
    </label>
    <input
      className={`w-full bg-spectrum-black border border-spectrum-slate text-slate-100 rounded px-3 py-2 focus:outline-none focus:border-spectrum-highlight focus:ring-1 focus:ring-spectrum-highlight transition-colors ${className}`}
      {...props}
    />
  </div>
);

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, className = '', ...props }) => (
  <div className="flex flex-col h-full">
    <label className="block text-xs font-semibold text-spectrum-sage uppercase tracking-wider mb-2">
      {label}
    </label>
    <textarea
      className={`w-full bg-spectrum-black border border-spectrum-slate text-slate-100 rounded px-3 py-2 focus:outline-none focus:border-spectrum-highlight focus:ring-1 focus:ring-spectrum-highlight transition-colors resize-none ${className}`}
      {...props}
    />
  </div>
);