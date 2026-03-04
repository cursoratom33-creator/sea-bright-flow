import { useFormContext, useFieldArray } from 'react-hook-form';
import { MapPin, Anchor, Plus, X, ArrowRight } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ConsolFormData } from '@/types/consol-form.types';
import { MOCK_PORTS, MOCK_VESSELS } from '@/types/consol-form.types';

export default function ConsolStep2Routing() {
  const { register, setValue, watch, formState: { errors } } = useFormContext<ConsolFormData>();
  const transshipmentPorts = watch('transshipmentPorts') || [];

  const addTransshipmentPort = () => {
    setValue('transshipmentPorts', [...transshipmentPorts, ''], { shouldValidate: true });
  };

  const removeTransshipmentPort = (index: number) => {
    const updated = transshipmentPorts.filter((_, i) => i !== index);
    setValue('transshipmentPorts', updated, { shouldValidate: true });
  };

  const updateTransshipmentPort = (index: number, value: string) => {
    const updated = [...transshipmentPorts];
    updated[index] = value;
    setValue('transshipmentPorts', updated, { shouldValidate: true });
  };

  const pol = watch('portOfLoading');
  const pod = watch('portOfDischarge');

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
        <div className="rounded-lg bg-muted/30 border border-border p-4 space-y-4">
          {/* POL and POD row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Port of Loading (POL) <span className="text-destructive">*</span></Label>
              <Select value={pol} onValueChange={(v) => setValue('portOfLoading', v, { shouldValidate: true })}>
                <SelectTrigger><SelectValue placeholder="Select POL" /></SelectTrigger>
                <SelectContent>
                  {MOCK_PORTS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.portOfLoading && <p className="text-[11px] text-destructive">{errors.portOfLoading.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Port of Discharge (POD) <span className="text-destructive">*</span></Label>
              <Select value={pod} onValueChange={(v) => setValue('portOfDischarge', v, { shouldValidate: true })}>
                <SelectTrigger><SelectValue placeholder="Select POD" /></SelectTrigger>
                <SelectContent>
                  {MOCK_PORTS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.portOfDischarge && <p className="text-[11px] text-destructive">{errors.portOfDischarge.message}</p>}
            </div>
          </div>

          {/* Route flow visualization */}
          {(pol || transshipmentPorts.length > 0 || pod) && (
            <div className="flex items-center gap-2 flex-wrap py-2 px-1">
              {pol && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary text-[11px] font-medium px-2.5 py-1">
                  <MapPin className="h-3 w-3" /> {pol.split(' - ')[0]}
                </span>
              )}
              {transshipmentPorts.map((tp, i) => (
                tp && (
                  <span key={i} className="contents">
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 text-accent-foreground text-[11px] font-medium px-2.5 py-1">
                      <Anchor className="h-3 w-3" /> {tp.split(' - ')[0]}
                    </span>
                  </span>
                )
              ))}
              {pod && (
                <>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary text-[11px] font-medium px-2.5 py-1">
                    <MapPin className="h-3 w-3" /> {pod.split(' - ')[0]}
                  </span>
                </>
              )}
            </div>
          )}

          {/* Transshipment Ports */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-muted-foreground">Transshipment Ports</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1"
                onClick={addTransshipmentPort}
              >
                <Plus className="h-3 w-3" /> Add T/S Port
              </Button>
            </div>

            {transshipmentPorts.length === 0 && (
              <p className="text-[11px] text-muted-foreground italic">No transshipment ports — direct routing</p>
            )}

            {transshipmentPorts.map((tp, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground font-mono w-5 shrink-0">T{index + 1}</span>
                <Select value={tp} onValueChange={(v) => updateTransshipmentPort(index, v)}>
                  <SelectTrigger className="flex-1"><SelectValue placeholder={`Select T/S port ${index + 1}`} /></SelectTrigger>
                  <SelectContent>
                    {MOCK_PORTS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => removeTransshipmentPort(index)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
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
