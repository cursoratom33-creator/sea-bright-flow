import { useFormContext } from 'react-hook-form';
import { Container, AlertTriangle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import type { ConsolFormData } from '@/types/consol-form.types';
import { CONSOL_CONTAINER_TYPES, CONTAINER_CAPACITY } from '@/types/consol-form.types';

export default function ConsolStep3Container() {
  const { register, setValue, watch, formState: { errors } } = useFormContext<ConsolFormData>();
  const containerType = watch('containerType');
  const shipments = watch('shipments') || [];

  const capacity = containerType ? CONTAINER_CAPACITY[containerType] : null;
  const usedCbm = shipments.reduce((s, sh) => s + (sh.cbm || 0), 0);
  const usedWeight = shipments.reduce((s, sh) => s + (sh.grossWeight || 0), 0);
  const cbmPercent = capacity ? Math.min(100, (usedCbm / capacity.maxCbm) * 100) : 0;
  const weightPercent = capacity ? Math.min(100, (usedWeight / capacity.maxWeight) * 100) : 0;
  const isOverCbm = capacity ? usedCbm > capacity.maxCbm : false;
  const isOverWeight = capacity ? usedWeight > capacity.maxWeight : false;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="bg-primary/5 border-b border-border px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Container className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">Container Details</h3>
            <p className="text-[11px] text-muted-foreground">Container type and capacity</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Container Type <span className="text-destructive">*</span></Label>
            <Select value={containerType} onValueChange={(v) => setValue('containerType', v as any, { shouldValidate: true })}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                {CONSOL_CONTAINER_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.containerType && <p className="text-[11px] text-destructive">{errors.containerType.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Container Qty <span className="text-destructive">*</span></Label>
            <Input type="number" min={1} {...register('containerQuantity', { valueAsNumber: true })} />
            {errors.containerQuantity && <p className="text-[11px] text-destructive">{errors.containerQuantity.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Container Number</Label>
            <Input {...register('containerNumber')} placeholder="e.g. MSCU1234567" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Seal Number</Label>
            <Input {...register('sealNumber')} placeholder="Seal number" />
          </div>
        </div>

        {/* Capacity Info */}
        {capacity && (
          <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Container Utilization</span>
              <span className="text-[11px] text-muted-foreground">
                Max: {capacity.maxWeight.toLocaleString()} KG / {capacity.maxCbm} CBM
              </span>
            </div>

            {/* CBM Utilization */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Volume (CBM)</span>
                <span className={`font-semibold ${isOverCbm ? 'text-destructive' : 'text-foreground'}`}>
                  {usedCbm.toFixed(2)} / {capacity.maxCbm} CBM
                </span>
              </div>
              <Progress value={cbmPercent} className={`h-2.5 ${isOverCbm ? '[&>div]:bg-destructive' : '[&>div]:bg-accent'}`} />
              {isOverCbm && (
                <div className="flex items-center gap-1.5 text-destructive text-[11px]">
                  <AlertTriangle className="h-3 w-3" /> Container CBM capacity exceeded
                </div>
              )}
            </div>

            {/* Weight Utilization */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Weight (KG)</span>
                <span className={`font-semibold ${isOverWeight ? 'text-destructive' : 'text-foreground'}`}>
                  {usedWeight.toLocaleString()} / {capacity.maxWeight.toLocaleString()} KG
                </span>
              </div>
              <Progress value={weightPercent} className={`h-2.5 ${isOverWeight ? '[&>div]:bg-destructive' : '[&>div]:bg-accent'}`} />
              {isOverWeight && (
                <div className="flex items-center gap-1.5 text-destructive text-[11px]">
                  <AlertTriangle className="h-3 w-3" /> Container weight capacity exceeded
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
