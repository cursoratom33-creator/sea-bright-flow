import { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { DollarSign, Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { ConsolFormData } from '@/types/consol-form.types';
import { CONSOL_CHARGE_UNITS, MOCK_CHARGE_CODES } from '@/types/consol-form.types';
import { formatCurrency } from '@/lib/utils';

export default function ConsolStep5Charges() {
  const { register, setValue, watch, control } = useFormContext<ConsolFormData>();
  const { fields, append, remove } = useFieldArray({ control, name: 'charges' });
  const charges = watch('charges') || [];
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');

  const buyCharges = charges.filter(c => (c.chargeType || 'buy') === 'buy');
  const sellCharges = charges.filter(c => c.chargeType === 'sell');
  const totalBuy = buyCharges.reduce((s, c) => s + (c.amount || 0), 0);
  const totalSell = sellCharges.reduce((s, c) => s + (c.amount || 0), 0);
  const profit = totalSell - totalBuy;

  const filteredFieldIndices = fields
    .map((field, index) => ({ field, index }))
    .filter(({ index }) => (charges[index]?.chargeType || 'buy') === activeTab);

  const updateAmount = (index: number) => {
    const rate = watch(`charges.${index}.rate`) || 0;
    const qty = watch(`charges.${index}.quantity`) || 1;
    setValue(`charges.${index}.amount`, rate * qty);
  };

  const addCharge = () => {
    append({
      chargeType: activeTab,
      chargeCode: '',
      description: '',
      rate: 0,
      unit: 'per CBM',
      quantity: 1,
      amount: 0,
      ppcc: 'PP',
    });
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="bg-primary/5 border-b border-border px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <DollarSign className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">Commercial Details</h3>
            <p className="text-[11px] text-muted-foreground">Manage buy costs, sell revenue, and profit margins</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Profit Summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-border bg-muted/30 p-3 text-center">
            <p className="text-xs text-muted-foreground mb-0.5">Total Buy (Cost)</p>
            <p className="text-base font-bold text-foreground flex items-center justify-center gap-1">
              <TrendingDown className="h-3.5 w-3.5 text-destructive" />
              {formatCurrency(totalBuy)}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 p-3 text-center">
            <p className="text-xs text-muted-foreground mb-0.5">Total Sell (Revenue)</p>
            <p className="text-base font-bold text-foreground flex items-center justify-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-accent" />
              {formatCurrency(totalSell)}
            </p>
          </div>
          <div className={`rounded-lg border p-3 text-center ${profit >= 0 ? 'border-accent/30 bg-accent/5' : 'border-destructive/30 bg-destructive/5'}`}>
            <p className="text-xs text-muted-foreground mb-0.5">Profit / Margin</p>
            <p className={`text-base font-bold ${profit >= 0 ? 'text-accent' : 'text-destructive'}`}>
              {formatCurrency(profit)}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'buy' | 'sell')}>
          <TabsList className="mb-4">
            <TabsTrigger value="buy" className="gap-1.5">
              <TrendingDown className="h-3.5 w-3.5" /> Buy / Cost
              {buyCharges.length > 0 && <span className="ml-1 text-xs opacity-70">({buyCharges.length})</span>}
            </TabsTrigger>
            <TabsTrigger value="sell" className="gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" /> Sell / Revenue
              {sellCharges.length > 0 && <span className="ml-1 text-xs opacity-70">({sellCharges.length})</span>}
            </TabsTrigger>
          </TabsList>

          {(['buy', 'sell'] as const).map((tabType) => (
            <TabsContent key={tabType} value={tabType}>
              {filteredFieldIndices.filter(({ index }) => (charges[index]?.chargeType || 'buy') === tabType).length > 0 ? (
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
                      {filteredFieldIndices
                        .filter(({ index }) => (charges[index]?.chargeType || 'buy') === tabType)
                        .map(({ field, index }) => (
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
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-border rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center mb-2">
                    {tabType === 'buy' ? <TrendingDown className="h-5 w-5 text-muted-foreground" /> : <TrendingUp className="h-5 w-5 text-muted-foreground" />}
                  </div>
                  <p className="text-sm text-muted-foreground">No {tabType === 'buy' ? 'cost' : 'revenue'} charges added</p>
                </div>
              )}

              <div className="flex items-center justify-between mt-4">
                <Button type="button" variant="outline" size="sm" onClick={addCharge}>
                  <Plus className="mr-1.5 h-3.5 w-3.5" /> Add {tabType === 'buy' ? 'Cost' : 'Revenue'} Charge
                </Button>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Subtotal ({tabType === 'buy' ? 'Cost' : 'Revenue'})</p>
                  <p className="text-lg font-bold text-foreground">
                    {formatCurrency(tabType === 'buy' ? totalBuy : totalSell)}
                  </p>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
