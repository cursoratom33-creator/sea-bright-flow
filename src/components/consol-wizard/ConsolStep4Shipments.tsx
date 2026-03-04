import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Package, Plus, Trash2, Search, Sparkles, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import type { ConsolFormData, ConsolShipment } from '@/types/consol-form.types';
import { MOCK_AVAILABLE_SHIPMENTS, CONTAINER_CAPACITY } from '@/types/consol-form.types';

export default function ConsolStep4Shipments() {
  const { setValue, watch } = useFormContext<ConsolFormData>();
  const shipments = watch('shipments') || [];
  const containerType = watch('containerType');
  const pol = watch('portOfLoading');
  const pod = watch('portOfDischarge');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShipmentId, setSelectedShipmentId] = useState('');

  const capacity = containerType ? CONTAINER_CAPACITY[containerType] : null;
  const totalPackages = shipments.reduce((s, sh) => s + sh.packages, 0);
  const totalWeight = shipments.reduce((s, sh) => s + sh.grossWeight, 0);
  const totalCbm = shipments.reduce((s, sh) => s + sh.cbm, 0);
  const isOverCapacity = capacity ? totalCbm > capacity.maxCbm || totalWeight > capacity.maxWeight : false;

  const availableShipments = MOCK_AVAILABLE_SHIPMENTS.filter(
    s => !shipments.find(sh => sh.shipmentId === s.shipmentId)
  );

  const filteredShipments = availableShipments.filter(s =>
    s.shipmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.shipperName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.hblNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addShipment = (shipment: ConsolShipment) => {
    setValue('shipments', [...shipments, shipment], { shouldDirty: true });
    setSelectedShipmentId('');
    setSearchTerm('');
    toast.success(`Shipment ${shipment.shipmentNumber} added`);
  };

  const removeShipment = (shipmentId: string) => {
    setValue('shipments', shipments.filter(s => s.shipmentId !== shipmentId), { shouldDirty: true });
  };

  const autoSuggest = () => {
    const suggested = availableShipments.slice(0, 3);
    if (suggested.length === 0) {
      toast.info('No matching shipments found');
      return;
    }
    setValue('shipments', [...shipments, ...suggested], { shouldDirty: true });
    toast.success(`${suggested.length} shipment(s) auto-added`);
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="bg-primary/5 border-b border-border px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">Add Shipments (HBL)</h3>
              <p className="text-[11px] text-muted-foreground">Attach LCL shipments to this consol</p>
            </div>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={autoSuggest} className="text-accent border-accent/30 hover:bg-accent/5">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Auto Suggest
          </Button>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Add Shipment */}
        <div className="flex items-end gap-3">
          <div className="flex-1 space-y-1.5">
            <Label className="text-xs font-medium">Search Shipment</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by shipment no., HBL or shipper..."
                className="pl-8"
              />
            </div>
          </div>
        </div>

        {/* Search Results */}
        {searchTerm && filteredShipments.length > 0 && (
          <div className="rounded-lg border border-border bg-muted/30 max-h-48 overflow-auto">
            {filteredShipments.map(s => (
              <button
                key={s.shipmentId}
                type="button"
                onClick={() => addShipment(s)}
                className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-primary/5 transition-colors text-left border-b border-border last:border-0"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-foreground">{s.shipmentNumber}</span>
                  <span className="text-[11px] text-muted-foreground">{s.shipperName} · {s.commodity}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span>{s.cbm} CBM</span>
                  <span>{s.grossWeight} KG</span>
                  <Plus className="h-3.5 w-3.5 text-accent" />
                </div>
              </button>
            ))}
          </div>
        )}

        {searchTerm && filteredShipments.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-3">No matching shipments found</p>
        )}

        {/* Shipments Table */}
        {shipments.length > 0 ? (
          <>
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-[11px] font-semibold">Shipment No.</TableHead>
                    <TableHead className="text-[11px] font-semibold">HBL</TableHead>
                    <TableHead className="text-[11px] font-semibold">Shipper</TableHead>
                    <TableHead className="text-[11px] font-semibold">Consignee</TableHead>
                    <TableHead className="text-[11px] font-semibold text-right">Pkgs</TableHead>
                    <TableHead className="text-[11px] font-semibold text-right">Wt (KG)</TableHead>
                    <TableHead className="text-[11px] font-semibold text-right">CBM</TableHead>
                    <TableHead className="text-[11px] font-semibold">Commodity</TableHead>
                    <TableHead className="text-[11px] font-semibold">PP/CC</TableHead>
                    <TableHead className="text-[11px] font-semibold w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shipments.map((s) => (
                    <TableRow key={s.shipmentId} className="text-xs">
                      <TableCell className="font-medium text-foreground">{s.shipmentNumber}</TableCell>
                      <TableCell className="text-muted-foreground">{s.hblNumber}</TableCell>
                      <TableCell className="max-w-[120px] truncate">{s.shipperName}</TableCell>
                      <TableCell className="max-w-[120px] truncate">{s.consigneeName}</TableCell>
                      <TableCell className="text-right">{s.packages}</TableCell>
                      <TableCell className="text-right">{s.grossWeight.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{s.cbm}</TableCell>
                      <TableCell>{s.commodity}</TableCell>
                      <TableCell>
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${s.freightTerm === 'PP' ? 'bg-accent/10 text-accent' : 'bg-warning/10 text-warning-foreground'}`}>
                          {s.freightTerm}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => removeShipment(s.shipmentId)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Totals */}
            <div className="flex items-center justify-between rounded-lg bg-primary/5 border border-primary/10 px-4 py-3">
              <div className="flex items-center gap-6 text-xs">
                <div><span className="text-muted-foreground">Shipments:</span> <span className="font-semibold text-foreground">{shipments.length}</span></div>
                <div><span className="text-muted-foreground">Packages:</span> <span className="font-semibold text-foreground">{totalPackages}</span></div>
                <div><span className="text-muted-foreground">Weight:</span> <span className="font-semibold text-foreground">{totalWeight.toLocaleString()} KG</span></div>
                <div><span className="text-muted-foreground">CBM:</span> <span className="font-semibold text-foreground">{totalCbm.toFixed(2)}</span></div>
              </div>
              {isOverCapacity && (
                <div className="flex items-center gap-1.5 text-destructive text-[11px] font-medium">
                  <AlertTriangle className="h-3.5 w-3.5" /> Capacity exceeded
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
              <Package className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No shipments added yet</p>
            <p className="text-[11px] text-muted-foreground mt-1">Search above or use Auto Suggest to find matching shipments</p>
          </div>
        )}
      </div>
    </div>
  );
}
