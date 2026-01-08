import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyles = "transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-spectrum-black disabled:opacity-50 disabled:cursor-not-allowed shadow-sm font-bold";
  
  const variants = {
    primary: "bg-spectrum-highlight hover:opacity-90 text-spectrum-black focus:ring-spectrum-highlight",
    secondary: "bg-spectrum-slate/30 hover:bg-spectrum-slate text-spectrum-highlight border border-spectrum-slate focus:ring-spectrum-sage",
    danger: "bg-red-800 hover:bg-red-700 text-white focus:ring-red-500",
  };

  // If className doesn't specify rounding or padding, provide defaults
  const shapeDefaults = !className.includes('rounded-') && !className.includes('px-') ? 'rounded-lg px-4 py-2' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${shapeDefaults} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-6 w-6 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : children}
    </button>
  );
};