import { useFormContext } from 'react-hook-form';
import { Ship, Anchor, MapPin, Package, Users, FileText, DollarSign, ArrowRight, Container } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import type { ShipmentFormData } from '@/types/shipment-form.types';

interface Props {
  currentStep: number;
}

export default function ShipmentSummary({ currentStep }: Props) {
  const { watch } = useFormContext<ShipmentFormData>();
  const data = watch();
  const charges = data.charges || [];
  const totalBuy = charges.filter(c => c.chargeType === 'buy').reduce((s, c) => s + (c.amount || 0), 0);
  const totalSell = charges.filter(c => c.chargeType === 'sell').reduce((s, c) => s + (c.amount || 0), 0);
  const margin = totalSell - totalBuy;

  const containerCount = data.shipmentType === 'FCL'
    ? (data.fclCargo || []).reduce((s, c) => s + (c.numberOfContainers || 0), 0)
    : undefined;
  const packageCount = data.shipmentType === 'LCL'
    ? (data.lclCargo || []).reduce((s, c) => s + (c.numberOfPackages || 0), 0)
    : undefined;
  const totalWeight = data.shipmentType === 'FCL'
    ? (data.fclCargo || []).reduce((s, c) => s + (c.grossWeight || 0), 0)
    : (data.lclCargo || []).reduce((s, c) => s + (c.grossWeight || 0), 0);
  const totalVolume = data.shipmentType === 'FCL'
    ? (data.fclCargo || []).reduce((s, c) => s + (c.cbm || 0), 0)
    : (data.lclCargo || []).reduce((s, c) => s + (c.volume || 0), 0);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="bg-primary/5 border-b border-border px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Ship className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">Booking Summary</h3>
            <p className="text-[11px] text-muted-foreground">
              {data.shipmentMode || 'Sea Export'}
              {data.shipmentType && ` · ${data.shipmentType}`}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Shipment Type & Terms */}
        <div className="flex flex-wrap gap-1.5">
          {data.shipmentType && (
            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
              {data.shipmentType}
            </span>
          )}
          {data.incoterm && (
            <span className="rounded-md bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent-foreground">
              {data.incoterm}
            </span>
          )}
          {data.freightTerm && (
            <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {data.freightTerm}
            </span>
          )}
          {data.serviceType && (
            <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {data.serviceType}
            </span>
          )}
        </div>

        {/* Route */}
        {(data.portOfLoading || data.portOfDischarge) && (
          <div className="rounded-lg bg-muted/50 p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Route</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-foreground">{data.portOfLoading || '—'}</span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <span className="font-semibold text-foreground">{data.portOfDischarge || '—'}</span>
            </div>
            {(data.vesselName || data.voyageNo) && (
              <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                <Anchor className="h-3 w-3" />
                {data.vesselName && <span>{data.vesselName}</span>}
                {data.voyageNo && <span>/ {data.voyageNo}</span>}
              </div>
            )}
            {(data.etd || data.eta) && (
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                {data.etd && <span>ETD: <span className="text-foreground font-medium">{data.etd}</span></span>}
                {data.eta && <span>ETA: <span className="text-foreground font-medium">{data.eta}</span></span>}
              </div>
            )}
          </div>
        )}

        {/* Parties */}
        {(data.shipperName || data.consigneeName) && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Users className="h-3.5 w-3.5 text-primary" />
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Parties</span>
            </div>
            <div className="space-y-1.5">
              {data.shipperName && <SummaryRow label="Shipper" value={data.shipperName} />}
              {data.consigneeName && <SummaryRow label="Consignee" value={data.consigneeName} />}
              {data.notifyPartyName && <SummaryRow label="Notify" value={data.notifyPartyName} />}
              {data.forwardingAgentName && <SummaryRow label="Agent" value={data.forwardingAgentName} />}
            </div>
          </div>
        )}

        {/* Cargo */}
        {(containerCount || packageCount || totalWeight > 0 || totalVolume > 0) && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Package className="h-3.5 w-3.5 text-primary" />
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Cargo</span>
            </div>
            <div className="space-y-1.5">
              {containerCount !== undefined && containerCount > 0 && (
                <SummaryRow label="Containers" value={String(containerCount)} />
              )}
              {packageCount !== undefined && packageCount > 0 && (
                <SummaryRow label="Packages" value={String(packageCount)} />
              )}
              <SummaryRow label="Total Gross Wt" value={`${totalWeight.toFixed(2)} KG`} />
              <SummaryRow label="Total Volume" value={`${totalVolume.toFixed(4)} CBM`} />
            </div>
          </div>
        )}

        {/* Documents */}
        {data.blType && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <FileText className="h-3.5 w-3.5 text-primary" />
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Documents</span>
            </div>
            <SummaryRow label="B/L Type" value={data.blType} />
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground truncate ml-2 max-w-[130px] text-right">{value}</span>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-muted/50 px-2.5 py-1.5 text-center">
      <p className="text-xs font-semibold text-foreground">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}
