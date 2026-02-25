import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: ReactNode;
  variant?: 1 | 2 | 3 | 4;
}

export function KPICard({ title, value, change, icon, variant = 1 }: KPICardProps) {
  const gradientClass = `kpi-gradient-${variant}` as const;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
          {change !== undefined && (
            <p
              className={cn(
                'text-sm font-medium',
                change >= 0 ? 'text-success' : 'text-destructive'
              )}
            >
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
              <span className="ml-1 text-muted-foreground font-normal">vs last month</span>
            </p>
          )}
        </div>
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl text-primary-foreground',
            gradientClass
          )}
        >
          {icon}
        </div>
      </div>
      {/* Decorative accent */}
      <div
        className={cn(
          'absolute bottom-0 left-0 h-1 w-full opacity-80',
          gradientClass
        )}
      />
    </div>
  );
}
