import React from 'react';
import { Compass } from 'lucide-react';

const LoadingSpinner = ({ text = 'Curating your luxury experience...', fullPage = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 gap-4">
      <div className="relative">
        <Compass className="w-12 h-12 text-gold animate-spin stroke-[1.5]" style={{ animationDuration: '4s' }} />
        <div className="absolute inset-0 rounded-full border-2 border-gold/20 border-t-gold animate-spin" />
      </div>
      <p className="text-sm tracking-wider uppercase text-gold font-medium animate-pulse">
        {text}
      </p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/90 backdrop-blur-md">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
