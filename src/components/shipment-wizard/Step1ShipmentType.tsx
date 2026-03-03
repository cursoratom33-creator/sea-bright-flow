import { useFormContext } from 'react-hook-form';
import { Ship, Container } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  MOVEMENT_TYPES, SHIPMENT_MODES, SERVICE_TYPES, INCOTERMS, FREIGHT_TERMS,
  type ShipmentFormData,
} from '@/types/shipment-form.types';

export default function Step1ShipmentType() {
  const { control, watch } = useFormContext<ShipmentFormData>();
  const shipmentType = watch('shipmentType');

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-1">1. Shipment Type</h2>
        <p className="text-sm text-muted-foreground mb-6">Select the type and terms for this shipment</p>

        {/* Shipment Type Cards */}
        <FormField
          control={control}
          name="shipmentType"
          render={({ field }) => (
            <FormItem className="mb-6">
              <FormLabel className="text-sm font-medium">Shipment Type <span className="text-destructive">*</span></FormLabel>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {[
                  { value: 'FCL', label: 'FCL – Full Container Load', icon: Container, desc: 'Exclusive container usage' },
                  { value: 'LCL', label: 'LCL – Less than Container', icon: Ship, desc: 'Shared container space' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => field.onChange(opt.value)}
                    className={cn(
                      'flex items-start gap-3 rounded-lg border-2 p-4 text-left transition-all',
                      field.value === opt.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-muted-foreground/30'
                    )}
                  >
                    <opt.icon className={cn('h-6 w-6 mt-0.5 shrink-0', field.value === opt.value ? 'text-primary' : 'text-muted-foreground')} />
                    <div>
                      <p className="font-medium text-foreground">{opt.label}</p>
                      <p className="text-xs text-muted-foreground">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 2-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <FormField
            control={control}
            name="movementType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Movement Type <span className="text-destructive">*</span></FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select movement" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {MOVEMENT_TYPES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="shipmentMode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shipment Mode <span className="text-destructive">*</span></FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select mode" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {SHIPMENT_MODES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="serviceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select service" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {SERVICE_TYPES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="incoterm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Incoterm <span className="text-destructive">*</span></FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select incoterm" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {INCOTERMS.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Freight Term */}
        <FormField
          control={control}
          name="freightTerm"
          render={({ field }) => (
            <FormItem className="mt-5">
              <FormLabel>Freight Term <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-6 mt-2">
                  {FREIGHT_TERMS.map((ft) => (
                    <div key={ft} className="flex items-center gap-2">
                      <RadioGroupItem value={ft} id={`ft-${ft}`} />
                      <Label htmlFor={`ft-${ft}`} className="cursor-pointer text-sm">{ft} ({ft === 'Prepaid' ? 'PP' : 'CC'})</Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
