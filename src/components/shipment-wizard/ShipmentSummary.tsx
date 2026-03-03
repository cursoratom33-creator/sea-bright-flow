import { useFormContext } from 'react-hook-form';
import { Ship, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { WIZARD_STEPS, type ShipmentFormData } from '@/types/shipment-form.types';

interface Props {
  currentStep: number;
}

export default function ShipmentSummary({ currentStep }: Props) {
  const { watch, formState: { errors } } = useFormContext<ShipmentFormData>();
  const data = watch();
  const charges = data.charges || [];
  const totalCharges = charges.reduce((sum, c) => sum + (c.amount || 0), 0);

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Ship className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Shipment Summary</h3>
      </div>

      {/* Type badge */}
      {data.shipmentType && (
        <div className="flex items-center gap-2">
          <span className="rounded bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
            {data.shipmentType}
          </span>
          {data.incoterm && (
            <span className="rounded bg-accent/10 px-2 py-1 text-xs font-medium text-accent">
              {data.incoterm}
            </span>
          )}
        </div>
      )}

      {/* Route */}
      {(data.portOfLoading || data.portOfDischarge) && (
        <div className="text-sm">
          <span className="font-medium text-foreground">{data.portOfLoading || '—'}</span>
          <span className="mx-2 text-accent">→</span>
          <span className="font-medium text-foreground">{data.portOfDischarge || '—'}</span>
        </div>
      )}

      {/* Key info */}
      <div className="space-y-1.5 text-sm">
        {data.shipperName && <InfoRow label="Shipper" value={data.shipperName} />}
        {data.consigneeName && <InfoRow label="Consignee" value={data.consigneeName} />}
        {data.carrier && <InfoRow label="Carrier" value={data.carrier} />}
        {data.etd && <InfoRow label="ETD" value={data.etd} />}
        {data.eta && <InfoRow label="ETA" value={data.eta} />}
      </div>

      {/* Charges */}
      {charges.length > 0 && (
        <div className="border-t border-border pt-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Charges</span>
            <span className="font-bold text-foreground">{formatCurrency(totalCharges, data.currency)}</span>
          </div>
        </div>
      )}

      {/* Step checklist */}
      <div className="border-t border-border pt-3 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Steps</p>
        {WIZARD_STEPS.map((step) => {
          const isActive = step.id === currentStep;
          const isDone = step.id < currentStep;
          return (
            <div key={step.id} className={cn('flex items-center gap-2 text-sm', isActive && 'font-medium')}>
              {isDone ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
              ) : isActive ? (
                <AlertCircle className="h-3.5 w-3.5 text-primary" />
              ) : (
                <Circle className="h-3.5 w-3.5 text-muted-foreground/40" />
              )}
              <span className={cn(isDone ? 'text-accent' : isActive ? 'text-foreground' : 'text-muted-foreground')}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground truncate ml-2 max-w-[140px]">{value}</span>
    </div>
  );
}
