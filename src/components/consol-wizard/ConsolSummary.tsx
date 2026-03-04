import { useFormContext } from 'react-hook-form';
import { Ship, MapPin, Container, Package, DollarSign, ArrowRight, Anchor, AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import type { ConsolFormData } from '@/types/consol-form.types';
import { CONTAINER_CAPACITY } from '@/types/consol-form.types';

export default function ConsolSummary() {
  const { watch } = useFormContext<ConsolFormData>();
  const data = watch();
  const shipments = data.shipments || [];
  const charges = data.charges || [];

  const totalPackages = shipments.reduce((s, sh) => s + sh.packages, 0);
  const totalWeight = shipments.reduce((s, sh) => s + sh.grossWeight, 0);
  const totalCbm = shipments.reduce((s, sh) => s + sh.cbm, 0);
  const totalCharges = charges.reduce((s, c) => s + (c.amount || 0), 0);

  const capacity = data.containerType ? CONTAINER_CAPACITY[data.containerType] : null;
  const cbmPercent = capacity ? Math.min(100, (totalCbm / capacity.maxCbm) * 100) : 0;
  const weightPercent = capacity ? Math.min(100, (totalWeight / capacity.maxWeight) * 100) : 0;
  const isOverCbm = capacity ? totalCbm > capacity.maxCbm : false;
  const isOverWeight = capacity ? totalWeight > capacity.maxWeight : false;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="bg-primary/5 border-b border-border px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Ship className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">Consol Summary</h3>
            <p className="text-[11px] text-muted-foreground">
              {data.consolType || 'LCL Consol'}
              {data.consolNumber && ` · ${data.consolNumber}`}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {data.consolStatus && (
            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
              {data.consolStatus}
            </span>
          )}
          {data.serviceType && (
            <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {data.serviceType}
            </span>
          )}
          {data.carrier && (
            <span className="rounded-md bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent-foreground">
              {data.carrier}
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

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2">
          <MiniStat label="Shipments" value={String(shipments.length)} icon={<Package className="h-3 w-3" />} />
          <MiniStat label="Packages" value={String(totalPackages)} icon={<Package className="h-3 w-3" />} />
          <MiniStat label="Weight" value={`${totalWeight.toLocaleString()} KG`} icon={<Container className="h-3 w-3" />} />
          <MiniStat label="Volume" value={`${totalCbm.toFixed(2)} CBM`} icon={<Container className="h-3 w-3" />} />
        </div>

        {/* Container Utilization */}
        {capacity && (
          <div className="space-y-3">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Container Load</span>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">CBM</span>
                <span className={`font-semibold ${isOverCbm ? 'text-destructive' : 'text-foreground'}`}>
                  {cbmPercent.toFixed(0)}%
                </span>
              </div>
              <Progress value={cbmPercent} className={`h-2 ${isOverCbm ? '[&>div]:bg-destructive' : '[&>div]:bg-accent'}`} />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">Weight</span>
                <span className={`font-semibold ${isOverWeight ? 'text-destructive' : 'text-foreground'}`}>
                  {weightPercent.toFixed(0)}%
                </span>
              </div>
              <Progress value={weightPercent} className={`h-2 ${isOverWeight ? '[&>div]:bg-destructive' : '[&>div]:bg-accent'}`} />
            </div>

            {(isOverCbm || isOverWeight) && (
              <div className="flex items-center gap-1.5 text-destructive text-[11px] font-medium rounded-md bg-destructive/5 px-2.5 py-1.5">
                <AlertTriangle className="h-3 w-3" /> Capacity exceeded
              </div>
            )}
          </div>
        )}

        {/* Charges */}
        {(() => {
          const totalBuy = charges.filter(c => (c.chargeType || 'buy') === 'buy').reduce((s, c) => s + (c.amount || 0), 0);
          const totalSell = charges.filter(c => c.chargeType === 'sell').reduce((s, c) => s + (c.amount || 0), 0);
          const profit = totalSell - totalBuy;
          const margin = totalSell > 0 ? (profit / totalSell) * 100 : 0;
          return (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <DollarSign className="h-3.5 w-3.5 text-primary" />
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Commercial</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <div className="rounded-lg border border-border bg-muted/30 p-2.5 text-center">
                  <p className="text-[10px] text-muted-foreground mb-0.5">Total Buy (Cost)</p>
                  <p className="text-sm font-bold text-foreground flex items-center justify-center gap-1">
                    <TrendingDown className="h-3 w-3 text-destructive" />
                    {formatCurrency(totalBuy)}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-2.5 text-center">
                  <p className="text-[10px] text-muted-foreground mb-0.5">Total Sell (Revenue)</p>
                  <p className="text-sm font-bold text-foreground flex items-center justify-center gap-1">
                    <TrendingUp className="h-3 w-3 text-accent" />
                    {formatCurrency(totalSell)}
                  </p>
                </div>
                <div className={`rounded-lg border p-2.5 text-center ${profit >= 0 ? 'border-accent/30 bg-accent/5' : 'border-destructive/30 bg-destructive/5'}`}>
                  <p className="text-[10px] text-muted-foreground mb-0.5">Profit / Margin</p>
                  <p className={`text-sm font-bold ${profit >= 0 ? 'text-accent' : 'text-destructive'}`}>
                    {formatCurrency(profit)} <span className="text-[10px] font-semibold">({margin.toFixed(1)}%)</span>
                  </p>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

    </div>
  );
}

function MiniStat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-muted/50 p-2.5">
      <div className="flex items-center gap-1 text-muted-foreground mb-0.5">{icon}<span className="text-[10px]">{label}</span></div>
      <p className="text-xs font-semibold text-foreground">{value}</p>
    </div>
  );
}
