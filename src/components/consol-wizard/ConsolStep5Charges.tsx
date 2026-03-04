import { useFormContext, useFieldArray } from 'react-hook-form';
import { DollarSign, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { ConsolFormData } from '@/types/consol-form.types';
import { CONSOL_CHARGE_UNITS, MOCK_CHARGE_CODES } from '@/types/consol-form.types';

export default function ConsolStep5Charges() {
  const { register, setValue, watch, control, formState: { errors } } = useFormContext<ConsolFormData>();
  const { fields, append, remove } = useFieldArray({ control, name: 'charges' });
  const charges = watch('charges') || [];

  const totalCharges = charges.reduce((s, c) => s + (c.amount || 0), 0);

  const addCharge = () => {
    append({
      chargeCode: '',
      description: '',
      rate: 0,
      unit: 'per CBM',
      quantity: 1,
      amount: 0,
      ppcc: 'PP',
    });
  };

  const updateAmount = (index: number) => {
    const rate = watch(`charges.${index}.rate`) || 0;
    const qty = watch(`charges.${index}.quantity`) || 1;
    setValue(`charges.${index}.amount`, rate * qty);
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="bg-primary/5 border-b border-border px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">Freight Charges</h3>
              <p className="text-[11px] text-muted-foreground">Add charges for this consol</p>
            </div>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addCharge}>
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Charge
          </Button>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {fields.length > 0 ? (
          <>
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-[11px] font-semibold">Charge Code</TableHead>
                    <TableHead className="text-[11px] font-semibold">Description</TableHead>
                    <TableHead className="text-[11px] font-semibold text-right">Rate</TableHead>
                    <TableHead className="text-[11px] font-semibold">Unit</TableHead>
                    <TableHead className="text-[11px] font-semibold text-right">Qty</TableHead>
                    <TableHead className="text-[11px] font-semibold text-right">Amount</TableHead>
                    <TableHead className="text-[11px] font-semibold">PP/CC</TableHead>
                    <TableHead className="text-[11px] font-semibold w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field, index) => (
                    <TableRow key={field.id} className="text-xs">
                      <TableCell>
                        <Select
                          value={watch(`charges.${index}.chargeCode`)}
                          onValueChange={(v) => {
                            setValue(`charges.${index}.chargeCode`, v);
                            const found = MOCK_CHARGE_CODES.find(c => c.code === v);
                            if (found) setValue(`charges.${index}.description`, found.description);
                          }}
                        >
                          <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Code" /></SelectTrigger>
                          <SelectContent>
                            {MOCK_CHARGE_CODES.map(c => <SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input className="h-8 text-xs" {...register(`charges.${index}.description`)} />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          className="h-8 text-xs text-right w-20"
                          {...register(`charges.${index}.rate`, { valueAsNumber: true })}
                          onBlur={() => updateAmount(index)}
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={watch(`charges.${index}.unit`)}
                          onValueChange={(v) => setValue(`charges.${index}.unit`, v as any)}
                        >
                          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {CONSOL_CHARGE_UNITS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          className="h-8 text-xs text-right w-16"
                          {...register(`charges.${index}.quantity`, { valueAsNumber: true })}
                          onBlur={() => updateAmount(index)}
                        />
                      </TableCell>
                      <TableCell className="text-right font-semibold text-foreground">
                        {(watch(`charges.${index}.amount`) || 0).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={watch(`charges.${index}.ppcc`)}
                          onValueChange={(v) => setValue(`charges.${index}.ppcc`, v as any)}
                        >
                          <SelectTrigger className="h-8 text-xs w-16"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PP">PP</SelectItem>
                            <SelectItem value="CC">CC</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => remove(index)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end">
              <div className="rounded-lg bg-primary/5 border border-primary/10 px-5 py-3">
                <span className="text-xs text-muted-foreground mr-3">Total Charges:</span>
                <span className="text-sm font-bold text-foreground">${totalCharges.toFixed(2)}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
              <DollarSign className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No charges added yet</p>
            <Button type="button" variant="outline" size="sm" className="mt-3" onClick={addCharge}>
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Add First Charge
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
