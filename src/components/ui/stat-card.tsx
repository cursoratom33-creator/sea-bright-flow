import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: ReactNode;
  variant?: 1 | 2 | 3 | 4 | 5 | 6;
}

export function StatCard({ title, value, change, changeLabel = 'vs last month', icon, variant = 1 }: StatCardProps) {
  const gradientClass = `kpi-gradient-${Math.min(variant, 4)}` as const;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
          {change !== undefined && (
            <p
              className={cn(
                'text-xs font-medium',
                change >= 0 ? 'text-success' : 'text-destructive'
              )}
            >
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
              <span className="ml-1 text-muted-foreground font-normal">{changeLabel}</span>
            </p>
          )}
        </div>
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg text-primary-foreground',
            gradientClass
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
