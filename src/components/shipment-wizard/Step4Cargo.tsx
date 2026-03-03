import { useFormContext, useFieldArray } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Package, Container } from 'lucide-react';
import { CONTAINER_TYPES_OPTIONS, PACKAGE_TYPES, type ShipmentFormData } from '@/types/shipment-form.types';

export default function Step4Cargo() {
  const { control, watch } = useFormContext<ShipmentFormData>();
  const shipmentType = watch('shipmentType');

  const { fields: fclFields, append: appendFcl, remove: removeFcl } = useFieldArray({ control, name: 'fclCargo' });
  const { fields: lclFields, append: appendLcl, remove: removeLcl } = useFieldArray({ control, name: 'lclCargo' });

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-1">4. Cargo Details</h2>
        <p className="text-sm text-muted-foreground mb-6">
          {shipmentType === 'FCL' ? 'Container and cargo information' : 'Package and cargo information'}
        </p>

        {shipmentType === 'FCL' ? (
          <>
            {fclFields.map((field, index) => (
              <div key={field.id} className="rounded-lg border border-border p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Container className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">Container {index + 1}</span>
                  </div>
                  {fclFields.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeFcl(index)}>
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
            <Button type="button" variant="outline" size="sm" onClick={() => appendFcl({ containerType: '20GP', numberOfContainers: 1, grossWeight: 0, cbm: 0, commodity: '', hsCode: '', isDangerous: false, unNumber: '', imoClass: '' })}>
              <Plus className="mr-1.5 h-4 w-4" /> Add Container
            </Button>
          </>
        ) : (
          <>
            {lclFields.map((field, index) => (
              <div key={field.id} className="rounded-lg border border-border p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">Cargo Line {index + 1}</span>
                  </div>
                  {lclFields.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeLcl(index)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FormField control={control} name={`lclCargo.${index}.numberOfPackages`} render={({ field: f }) => (
                    <FormItem>
                      <FormLabel>No. of Packages <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input type="number" min={1} {...f} onChange={(e) => f.onChange(Number(e.target.value))} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={control} name={`lclCargo.${index}.packageType`} render={({ field: f }) => (
                    <FormItem>
                      <FormLabel>Package Type</FormLabel>
                      <Select onValueChange={f.onChange} value={f.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {PACKAGE_TYPES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )} />
                  <FormField control={control} name={`lclCargo.${index}.grossWeight`} render={({ field: f }) => (
                    <FormItem>
                      <FormLabel>Gross Weight (KG) <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input type="number" step="0.01" {...f} onChange={(e) => f.onChange(Number(e.target.value))} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={control} name={`lclCargo.${index}.netWeight`} render={({ field: f }) => (
                    <FormItem>
                      <FormLabel>Net Weight (KG)</FormLabel>
                      <FormControl><Input type="number" step="0.01" {...f} onChange={(e) => f.onChange(Number(e.target.value))} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={control} name={`lclCargo.${index}.volume`} render={({ field: f }) => (
                    <FormItem>
                      <FormLabel>Volume (CBM) <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input type="number" step="0.01" {...f} onChange={(e) => f.onChange(Number(e.target.value))} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={control} name={`lclCargo.${index}.commodity`} render={({ field: f }) => (
                    <FormItem>
                      <FormLabel>Commodity <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input placeholder="e.g. Textiles" {...f} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={control} name={`lclCargo.${index}.marksAndNumbers`} render={({ field: f }) => (
                    <FormItem>
                      <FormLabel>Marks & Numbers</FormLabel>
                      <FormControl><Input placeholder="Optional" {...f} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={control} name={`lclCargo.${index}.isStackable`} render={({ field: f }) => (
                    <FormItem className="flex items-center gap-2 pt-6">
                      <FormControl><Switch checked={f.value} onCheckedChange={f.onChange} /></FormControl>
                      <Label className="text-sm">Stackable</Label>
                    </FormItem>
                  )} />
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => appendLcl({ numberOfPackages: 1, packageType: undefined, grossWeight: 0, netWeight: 0, volume: 0, commodity: '', marksAndNumbers: '', isStackable: true })}>
              <Plus className="mr-1.5 h-4 w-4" /> Add Cargo Line
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
