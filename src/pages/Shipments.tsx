import { Ship, Plus, Filter, Download } from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';

const mockShipments = [
  { id: 'SHP-2024-001', type: 'FCL', shipper: 'Acme Corp', origin: 'CNSHA', destination: 'USLAX', status: 'in_transit', containers: 2, etd: '2026-02-10', eta: '2026-03-15' },
  { id: 'SHP-2024-002', type: 'LCL', shipper: 'Global Trade Ltd', origin: 'CNNGB', destination: 'GBFXT', status: 'booked', containers: 0, etd: '2026-03-01', eta: '2026-03-22' },
  { id: 'SHP-2024-003', type: 'FCL', shipper: 'Pacific Imports', origin: 'JPYOK', destination: 'DEHAM', status: 'arrived', containers: 1, etd: '2026-01-20', eta: '2026-02-28' },
  { id: 'SHP-2024-004', type: 'LCL', shipper: 'Euro Freight', origin: 'KRPUS', destination: 'NLRTM', status: 'delivered', containers: 0, etd: '2026-01-05', eta: '2026-02-20' },
  { id: 'SHP-2024-005', type: 'FCL', shipper: 'Silk Road Trading', origin: 'SGSIN', destination: 'AEJEA', status: 'draft', containers: 4, etd: '', eta: '' },
  { id: 'SHP-2024-006', type: 'FCL', shipper: 'Northern Logistics', origin: 'CNSHA', destination: 'USNYC', status: 'in_transit', containers: 3, etd: '2026-02-15', eta: '2026-03-20' },
];

export default function ShipmentsPage() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Shipments</h1>
          <p className="text-sm text-muted-foreground">Manage FCL & LCL sea export shipments</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-1.5 h-4 w-4" /> Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-1.5 h-4 w-4" /> Export
          </Button>
          <Button size="sm">
            <Plus className="mr-1.5 h-4 w-4" /> New Shipment
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Reference</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Shipper</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Route</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">ETD</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">ETA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockShipments.map((s) => (
                <tr key={s.id} className="hover:bg-muted/30 transition-colors cursor-pointer">
                  <td className="px-4 py-3 font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      <Ship className="h-4 w-4 text-primary" />
                      {s.id}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs font-medium text-secondary-foreground">
                      {s.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-foreground">{s.shipper}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.origin} → {s.destination}</td>
                  <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{s.etd || '—'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.eta || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
