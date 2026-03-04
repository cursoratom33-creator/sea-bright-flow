import { useFormContext } from 'react-hook-form';
import { FileText, CheckCircle2, MapPin, Container, Package } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import type { ConsolFormData } from '@/types/consol-form.types';

export default function ConsolStep6Review() {
  const { register, watch } = useFormContext<ConsolFormData>();
  const data = watch();
  const shipments = data.shipments || [];
  const charges = data.charges || [];

  const totalPackages = shipments.reduce((s, sh) => s + sh.packages, 0);
  const totalWeight = shipments.reduce((s, sh) => s + sh.grossWeight, 0);
  const totalCbm = shipments.reduce((s, sh) => s + sh.cbm, 0);
  const totalCharges = charges.reduce((s, c) => s + (c.amount || 0), 0);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="bg-primary/5 border-b border-border px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">Documents & Review</h3>
            <p className="text-[11px] text-muted-foreground">Master BL configuration and final review</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Master BL Config */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Master B/L Configuration</h4>

          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              Seaway Bill
            </div>
            <p className="text-xs text-muted-foreground mt-1">MBL will be issued as a Seaway Bill.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Place of Issue</Label>
              <Input {...register('placeOfIssue')} placeholder="Place of issue" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Issue Date</Label>
              <Input type="date" {...register('issueDate')} />
            </div>
          </div>
        </div>

        {/* Review Summary */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Consol Summary</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Consol Info */}
            <div className="rounded-lg border border-border p-4 space-y-2">
              <div className="flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                <span className="text-xs font-semibold">Consol Info</span>
              </div>
              <ReviewRow label="Consol No." value={data.consolNumber} />
              <ReviewRow label="Type" value={data.consolType} />
              <ReviewRow label="Branch" value={data.branchOffice} />
              <ReviewRow label="Carrier" value={data.carrier} />
              <ReviewRow label="Status" value={data.consolStatus || 'Draft'} />
            </div>

            {/* Routing */}
            <div className="rounded-lg border border-border p-4 space-y-2">
              <div className="flex items-center gap-1.5 mb-2">
                <MapPin className="h-3.5 w-3.5 text-accent" />
                <span className="text-xs font-semibold">Routing</span>
              </div>
              <ReviewRow label="POL" value={data.portOfLoading} />
              <ReviewRow label="POD" value={data.portOfDischarge} />
              <ReviewRow label="Vessel" value={data.vesselName} />
              <ReviewRow label="ETD" value={data.etd} />
              <ReviewRow label="ETA" value={data.eta} />
            </div>

            {/* Container */}
            <div className="rounded-lg border border-border p-4 space-y-2">
              <div className="flex items-center gap-1.5 mb-2">
                <Container className="h-3.5 w-3.5 text-accent" />
                <span className="text-xs font-semibold">Container</span>
              </div>
              <ReviewRow label="Type" value={data.containerType} />
              <ReviewRow label="Quantity" value={String(data.containerQuantity || 0)} />
              <ReviewRow label="Container No." value={data.containerNumber || '—'} />
              <ReviewRow label="Seal No." value={data.sealNumber || '—'} />
            </div>

            {/* Shipments & Charges */}
            <div className="rounded-lg border border-border p-4 space-y-2">
              <div className="flex items-center gap-1.5 mb-2">
                <Package className="h-3.5 w-3.5 text-accent" />
                <span className="text-xs font-semibold">Cargo & Charges</span>
              </div>
              <ReviewRow label="Shipments" value={String(shipments.length)} />
              <ReviewRow label="Total Packages" value={String(totalPackages)} />
              <ReviewRow label="Total Weight" value={`${totalWeight.toLocaleString()} KG`} />
              <ReviewRow label="Total CBM" value={totalCbm.toFixed(2)} />
              <ReviewRow label="Total Charges" value={`$${totalCharges.toFixed(2)}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground truncate ml-2 max-w-[160px] text-right">{value || '—'}</span>
    </div>
  );
}
