import { Ship, FileText, Receipt, Package, TrendingUp, TrendingDown, ArrowRight, Clock, MapPin } from 'lucide-react';
import { KPICard } from '@/components/ui/kpi-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatCurrency } from '@/lib/utils';

// Mock data for dashboard
const recentShipments = [
  { id: 'SHP-2024-001', type: 'FCL', origin: 'CNSHA', destination: 'USLAX', status: 'in_transit', eta: 'Mar 15, 2026' },
  { id: 'SHP-2024-002', type: 'LCL', origin: 'CNNGB', destination: 'GBFXT', status: 'booked', eta: 'Mar 22, 2026' },
  { id: 'SHP-2024-003', type: 'FCL', origin: 'JPYOK', destination: 'DEHAM', status: 'arrived', eta: 'Feb 28, 2026' },
  { id: 'SHP-2024-004', type: 'LCL', origin: 'KRPUS', destination: 'NLRTM', status: 'delivered', eta: 'Feb 20, 2026' },
  { id: 'SHP-2024-005', type: 'FCL', origin: 'SGSIN', destination: 'AEJEA', status: 'draft', eta: 'Apr 01, 2026' },
];

const pendingTasks = [
  { title: 'Upload B/L for SHP-2024-001', priority: 'high', dueIn: '2 hours' },
  { title: 'Approve invoice INV-0892', priority: 'medium', dueIn: '1 day' },
  { title: 'Confirm booking SHP-2024-005', priority: 'high', dueIn: '3 hours' },
  { title: 'Review consol CON-2024-012', priority: 'low', dueIn: '3 days' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your logistics operations</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Active Shipments"
          value={142}
          change={12.5}
          icon={<Ship className="h-6 w-6" />}
          variant={1}
        />
        <KPICard
          title="Pending Documents"
          value={38}
          change={-5.2}
          icon={<FileText className="h-6 w-6" />}
          variant={2}
        />
        <KPICard
          title="Monthly Revenue"
          value={formatCurrency(2_450_000)}
          change={8.1}
          icon={<Receipt className="h-6 w-6" />}
          variant={3}
        />
        <KPICard
          title="Containers in Transit"
          value={89}
          change={3.7}
          icon={<Package className="h-6 w-6" />}
          variant={4}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Shipments */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="text-base font-semibold text-foreground">Recent Shipments</h2>
            <button className="flex items-center gap-1 text-xs font-medium text-accent hover:underline">
              View all <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="divide-y divide-border">
            {recentShipments.map((shipment) => (
              <div
                key={shipment.id}
                className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Ship className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{shipment.id}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {shipment.origin} → {shipment.destination}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded bg-secondary px-1.5 py-0.5 text-xs font-mono font-medium text-secondary-foreground">
                    {shipment.type}
                  </span>
                  <StatusBadge status={shipment.status} />
                  <span className="hidden text-xs text-muted-foreground sm:inline">{shipment.eta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="text-base font-semibold text-foreground">Pending Tasks</h2>
            <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
              {pendingTasks.length}
            </span>
          </div>
          <div className="divide-y divide-border">
            {pendingTasks.map((task, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3">
                <div
                  className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                    task.priority === 'high'
                      ? 'bg-destructive'
                      : task.priority === 'medium'
                      ? 'bg-warning'
                      : 'bg-muted-foreground'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{task.title}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                    <Clock className="h-3 w-3" />
                    Due in {task.dueIn}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
          <TrendingUp className="h-5 w-5 text-success" />
          <div>
            <p className="text-sm text-muted-foreground">On-Time Delivery</p>
            <p className="text-lg font-bold text-foreground">94.2%</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
          <TrendingDown className="h-5 w-5 text-destructive" />
          <div>
            <p className="text-sm text-muted-foreground">Avg Transit Time</p>
            <p className="text-lg font-bold text-foreground">18.5 days</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
          <Package className="h-5 w-5 text-accent" />
          <div>
            <p className="text-sm text-muted-foreground">Total TEU (MTD)</p>
            <p className="text-lg font-bold text-foreground">1,247</p>
          </div>
        </div>
      </div>
    </div>
  );
}
