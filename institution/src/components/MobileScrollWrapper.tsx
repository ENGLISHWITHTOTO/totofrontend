import React from 'react';

interface MobileScrollWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileScrollWrapper({ children, className = '' }: MobileScrollWrapperProps) {
  return (
    <div className={`overflow-x-auto -mx-4 md:mx-0 ${className}`}>
      <div className="inline-block min-w-full align-middle px-4 md:px-0">
        {children}
      </div>
    </div>
  );
}
