import { useFormContext, useFieldArray } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Container } from 'lucide-react';
import { CONTAINER_TYPES_OPTIONS, type ShipmentFormData } from '@/types/shipment-form.types';

export default function FclCargoSection() {
  const { control, watch } = useFormContext<ShipmentFormData>();
  const { fields, append, remove } = useFieldArray({ control, name: 'fclCargo' });

  return (
    <>
      {fields.map((field, index) => (
        <div key={field.id} className="rounded-lg border border-border p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Container className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Container {index + 1}</span>
            </div>
            {fields.length > 1 && (
              <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField control={control} name={`fclCargo.${index}.containerType`} render={({ field: f }) => (
              <FormItem>
                <FormLabel>Container Type <span className="text-destructive">*</span></FormLabel>
                <Select onValueChange={f.onChange} value={f.value}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    {CONTAINER_TYPES_OPTIONS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={control} name={`fclCargo.${index}.numberOfContainers`} render={({ field: f }) => (
              <FormItem>
                <FormLabel>No. of Containers <span className="text-destructive">*</span></FormLabel>
                <FormControl><Input type="number" min={1} {...f} onChange={(e) => f.onChange(Number(e.target.value))} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={control} name={`fclCargo.${index}.grossWeight`} render={({ field: f }) => (
              <FormItem>
                <FormLabel>Gross Weight (KG) <span className="text-destructive">*</span></FormLabel>
                <FormControl><Input type="number" step="0.01" {...f} onChange={(e) => f.onChange(Number(e.target.value))} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={control} name={`fclCargo.${index}.cbm`} render={({ field: f }) => (
              <FormItem>
                <FormLabel>CBM <span className="text-destructive">*</span></FormLabel>
                <FormControl><Input type="number" step="0.01" {...f} onChange={(e) => f.onChange(Number(e.target.value))} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={control} name={`fclCargo.${index}.commodity`} render={({ field: f }) => (
              <FormItem>
                <FormLabel>Commodity <span className="text-destructive">*</span></FormLabel>
                <FormControl><Input placeholder="e.g. Electronics" {...f} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={control} name={`fclCargo.${index}.hsCode`} render={({ field: f }) => (
              <FormItem>
                <FormLabel>HS Code</FormLabel>
                <FormControl><Input placeholder="e.g. 8534.70" {...f} /></FormControl>
              </FormItem>
            )} />
          </div>
          {/* Dangerous Goods */}
          <div className="mt-4 flex items-center gap-3">
            <FormField control={control} name={`fclCargo.${index}.isDangerous`} render={({ field: f }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl><Switch checked={f.value} onCheckedChange={f.onChange} /></FormControl>
                <Label className="text-sm">Dangerous Goods?</Label>
              </FormItem>
            )} />
          </div>
          {watch(`fclCargo.${index}.isDangerous`) && (
            <div className="grid grid-cols-2 gap-4 mt-3 pl-4 border-l-2 border-destructive/30">
              <FormField control={control} name={`fclCargo.${index}.unNumber`} render={({ field: f }) => (
                <FormItem>
                  <FormLabel>UN Number <span className="text-destructive">*</span></FormLabel>
                  <FormControl><Input placeholder="e.g. UN1234" {...f} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name={`fclCargo.${index}.imoClass`} render={({ field: f }) => (
                <FormItem>
                  <FormLabel>IMO Class <span className="text-destructive">*</span></FormLabel>
                  <FormControl><Input placeholder="e.g. 3" {...f} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          )}
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => append({ containerType: '20GP', numberOfContainers: 1, grossWeight: 0, cbm: 0, commodity: '', hsCode: '', isDangerous: false, unNumber: '', imoClass: '' })}>
        <Plus className="mr-1.5 h-4 w-4" /> Add Container
      </Button>
    </>
  );
}
