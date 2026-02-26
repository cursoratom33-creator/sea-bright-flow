import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  booked: 'bg-info/10 text-info',
  in_transit: 'bg-accent/10 text-accent',
  at_port: 'bg-warning/10 text-warning',
  customs: 'bg-accent/10 text-accent',
  arrived: 'bg-warning/10 text-warning',
  delivered: 'bg-success/10 text-success',
  cancelled: 'bg-destructive/10 text-destructive',
  open: 'bg-info/10 text-info',
  closed: 'bg-muted text-muted-foreground',
  shipped: 'bg-accent/10 text-accent',
  sent: 'bg-info/10 text-info',
  paid: 'bg-success/10 text-success',
  overdue: 'bg-destructive/10 text-destructive',
};

const statusLabels: Record<string, string> = {
  draft: 'Draft',
  booked: 'Booked',
  in_transit: 'In Transit',
  at_port: 'At Port',
  customs: 'Customs',
  arrived: 'Arrived',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  open: 'Open',
  closed: 'Closed',
  shipped: 'Shipped',
  sent: 'Sent',
  paid: 'Paid',
  overdue: 'Overdue',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        statusStyles[status] || 'bg-muted text-muted-foreground',
        className
      )}
    >
      {statusLabels[status] || status}
    </span>
  );
}
