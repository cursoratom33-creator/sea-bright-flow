import { StatCard } from '@/components/ui/stat-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Ship, Package, FileText, DollarSign, TrendingUp, Clock } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';

const volumeData = [
  { month: 'Jul', fcl: 42, lcl: 28 },
  { month: 'Aug', fcl: 55, lcl: 35 },
  { month: 'Sep', fcl: 48, lcl: 32 },
  { month: 'Oct', fcl: 62, lcl: 41 },
  { month: 'Nov', fcl: 58, lcl: 38 },
  { month: 'Dec', fcl: 71, lcl: 45 },
  { month: 'Jan', fcl: 65, lcl: 42 },
];

const statusData = [
  { name: 'In Transit', value: 34, color: 'hsl(199, 89%, 48%)' },
  { name: 'At Port', value: 18, color: 'hsl(38, 92%, 50%)' },
  { name: 'Customs', value: 12, color: 'hsl(172, 66%, 50%)' },
  { name: 'Delivered', value: 45, color: 'hsl(160, 84%, 39%)' },
  { name: 'Booked', value: 8, color: 'hsl(262, 83%, 58%)' },
];

const recentShipments = [
  { id: 'SHP-A3F21', type: 'FCL', origin: 'Shanghai', destination: 'Rotterdam', status: 'in_transit', eta: 'Feb 28, 2026' },
  { id: 'SHP-B7K42', type: 'LCL', origin: 'Singapore', destination: 'Hamburg', status: 'at_port', eta: 'Mar 02, 2026' },
  { id: 'SHP-C1M93', type: 'FCL', origin: 'Busan', destination: 'Los Angeles', status: 'customs', eta: 'Feb 25, 2026' },
  { id: 'SHP-D5P67', type: 'LCL', origin: 'Mumbai', destination: 'Felixstowe', status: 'booked', eta: 'Mar 10, 2026' },
  { id: 'SHP-E8R14', type: 'FCL', origin: 'Yokohama', destination: 'Vancouver', status: 'delivered', eta: 'Feb 18, 2026' },
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          title="Active Shipments"
          value={142}
          change={12.5}
          icon={<Ship className="h-5 w-5" />}
          variant={1}
        />
        <StatCard
          title="Containers"
          value={89}
          change={3.7}
          icon={<Package className="h-5 w-5" />}
          variant={2}
        />
        <StatCard
          title="Pending Docs"
          value={38}
          change={-5.2}
          icon={<FileText className="h-5 w-5" />}
          variant={3}
        />
        <StatCard
          title="Revenue (MTD)"
          value="$2.45M"
          change={8.1}
          icon={<DollarSign className="h-5 w-5" />}
          variant={4}
        />
        <StatCard
          title="On-Time Rate"
          value="94.2%"
          change={2.1}
          icon={<TrendingUp className="h-5 w-5" />}
          variant={1}
        />
        <StatCard
          title="Avg Transit"
          value="18.5d"
          change={-1.3}
          icon={<Clock className="h-5 w-5" />}
          variant={2}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Volume Chart */}
        <div className="lg:col-span-3 rounded-xl border border-border bg-card p-5">
          <h2 className="text-base font-semibold text-foreground mb-4">Shipment Volume</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="fcl" name="FCL" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="lcl" name="LCL" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Pie */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <h2 className="text-base font-semibold text-foreground mb-4">Status Overview</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-semibold text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Shipments Table */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-base font-semibold text-foreground">Recent Shipments</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-4 py-3 font-medium text-muted-foreground">Reference</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Type</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Origin</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Destination</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">ETA</th>
              </tr>
            </thead>
            <tbody>
              {recentShipments.map((shipment) => (
                <tr key={shipment.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer">
                  <td className="px-4 py-3 font-medium text-foreground">{shipment.id}</td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-secondary px-2 py-0.5 text-xs font-mono font-semibold text-secondary-foreground">
                      {shipment.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{shipment.origin}</td>
                  <td className="px-4 py-3 text-muted-foreground">{shipment.destination}</td>
                  <td className="px-4 py-3"><StatusBadge status={shipment.status} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{shipment.eta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
