import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MobileSectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}

export function MobileSectionHeader({
  title,
  subtitle,
  icon: Icon,
  action
}: MobileSectionHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-4 md:mb-6">
      <div className="flex items-start gap-3 min-w-0 flex-1">
        {Icon && (
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h2 className="text-xl md:text-2xl font-medium truncate">{title}</h2>
          {subtitle && (
            <p className="text-sm md:text-base text-muted-foreground mt-1 line-clamp-2">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
