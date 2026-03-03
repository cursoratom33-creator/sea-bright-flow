import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, CheckCircle2 } from 'lucide-react';
import { BL_TYPES, type ShipmentFormData } from '@/types/shipment-form.types';
import { formatCurrency } from '@/lib/utils';

export default function Step6Review() {
  const { control, watch } = useFormContext<ShipmentFormData>();
  const data = watch();
  const charges = data.charges || [];
  const totalCharges = charges.reduce((sum, c) => sum + (c.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Document Options */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-1">6. Documents & Review</h2>
        <p className="text-sm text-muted-foreground mb-6">Set document preferences and review your shipment</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={control} name="blType" render={({ field }) => (
            <FormItem>
              <FormLabel>Bill of Lading Type <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} value={field.value} className="space-y-2 mt-2">
                  {BL_TYPES.map((t) => (
                    <div key={t} className="flex items-center gap-2">
                      <RadioGroupItem value={t} id={`bl-${t}`} />
                      <Label htmlFor={`bl-${t}`} className="cursor-pointer text-sm">{t}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <div className="space-y-4">
            <FormField control={control} name="hblRequired" render={({ field }) => (
              <FormItem className="flex items-center gap-3">
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                <Label>HBL Required?</Label>
              </FormItem>
            )} />
            <FormField control={control} name="mblRequired" render={({ field }) => (
              <FormItem className="flex items-center gap-3">
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                <Label>MBL Required?</Label>
              </FormItem>
            )} />
            <FormField control={control} name="telexRelease" render={({ field }) => (
              <FormItem className="flex items-center gap-3">
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                <Label>Telex Release?</Label>
              </FormItem>
            )} />
            <FormField control={control} name="originalBLCount" render={({ field }) => (
              <FormItem>
                <FormLabel>Original BL Count</FormLabel>
                <FormControl><Input type="number" min={0} className="w-24" {...field} onChange={(e) => field.onChange(Number(e.target.value))} /></FormControl>
              </FormItem>
            )} />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Shipment Summary</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SummarySection title="Type & Terms">
            <SummaryRow label="Shipment Type" value={data.shipmentType} />
            <SummaryRow label="Movement" value={data.movementType} />
            <SummaryRow label="Mode" value={data.shipmentMode} />
            <SummaryRow label="Incoterm" value={data.incoterm} />
            <SummaryRow label="Freight Term" value={data.freightTerm} />
          </SummarySection>

          <SummarySection title="Parties">
            <SummaryRow label="Shipper" value={data.shipperName} />
            <SummaryRow label="Consignee" value={data.consigneeName} />
            {data.notifyPartyName && <SummaryRow label="Notify Party" value={data.notifyPartyName} />}
          </SummarySection>

          <SummarySection title="Routing">
            <SummaryRow label="POL" value={data.portOfLoading} />
            <SummaryRow label="POD" value={data.portOfDischarge} />
            <SummaryRow label="ETD" value={data.etd} />
            <SummaryRow label="ETA" value={data.eta} />
            <SummaryRow label="Carrier" value={data.carrier} />
          </SummarySection>

          <SummarySection title="Charges">
            <SummaryRow label="Currency" value={data.currency} />
            <SummaryRow label="Total Charges" value={formatCurrency(totalCharges, data.currency)} />
            <SummaryRow label="Charge Lines" value={String(charges.length)} />
          </SummarySection>
        </div>
      </div>
    </div>
  );
}

function SummarySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
        <CheckCircle2 className="h-3.5 w-3.5 text-accent" /> {title}
      </h4>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value || '—'}</span>
    </div>
  );
}
