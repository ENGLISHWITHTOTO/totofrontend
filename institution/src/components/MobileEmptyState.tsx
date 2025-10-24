import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './ui/button';

interface MobileEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function MobileEmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction
}: MobileEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-16 px-4 text-center">
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-muted flex items-center justify-center mb-4 md:mb-6">
        <Icon className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg md:text-xl font-medium mb-2">{title}</h3>
      <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8 max-w-sm">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="min-h-[44px]">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
