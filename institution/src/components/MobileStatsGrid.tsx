import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LucideIcon } from 'lucide-react';

interface StatItem {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  color?: string;
}

interface MobileStatsGridProps {
  stats: StatItem[];
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
}

export function MobileStatsGrid({
  stats,
  columns = { mobile: 2, tablet: 2, desktop: 4 }
}: MobileStatsGridProps) {
  const getChangeColor = (type?: 'positive' | 'negative' | 'neutral') => {
    switch (type) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div
      className={`grid gap-3 md:gap-6`}
      style={{
        gridTemplateColumns: `repeat(${columns.mobile || 2}, minmax(0, 1fr))`,
      }}
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium line-clamp-1">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 flex-shrink-0 ${stat.color || 'text-muted-foreground'}`} />
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-xl md:text-2xl font-bold truncate">
                {stat.value}
              </div>
              {stat.change && (
                <p className="text-xs text-muted-foreground">
                  <span className={getChangeColor(stat.changeType)}>{stat.change}</span>
                  {' '}from last month
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
