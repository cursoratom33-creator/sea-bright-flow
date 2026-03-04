import { useFormContext, useFieldArray } from 'react-hook-form';
import { Container, AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import type { ConsolFormData } from '@/types/consol-form.types';
import { CONSOL_CONTAINER_TYPES, CONTAINER_CAPACITY } from '@/types/consol-form.types';

export default function ConsolStep3Container() {
  const { register, setValue, watch, control, formState: { errors } } = useFormContext<ConsolFormData>();
  const { fields, append, remove } = useFieldArray({ control, name: 'containers' });
  const containers = watch('containers') || [];
  const shipments = watch('shipments') || [];

  const totalCbm = shipments.reduce((s, sh) => s + (sh.cbm || 0), 0);
  const totalWeight = shipments.reduce((s, sh) => s + (sh.grossWeight || 0), 0);

  // Aggregate capacity across all containers
  const totalCapacity = containers.reduce(
    (acc, c) => {
      const cap = c.containerType ? CONTAINER_CAPACITY[c.containerType] : null;
      if (cap) {
        acc.maxCbm += cap.maxCbm;
        acc.maxWeight += cap.maxWeight;
      }
      return acc;
    },
    { maxCbm: 0, maxWeight: 0 }
  );

  const hasCapacity = totalCapacity.maxCbm > 0;
  const cbmPercent = hasCapacity ? Math.min(100, (totalCbm / totalCapacity.maxCbm) * 100) : 0;
  const weightPercent = hasCapacity ? Math.min(100, (totalWeight / totalCapacity.maxWeight) * 100) : 0;
  const isOverCbm = hasCapacity && totalCbm > totalCapacity.maxCbm;
  const isOverWeight = hasCapacity && totalWeight > totalCapacity.maxWeight;

  const addContainer = () => {
    append({ id: crypto.randomUUID(), containerType: '20GP', containerNumber: '', sealNumber: '' });
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="bg-primary/5 border-b border-border px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Container className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">Container Details</h3>
              <p className="text-[11px] text-muted-foreground">{containers.length} container{containers.length !== 1 ? 's' : ''} added</p>
            </div>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addContainer}>
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Container
          </Button>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {fields.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No containers added. Click "Add Container" to begin.
          </div>
        )}

        {fields.map((field, index) => (
          <div key={field.id} className="rounded-lg border border-border bg-muted/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-foreground">Container #{index + 1}</span>
              <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => remove(index)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Container Type <span className="text-destructive">*</span></Label>
                <Select
                  value={containers[index]?.containerType || ''}
                  onValueChange={(v) => setValue(`containers.${index}.containerType` as any, v as any, { shouldValidate: true })}
                >
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {CONSOL_CONTAINER_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.containers?.[index]?.containerType && (
                  <p className="text-[11px] text-destructive">{errors.containers[index]?.containerType?.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Container Number</Label>
                <Input {...register(`containers.${index}.containerNumber`)} placeholder="e.g. MSCU1234567" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Seal Number</Label>
                <Input {...register(`containers.${index}.sealNumber`)} placeholder="Seal number" />
              </div>
            </div>
          </div>
        ))}

        {/* Aggregate Capacity Info */}
        {hasCapacity && (
          <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Container Utilization</span>
              <span className="text-[11px] text-muted-foreground">
                Max: {totalCapacity.maxWeight.toLocaleString()} KG / {totalCapacity.maxCbm} CBM
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Volume (CBM)</span>
                <span className={`font-semibold ${isOverCbm ? 'text-destructive' : 'text-foreground'}`}>
                  {totalCbm.toFixed(2)} / {totalCapacity.maxCbm} CBM
                </span>
              </div>
              <Progress value={cbmPercent} className={`h-2.5 ${isOverCbm ? '[&>div]:bg-destructive' : '[&>div]:bg-accent'}`} />
              {isOverCbm && (
                <div className="flex items-center gap-1.5 text-destructive text-[11px]">
                  <AlertTriangle className="h-3 w-3" /> Total CBM capacity exceeded
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Weight (KG)</span>
                <span className={`font-semibold ${isOverWeight ? 'text-destructive' : 'text-foreground'}`}>
                  {totalWeight.toLocaleString()} / {totalCapacity.maxWeight.toLocaleString()} KG
                </span>
              </div>
              <Progress value={weightPercent} className={`h-2.5 ${isOverWeight ? '[&>div]:bg-destructive' : '[&>div]:bg-accent'}`} />
              {isOverWeight && (
                <div className="flex items-center gap-1.5 text-destructive text-[11px]">
                  <AlertTriangle className="h-3 w-3" /> Total weight capacity exceeded
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
