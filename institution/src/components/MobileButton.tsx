import React from 'react';
import { Button } from './ui/button';
import { LucideIcon } from 'lucide-react';

interface MobileButtonProps {
  icon?: LucideIcon;
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'link';
  onClick?: () => void;
  className?: string;
  fullWidth?: boolean;
  disabled?: boolean;
}

export function MobileButton({
  icon: Icon,
  children,
  variant = 'default',
  onClick,
  className = '',
  fullWidth = false,
  disabled = false
}: MobileButtonProps) {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      className={`
        h-auto py-2.5 px-4
        md:py-2 md:px-4
        ${fullWidth ? 'w-full' : ''}
        ${Icon ? 'justify-start' : ''}
        ${className}
      `}
    >
      {Icon && <Icon className="w-4 h-4 mr-2 flex-shrink-0" />}
      <span className="text-sm md:text-base">{children}</span>
    </Button>
  );
}
