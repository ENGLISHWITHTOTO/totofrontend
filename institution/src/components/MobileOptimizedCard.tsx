import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface MobileOptimizedCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  action?: React.ReactNode;
}

export function MobileOptimizedCard({
  title,
  children,
  className = '',
  headerClassName = '',
  contentClassName = '',
  action
}: MobileOptimizedCardProps) {
  return (
    <Card className={className}>
      {title && (
        <CardHeader className={`pb-3 md:pb-4 ${headerClassName}`}>
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-base md:text-lg truncate">{title}</CardTitle>
            {action && <div className="flex-shrink-0">{action}</div>}
          </div>
        </CardHeader>
      )}
      <CardContent className={`space-y-3 md:space-y-4 ${contentClassName}`}>
        {children}
      </CardContent>
    </Card>
  );
}
