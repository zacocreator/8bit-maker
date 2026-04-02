import React from 'react';

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'danger';
  children: React.ReactNode;
}

export const PixelButton: React.FC<PixelButtonProps> = ({ 
  variant = 'default', 
  children, 
  className = '', 
  ...props 
}) => {
  const variantClass = variant === 'primary' ? 'pixel-button-primary' : '';
  // Simple style-mapping for danger until we add more specific CSS for it
  const dangerStyle = variant === 'danger' ? { color: 'var(--color-tertiary)' } : {};

  return (
    <button 
      className={`pixel-button ${variantClass} ${className}`}
      style={dangerStyle}
      {...props}
    >
      {children}
    </button>
  );
};
