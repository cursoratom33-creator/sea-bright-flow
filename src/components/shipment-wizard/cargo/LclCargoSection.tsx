import { useFormContext, useFieldArray } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Package, Weight, Ruler, Box } from 'lucide-react';
import { PACKAGE_TYPES, DIMENSION_UNITS, type ShipmentFormData } from '@/types/shipment-form.types';

export default function LclCargoSection() {
  const { control, watch, setValue } = useFormContext<ShipmentFormData>();
  const { fields, append, remove } = useFieldArray({ control, name: 'lclCargo' });

  const recalculate = (index: number) => {
    const l = watch(`lclCargo.${index}.length`) || 0;
    const b = watch(`lclCargo.${index}.breadth`) || 0;
    const h = watch(`lclCargo.${index}.height`) || 0;
    const unit = watch(`lclCargo.${index}.dimensionUnit`) || 'CM';
    const wpp = watch(`lclCargo.${index}.weightPerPackage`) || 0;
    const pkgs = watch(`lclCargo.${index}.numberOfPackages`) || 0;

    // Convert to meters then calc CBM
    const factor = unit === 'M' ? 1 : unit === 'CM' ? 0.01 : unit === 'MM' ? 0.001 : 0.0254;
    const cbm = parseFloat(((l * factor) * (b * factor) * (h * factor) * pkgs).toFixed(4));
    const gw = parseFloat((wpp * pkgs).toFixed(2));

    setValue(`lclCargo.${index}.volume`, cbm);
    setValue(`lclCargo.${index}.grossWeight`, gw);
  };

  return (
    <div className="space-y-4">
      {fields.map((field, index) => {
        const isStackable = watch(`lclCargo.${index}.isStackable`);
        const dimensionUnit = watch(`lclCargo.${index}.dimensionUnit`) || 'CM';

        return (
          <div key={field.id} className="rounded-xl border border-border bg-card overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 bg-muted/40 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-primary/10">
                  <Package className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-sm font-semibold text-foreground">Package {index + 1}</span>
              </div>
              <div className="flex items-center gap-3">
                {/* Stackable Toggle */}
                <div className="inline-flex rounded-md border border-border overflow-hidden text-xs">
                  <button
                    type="button"
                    className={`px-3 py-1.5 font-medium transition-all ${
                      isStackable
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card text-muted-foreground hover:bg-muted'
                    }`}
                    onClick={() => setValue(`lclCargo.${index}.isStackable`, true)}
                  >
                    Stackable
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-1.5 font-medium transition-all ${
                      !isStackable
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card text-muted-foreground hover:bg-muted'
                    }`}
                    onClick={() => setValue(`lclCargo.${index}.isStackable`, false)}
                  >
                    Non-Stackable
                  </button>
                </div>
                {fields.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => remove(index)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>

            <div className="p-5 space-y-5">
              {/* Row 1: Package Type + Commodity + HS Code */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField control={control} name={`lclCargo.${index}.packageType`} render={({ field: f }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-muted-foreground uppercase tracking-wider">Package Type</FormLabel>
                    <Select onValueChange={f.onChange} value={f.value}>
                      <FormControl><SelectTrigger className="h-9"><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {PACKAGE_TYPES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={control} name={`lclCargo.${index}.commodity`} render={({ field: f }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-muted-foreground uppercase tracking-wider">Commodity</FormLabel>
                    <FormControl><Input className="h-9" placeholder="e.g. Electronics" {...f} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={control} name={`lclCargo.${index}.hsCode`} render={({ field: f }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-muted-foreground uppercase tracking-wider">HS Code</FormLabel>
                    <FormControl><Input className="h-9" placeholder="e.g. 8534.70" {...f} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              {/* Row 2: Dimensions */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Ruler className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Dimensions</span>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="inline-flex rounded-md border border-border overflow-hidden text-xs">
                    {DIMENSION_UNITS.map((unit) => (
                      <button
                        key={unit}
                        type="button"
                        className={`px-2.5 py-1.5 font-medium transition-all ${
                          dimensionUnit === unit
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-card text-muted-foreground hover:bg-muted'
                        }`}
                        onClick={() => { setValue(`lclCargo.${index}.dimensionUnit`, unit); setTimeout(() => recalculate(index), 0); }}
                      >
                        {unit}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    {(['length', 'breadth', 'height'] as const).map((dim, i) => (
                      <FormField key={dim} control={control} name={`lclCargo.${index}.${dim}`} render={({ field: f }) => (
                        <FormItem className="mb-0">
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-primary w-3">{['L', 'B', 'H'][i]}</span>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                className="w-20 h-9"
                                placeholder="0.0"
                                {...f}
                                onChange={(e) => { f.onChange(Number(e.target.value)); setTimeout(() => recalculate(index), 0); }}
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 3: Weight, Packages, Gross Weight, Volume */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FormField control={control} name={`lclCargo.${index}.weightPerPackage`} render={({ field: f }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-muted-foreground uppercase tracking-wider">Wt/Pkg (KG)</FormLabel>
                    <FormControl><Input type="number" step="0.01" className="h-9" placeholder="0.0" {...f} onChange={(e) => { f.onChange(Number(e.target.value)); setTimeout(() => recalculate(index), 0); }} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={control} name={`lclCargo.${index}.numberOfPackages`} render={({ field: f }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-muted-foreground uppercase tracking-wider">No. of Pkgs</FormLabel>
                    <FormControl><Input type="number" min={1} className="h-9" placeholder="1" {...f} onChange={(e) => { f.onChange(Number(e.target.value)); setTimeout(() => recalculate(index), 0); }} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={control} name={`lclCargo.${index}.grossWeight`} render={({ field: f }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-muted-foreground uppercase tracking-wider">Gross Wt (KG)</FormLabel>
                    <FormControl><Input type="number" step="0.01" className="h-9 bg-muted/50" readOnly value={f.value} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={control} name={`lclCargo.${index}.volume`} render={({ field: f }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-muted-foreground uppercase tracking-wider">Volume (CBM)</FormLabel>
                    <FormControl><Input type="number" step="0.01" className="h-9" placeholder="0.0" {...f} onChange={(e) => f.onChange(Number(e.target.value))} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>
          </div>
        );
      })}

      {/* Add Package */}
      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed border-primary/40 text-primary hover:bg-primary/5 h-11"
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
        <Plus className="mr-1.5 h-4 w-4" /> Add Package
      </Button>
    </div>
  );
}
