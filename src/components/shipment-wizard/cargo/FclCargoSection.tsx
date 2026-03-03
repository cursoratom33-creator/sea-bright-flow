import { useFormContext, useFieldArray } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Container, AlertTriangle } from 'lucide-react';
import { CONTAINER_TYPES_OPTIONS, type ShipmentFormData } from '@/types/shipment-form.types';

export default function FclCargoSection() {
  const { control, watch } = useFormContext<ShipmentFormData>();
  const { fields, append, remove } = useFieldArray({ control, name: 'fclCargo' });

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div key={field.id} className="rounded-xl border border-border bg-card overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 bg-muted/40 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-primary/10">
                <Container className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-sm font-semibold text-foreground">Container {index + 1}</span>
            </div>
            {fields.length > 1 && (
              <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => remove(index)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>

          <div className="p-5 space-y-5">
            {/* Row 1: Container Type, Count, Commodity */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField control={control} name={`fclCargo.${index}.containerType`} render={({ field: f }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground uppercase tracking-wider">Container Type</FormLabel>
                  <Select onValueChange={f.onChange} value={f.value}>
                    <FormControl><SelectTrigger className="h-9"><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      {CONTAINER_TYPES_OPTIONS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name={`fclCargo.${index}.numberOfContainers`} render={({ field: f }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground uppercase tracking-wider">No. of Containers</FormLabel>
                  <FormControl><Input type="number" min={1} className="h-9" {...f} onChange={(e) => f.onChange(Number(e.target.value))} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name={`fclCargo.${index}.commodity`} render={({ field: f }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground uppercase tracking-wider">Commodity</FormLabel>
                  <FormControl><Input className="h-9" placeholder="e.g. Electronics" {...f} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Row 2: Weight, CBM, HS Code */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField control={control} name={`fclCargo.${index}.grossWeight`} render={({ field: f }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground uppercase tracking-wider">Gross Weight (KG)</FormLabel>
                  <FormControl><Input type="number" step="0.01" className="h-9" placeholder="0.0" {...f} onChange={(e) => f.onChange(Number(e.target.value))} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name={`fclCargo.${index}.cbm`} render={({ field: f }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground uppercase tracking-wider">Volume (CBM)</FormLabel>
                  <FormControl><Input type="number" step="0.01" className="h-9" placeholder="0.0" {...f} onChange={(e) => f.onChange(Number(e.target.value))} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name={`fclCargo.${index}.hsCode`} render={({ field: f }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground uppercase tracking-wider">HS Code</FormLabel>
                  <FormControl><Input className="h-9" placeholder="e.g. 8534.70" {...f} /></FormControl>
                </FormItem>
              )} />
            </div>

            {/* Dangerous Goods */}
            <div className="flex items-center gap-3 pt-1">
              <FormField control={control} name={`fclCargo.${index}.isDangerous`} render={({ field: f }) => (
                <FormItem className="flex items-center gap-2 mb-0">
                  <FormControl><Switch checked={f.value} onCheckedChange={f.onChange} /></FormControl>
                  <Label className="text-xs font-medium text-muted-foreground">Dangerous Goods</Label>
                </FormItem>
              )} />
            </div>
            {watch(`fclCargo.${index}.isDangerous`) && (
              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                <div className="col-span-2 flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                  <span className="text-xs font-medium text-destructive">Hazardous Cargo Details</span>
                </div>
                <FormField control={control} name={`fclCargo.${index}.unNumber`} render={({ field: f }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-muted-foreground uppercase tracking-wider">UN Number</FormLabel>
                    <FormControl><Input className="h-9" placeholder="e.g. UN1234" {...f} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={control} name={`fclCargo.${index}.imoClass`} render={({ field: f }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-muted-foreground uppercase tracking-wider">IMO Class</FormLabel>
                    <FormControl><Input className="h-9" placeholder="e.g. 3" {...f} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Add Container */}
      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed border-primary/40 text-primary hover:bg-primary/5 h-11"
        onClick={() => append({ containerType: '20GP', numberOfContainers: 1, grossWeight: 0, cbm: 0, commodity: '', hsCode: '', isDangerous: false, unNumber: '', imoClass: '' })}
      >
        <Plus className="mr-1.5 h-4 w-4" /> Add Container
      </Button>
    </div>
  );
}
