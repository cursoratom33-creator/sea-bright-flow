import { useFormContext } from 'react-hook-form';
import { MapPin, Anchor, ArrowRight } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ConsolFormData } from '@/types/consol-form.types';
import { MOCK_PORTS, MOCK_VESSELS } from '@/types/consol-form.types';

export default function ConsolStep2Routing() {
  const { register, setValue, watch, formState: { errors } } = useFormContext<ConsolFormData>();

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="bg-primary/5 border-b border-border px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <MapPin className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">Routing & Vessel</h3>
            <p className="text-[11px] text-muted-foreground">Ports, vessel and schedule</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Route Visual */}
        <div className="rounded-lg bg-muted/30 border border-border p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Port of Loading (POL) <span className="text-destructive">*</span></Label>
              <Select onValueChange={(v) => setValue('portOfLoading', v, { shouldValidate: true })}>
                <SelectTrigger><SelectValue placeholder="Select POL" /></SelectTrigger>
                <SelectContent>
                  {MOCK_PORTS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.portOfLoading && <p className="text-[11px] text-destructive">{errors.portOfLoading.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Transshipment Port</Label>
              <Select onValueChange={(v) => setValue('transshipmentPort', v)}>
                <SelectTrigger><SelectValue placeholder="Select T/S port" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {MOCK_PORTS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Port of Discharge (POD) <span className="text-destructive">*</span></Label>
              <Select onValueChange={(v) => setValue('portOfDischarge', v, { shouldValidate: true })}>
                <SelectTrigger><SelectValue placeholder="Select POD" /></SelectTrigger>
                <SelectContent>
                  {MOCK_PORTS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.portOfDischarge && <p className="text-[11px] text-destructive">{errors.portOfDischarge.message}</p>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Place of Receipt</Label>
            <Input {...register('placeOfReceipt')} placeholder="Place of receipt" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Final Destination</Label>
            <Input {...register('finalDestination')} placeholder="Final destination" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Carrier Booking No.</Label>
            <Input {...register('carrierBookingNo')} placeholder="Booking number" />
          </div>
        </div>

        {/* Vessel */}
        <div className="rounded-lg bg-muted/30 border border-border p-4">
          <div className="flex items-center gap-1.5 mb-3">
            <Anchor className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Vessel Details</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Vessel Name</Label>
              <Select onValueChange={(v) => setValue('vesselName', v)}>
                <SelectTrigger><SelectValue placeholder="Select vessel" /></SelectTrigger>
                <SelectContent>
                  {MOCK_VESSELS.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Voyage Number</Label>
              <Input {...register('voyageNo')} placeholder="Voyage no." />
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">ETD <span className="text-destructive">*</span></Label>
            <Input type="date" {...register('etd')} />
            {errors.etd && <p className="text-[11px] text-destructive">{errors.etd.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">ETA <span className="text-destructive">*</span></Label>
            <Input type="date" {...register('eta')} />
            {errors.eta && <p className="text-[11px] text-destructive">{errors.eta.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Cut-off Date</Label>
            <Input type="date" {...register('cutOffDate')} />
          </div>
        </div>
      </div>
    </div>
  );
}
