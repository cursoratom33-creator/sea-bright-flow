import { useNavigate } from 'react-router-dom';
import { Package, Plus, TrendingDown, TrendingUp, DollarSign } from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

const mockConsols = [
  { id: 'CON-2024-001', type: 'LCL', origin: 'CNSHA', destination: 'USLAX', status: 'open', shipments: 5, vessel: 'MSC ANNA', etd: '2026-03-05', totalBuy: 12500, totalSell: 18200, profit: 5700 },
  { id: 'CON-2024-002', type: 'LCL', origin: 'CNNGB', destination: 'GBFXT', status: 'closed', shipments: 8, vessel: 'EVER GIVEN', etd: '2026-02-28', totalBuy: 22000, totalSell: 31500, profit: 9500 },
  { id: 'CON-2024-003', type: 'FCL', origin: 'JPYOK', destination: 'DEHAM', status: 'shipped', shipments: 3, vessel: 'CMA CGM MARCO', etd: '2026-02-20', totalBuy: 8900, totalSell: 11200, profit: 2300 },
];

export default function ConsolPage() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Consol Management</h1>
          <p className="text-sm text-muted-foreground">Consolidate and manage shipment groups</p>
        </div>
        <Button size="sm" onClick={() => navigate('/consol/new')}><Plus className="mr-1.5 h-4 w-4" /> Create Consol</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockConsols.map((c) => (
          <div key={c.id} className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-accent" />
                <span className="font-semibold text-foreground">{c.id}</span>
              </div>
              <StatusBadge status={c.status} />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Route</span>
                <span className="text-foreground font-medium">{c.origin} → {c.destination}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vessel</span>
                <span className="text-foreground">{c.vessel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipments</span>
                <span className="text-foreground font-medium">{c.shipments}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ETD</span>
                <span className="text-foreground">{c.etd}</span>
              </div>
              <div className="border-t border-border pt-2 mt-2 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1"><TrendingDown className="h-3 w-3 text-destructive" />Buy</span>
                  <span className="text-foreground font-medium">{formatCurrency(c.totalBuy)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1"><TrendingUp className="h-3 w-3 text-accent" />Sell</span>
                  <span className="text-foreground font-medium">{formatCurrency(c.totalSell)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1"><DollarSign className="h-3 w-3 text-primary" />Profit</span>
                  <span className={`font-semibold ${c.profit >= 0 ? 'text-accent' : 'text-destructive'}`}>{formatCurrency(c.profit)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
