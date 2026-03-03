import { useFormContext, useFieldArray } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Package } from 'lucide-react';
import { PACKAGE_TYPES, DIMENSION_UNITS, type ShipmentFormData } from '@/types/shipment-form.types';

export default function LclCargoSection() {
  const { control, watch, setValue } = useFormContext<ShipmentFormData>();
  const { fields, append, remove } = useFieldArray({ control, name: 'lclCargo' });

  return (
    <>
      {fields.map((field, index) => {
        const isStackable = watch(`lclCargo.${index}.isStackable`);
        const dimensionUnit = watch(`lclCargo.${index}.dimensionUnit`) || 'CM';

        return (
          <div key={field.id} className="rounded-lg border border-border p-5 mb-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                <span className="text-base font-semibold text-foreground">Package #{index + 1}</span>
              </div>
              {fields.length > 1 && (
                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>

            {/* Stackable Toggle */}
            <div className="mb-5">
              <div className="inline-flex rounded-lg border border-border overflow-hidden">
                <button
                  type="button"
                  className={`px-5 py-2 text-sm font-medium transition-colors ${
                    isStackable
                      ? 'bg-foreground text-background'
                      : 'bg-background text-muted-foreground hover:bg-muted'
                  }`}
                  onClick={() => setValue(`lclCargo.${index}.isStackable`, true)}
                >
                  Stackable
                </button>
                <button
                  type="button"
                  className={`px-5 py-2 text-sm font-medium transition-colors ${
                    !isStackable
                      ? 'bg-foreground text-background'
                      : 'bg-background text-muted-foreground hover:bg-muted'
                  }`}
                  onClick={() => setValue(`lclCargo.${index}.isStackable`, false)}
                >
                  Non Stackable
                </button>
              </div>
            </div>

            {/* Package Type */}
            <div className="mb-5">
              <FormField control={control} name={`lclCargo.${index}.packageType`} render={({ field: f }) => (
                <FormItem className="max-w-xs">
                  <FormLabel>Package Type <span className="text-destructive">*</span></FormLabel>
                  <Select onValueChange={f.onChange} value={f.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select Package Type" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {PACKAGE_TYPES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Dimensions */}
            <div className="mb-5">
              <FormLabel className="mb-2 block">Dimensions</FormLabel>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Unit selector */}
                <div className="inline-flex rounded-lg border border-border overflow-hidden">
                  {DIMENSION_UNITS.map((unit) => (
                    <button
                      key={unit}
                      type="button"
                      className={`px-3 py-2 text-xs font-medium transition-colors ${
                        dimensionUnit === unit
                          ? 'bg-foreground text-background'
                          : 'bg-background text-muted-foreground hover:bg-muted'
                      }`}
                      onClick={() => setValue(`lclCargo.${index}.dimensionUnit`, unit)}
                    >
                      {unit}
                    </button>
                  ))}
                </div>

                {/* L / B / H inputs */}
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-primary">L</span>
                  <FormField control={control} name={`lclCargo.${index}.length`} render={({ field: f }) => (
                    <FormItem className="mb-0">
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          className="w-20"
                          placeholder="0.0"
                          {...f}
                          onChange={(e) => f.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )} />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-primary">B</span>
                  <FormField control={control} name={`lclCargo.${index}.breadth`} render={({ field: f }) => (
                    <FormItem className="mb-0">
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          className="w-20"
                          placeholder="0.0"
                          {...f}
                          onChange={(e) => f.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )} />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-primary">H</span>
                  <FormField control={control} name={`lclCargo.${index}.height`} render={({ field: f }) => (
                    <FormItem className="mb-0">
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          className="w-20"
                          placeholder="0.0"
                          {...f}
                          onChange={(e) => f.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )} />
                </div>
              </div>
            </div>

            {/* Weight / Package & No. of Packages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <FormField control={control} name={`lclCargo.${index}.weightPerPackage`} render={({ field: f }) => (
                <FormItem>
                  <FormLabel>Weight/Package (KG) <span className="text-destructive">*</span></FormLabel>
                  <FormControl><Input type="number" step="0.01" placeholder="0.0" {...f} onChange={(e) => f.onChange(Number(e.target.value))} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name={`lclCargo.${index}.numberOfPackages`} render={({ field: f }) => (
                <FormItem>
                  <FormLabel>No. of Packages <span className="text-destructive">*</span></FormLabel>
                  <FormControl><Input type="number" min={1} placeholder="Ex. 1-99" {...f} onChange={(e) => f.onChange(Number(e.target.value))} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Commodity & HSN Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <FormField control={control} name={`lclCargo.${index}.commodity`} render={({ field: f }) => (
                <FormItem>
                  <FormLabel>Commodity <span className="text-destructive">*</span></FormLabel>
                  <FormControl><Input placeholder="Commodity" {...f} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name={`lclCargo.${index}.hsCode`} render={({ field: f }) => (
                <FormItem>
                  <FormLabel>HSN Code <span className="text-destructive">*</span></FormLabel>
                  <FormControl><Input placeholder="HSN Code" {...f} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </div>
        );
      })}

      {/* Add Another Package */}
      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed border-primary text-primary hover:bg-primary/5"
        onClick={() => append({
          isStackable: true,
          packageType: undefined,
          dimensionUnit: 'CM',
          length: 0,
          breadth: 0,
          height: 0,
          weightPerPackage: 0,
          numberOfPackages: 1,
          commodity: '',
          hsCode: '',
          grossWeight: 0,
          netWeight: 0,
          volume: 0,
          marksAndNumbers: '',
          confirmNotDangerous: false,
        })}
      >
        <Plus className="mr-1.5 h-4 w-4" /> Add Another Package
      </Button>

      {/* Confirmation checkbox */}
      <div className="mt-5 flex items-start gap-3">
        <FormField control={control} name={`lclCargo.0.confirmNotDangerous`} render={({ field: f }) => (
          <FormItem className="flex items-start gap-3">
            <FormControl>
              <Checkbox checked={f.value} onCheckedChange={f.onChange} className="mt-0.5" />
            </FormControl>
            <FormLabel className="text-sm text-muted-foreground font-normal leading-snug">
              I confirm that the above cargo does not fall under dangerous/hazardous cargo category, does not require temperature control, and is not perishable.
            </FormLabel>
          </FormItem>
        )} />
      </div>
    </>
  );
}
