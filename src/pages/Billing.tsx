import { Receipt, Plus, Filter } from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';

const formatCurrency = (amount: number, currency = 'USD'): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);

const mockInvoices = [
  { id: 'INV-0890', client: 'Acme Corp', shipment: 'SHP-2024-001', amount: 12500, currency: 'USD', status: 'paid', dueDate: '2026-02-15' },
  { id: 'INV-0891', client: 'Global Trade Ltd', shipment: 'SHP-2024-002', amount: 8200, currency: 'USD', status: 'sent', dueDate: '2026-03-01' },
  { id: 'INV-0892', client: 'Pacific Imports', shipment: 'SHP-2024-003', amount: 15800, currency: 'USD', status: 'overdue', dueDate: '2026-02-10' },
  { id: 'INV-0893', client: 'Euro Freight', shipment: 'SHP-2024-004', amount: 6400, currency: 'USD', status: 'draft', dueDate: '2026-03-15' },
];

export default function BillingPage() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Billing</h1>
          <p className="text-sm text-muted-foreground">Invoices and payment management</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Filter className="mr-1.5 h-4 w-4" /> Filter</Button>
          <Button size="sm"><Plus className="mr-1.5 h-4 w-4" /> Create Invoice</Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Outstanding</p>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(24000)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Overdue</p>
          <p className="text-2xl font-bold text-destructive">{formatCurrency(15800)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Paid (MTD)</p>
          <p className="text-2xl font-bold text-success">{formatCurrency(12500)}</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Invoice</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Client</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Shipment</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Amount</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Due Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockInvoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-muted/30 transition-colors cursor-pointer">
                <td className="px-4 py-3 font-medium text-foreground">
                  <div className="flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-accent" />
                    {inv.id}
                  </div>
                </td>
                <td className="px-4 py-3 text-foreground">{inv.client}</td>
                <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{inv.shipment}</td>
                <td className="px-4 py-3 font-semibold text-foreground">{formatCurrency(inv.amount)}</td>
                <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                <td className="px-4 py-3 text-muted-foreground">{inv.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
