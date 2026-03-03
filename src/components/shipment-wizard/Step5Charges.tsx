import { useFormContext, useFieldArray } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, DollarSign, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { CURRENCIES, CHARGE_UNITS, type ShipmentFormData } from '@/types/shipment-form.types';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';

const CHARGE_CODES = [
  { code: 'OFR', description: 'Ocean Freight' },
  { code: 'THC', description: 'Terminal Handling' },
  { code: 'DOC', description: 'Documentation Fee' },
  { code: 'BLC', description: 'B/L Charges' },
  { code: 'ISP', description: 'ISPS Surcharge' },
  { code: 'BAF', description: 'Bunker Adjustment Factor' },
  { code: 'CFS', description: 'CFS Charges' },
  { code: 'HAZ', description: 'Hazardous Surcharge' },
];

export default function Step5Charges() {
  const { control, watch, setValue } = useFormContext<ShipmentFormData>();
  const { fields, append, remove } = useFieldArray({ control, name: 'charges' });
  const charges = watch('charges') || [];
  const currency = watch('currency');
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');

  const buyCharges = charges.filter(c => (c.chargeType || 'buy') === 'buy');
  const sellCharges = charges.filter(c => c.chargeType === 'sell');
  const totalBuy = buyCharges.reduce((sum, c) => sum + (c.amount || 0), 0);
  const totalSell = sellCharges.reduce((sum, c) => sum + (c.amount || 0), 0);
  const profit = totalSell - totalBuy;

  const updateAmount = (index: number) => {
    const rate = watch(`charges.${index}.rate`) || 0;
    const qty = watch(`charges.${index}.quantity`) || 0;
    setValue(`charges.${index}.amount`, rate * qty);
  };

  const filteredFieldIndices = fields
    .map((field, index) => ({ field, index }))
    .filter(({ index }) => {
      const ct = charges[index]?.chargeType || 'buy';
      return ct === activeTab;
    });

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-1">5. Freight & Charges</h2>
        <p className="text-sm text-muted-foreground mb-6">Define buy (cost) and sell (revenue) charges</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <FormField control={control} name="currency" render={({ field }) => (
            <FormItem>
              <FormLabel>Currency <span className="text-destructive">*</span></FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  {CURRENCIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={control} name="exchangeRate" render={({ field }) => (
            <FormItem>
              <FormLabel>Exchange Rate</FormLabel>
              <FormControl><Input type="number" step="0.0001" {...field} onChange={(e) => field.onChange(Number(e.target.value))} /></FormControl>
            </FormItem>
          )} />
        </div>

        {/* Profit Summary */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border border-border bg-muted/30 p-3 text-center">
            <p className="text-xs text-muted-foreground mb-0.5">Total Buy (Cost)</p>
            <p className="text-base font-bold text-foreground flex items-center justify-center gap-1">
              <TrendingDown className="h-3.5 w-3.5 text-destructive" />
              {formatCurrency(totalBuy, currency)}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 p-3 text-center">
            <p className="text-xs text-muted-foreground mb-0.5">Total Sell (Revenue)</p>
            <p className="text-base font-bold text-foreground flex items-center justify-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-accent" />
              {formatCurrency(totalSell, currency)}
            </p>
          </div>
          <div className={`rounded-lg border p-3 text-center ${profit >= 0 ? 'border-accent/30 bg-accent/5' : 'border-destructive/30 bg-destructive/5'}`}>
            <p className="text-xs text-muted-foreground mb-0.5">Profit / Margin</p>
            <p className={`text-base font-bold ${profit >= 0 ? 'text-accent' : 'text-destructive'}`}>
              {formatCurrency(profit, currency)}
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
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Code</th>
                      <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Description</th>
                      <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">Rate</th>
                      <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Unit</th>
                      <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">Qty</th>
                      <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">Amount</th>
                      <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">PP/CC</th>
                      <th className="px-3 py-2.5 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredFieldIndices
                      .filter(({ index }) => (charges[index]?.chargeType || 'buy') === tabType)
                      .map(({ field, index }) => (
                        <tr key={field.id}>
                          <td className="px-2 py-1.5">
                            <FormField control={control} name={`charges.${index}.chargeCode`} render={({ field: f }) => (
                              <Input className="h-8 text-xs" placeholder="Code" {...f} list="charge-codes" />
                            )} />
                          </td>
                          <td className="px-2 py-1.5">
                            <FormField control={control} name={`charges.${index}.description`} render={({ field: f }) => (
                              <Input className="h-8 text-xs" placeholder="Description" {...f}
                                onChange={(e) => {
                                  f.onChange(e);
                                  const match = CHARGE_CODES.find((c) => c.code === watch(`charges.${index}.chargeCode`));
                                  if (match && !e.target.value) setValue(`charges.${index}.description`, match.description);
                                }}
                              />
                            )} />
                          </td>
                          <td className="px-2 py-1.5">
                            <FormField control={control} name={`charges.${index}.rate`} render={({ field: f }) => (
                              <Input className="h-8 text-xs text-right" type="number" step="0.01" {...f}
                                onChange={(e) => { f.onChange(Number(e.target.value)); setTimeout(() => updateAmount(index), 0); }}
                              />
                            )} />
                          </td>
                          <td className="px-2 py-1.5">
                            <FormField control={control} name={`charges.${index}.unit`} render={({ field: f }) => (
                              <Select onValueChange={f.onChange} value={f.value}>
                                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  {CHARGE_UNITS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            )} />
                          </td>
                          <td className="px-2 py-1.5">
                            <FormField control={control} name={`charges.${index}.quantity`} render={({ field: f }) => (
                              <Input className="h-8 text-xs text-right" type="number" min={1} {...f}
                                onChange={(e) => { f.onChange(Number(e.target.value)); setTimeout(() => updateAmount(index), 0); }}
                              />
                            )} />
                          </td>
                          <td className="px-2 py-1.5">
                            <FormField control={control} name={`charges.${index}.amount`} render={({ field: f }) => (
                              <Input className="h-8 text-xs text-right bg-muted/50" readOnly value={f.value?.toFixed(2) || '0.00'} />
                            )} />
                          </td>
                          <td className="px-2 py-1.5">
                            <FormField control={control} name={`charges.${index}.ppcc`} render={({ field: f }) => (
                              <Select onValueChange={f.onChange} value={f.value}>
                                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="PP">PP</SelectItem>
                                  <SelectItem value="CC">CC</SelectItem>
                                </SelectContent>
                              </Select>
                            )} />
                          </td>
                          <td className="px-2 py-1.5">
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => remove(index)}>
                              <Trash2 className="h-3.5 w-3.5 text-destructive" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>

                <datalist id="charge-codes">
                  {CHARGE_CODES.map((c) => <option key={c.code} value={c.code}>{c.description}</option>)}
                </datalist>
              </div>

              <div className="flex items-center justify-between mt-4">
                <Button type="button" variant="outline" size="sm" onClick={() => append({ chargeType: activeTab, chargeCode: '', description: '', rate: 0, unit: 'Shipment', quantity: 1, amount: 0, ppcc: 'PP' })}>
                  <Plus className="mr-1.5 h-4 w-4" /> Add {activeTab === 'buy' ? 'Cost' : 'Revenue'} Charge
                </Button>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Subtotal ({activeTab === 'buy' ? 'Cost' : 'Revenue'})</p>
                  <p className="text-lg font-bold text-foreground">
                    <DollarSign className="inline h-4 w-4" />
                    {formatCurrency(activeTab === 'buy' ? totalBuy : totalSell, currency).replace(/[^0-9.,]/g, '')}
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
