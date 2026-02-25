import { BarChart3, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const reportTypes = [
  { name: 'Shipment Summary', description: 'Overview of all shipments by type, status, and route', lastGenerated: '2026-02-24' },
  { name: 'Revenue Report', description: 'Monthly and quarterly revenue breakdown by client and service', lastGenerated: '2026-02-20' },
  { name: 'Container Utilization', description: 'TEU utilization rates and container type distribution', lastGenerated: '2026-02-18' },
  { name: 'Transit Time Analysis', description: 'Average transit times by route with trend analysis', lastGenerated: '2026-02-15' },
  { name: 'Document Compliance', description: 'Document submission rates and compliance status', lastGenerated: '2026-02-22' },
  { name: 'Client Performance', description: 'Shipping volumes and payment history by client', lastGenerated: '2026-02-21' },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reports</h1>
        <p className="text-sm text-muted-foreground">Generate and export operational reports</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reportTypes.map((report) => (
          <div key={report.name} className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="h-5 w-5 text-accent" />
              <h3 className="font-semibold text-foreground">{report.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Last: {report.lastGenerated}</span>
              <Button variant="outline" size="sm">
                <Download className="mr-1.5 h-3 w-3" /> Export
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
