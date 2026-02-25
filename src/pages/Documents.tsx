import { FileText, Upload, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

const mockDocs = [
  { id: '1', name: 'Bill of Lading - SHP-2024-001', type: 'bill_of_lading', shipment: 'SHP-2024-001', uploadedBy: 'John Doe', date: '2026-02-10', size: '245 KB' },
  { id: '2', name: 'Commercial Invoice - SHP-2024-002', type: 'commercial_invoice', shipment: 'SHP-2024-002', uploadedBy: 'Jane Smith', date: '2026-02-12', size: '128 KB' },
  { id: '3', name: 'Packing List - SHP-2024-001', type: 'packing_list', shipment: 'SHP-2024-001', uploadedBy: 'John Doe', date: '2026-02-10', size: '89 KB' },
  { id: '4', name: 'Certificate of Origin - SHP-2024-003', type: 'certificate_of_origin', shipment: 'SHP-2024-003', uploadedBy: 'Mike Johnson', date: '2026-02-15', size: '312 KB' },
];

const typeLabels: Record<string, string> = {
  bill_of_lading: 'B/L',
  commercial_invoice: 'Invoice',
  packing_list: 'Packing List',
  certificate_of_origin: 'C/O',
};

export default function DocumentsPage() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Documents</h1>
          <p className="text-sm text-muted-foreground">Manage shipping documentation</p>
        </div>
        <Button size="sm"><Upload className="mr-1.5 h-4 w-4" /> Upload Document</Button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Document</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Shipment</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Uploaded By</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Size</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockDocs.map((doc) => (
              <tr key={doc.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-accent" />
                    {doc.name}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded bg-secondary px-1.5 py-0.5 text-xs font-medium text-secondary-foreground">
                    {typeLabels[doc.type] || doc.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{doc.shipment}</td>
                <td className="px-4 py-3 text-foreground">{doc.uploadedBy}</td>
                <td className="px-4 py-3 text-muted-foreground">{doc.date}</td>
                <td className="px-4 py-3 text-muted-foreground">{doc.size}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"><Eye className="h-4 w-4" /></button>
                    <button className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"><Download className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
