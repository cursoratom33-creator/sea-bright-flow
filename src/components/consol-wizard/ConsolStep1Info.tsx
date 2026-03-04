import { useFormContext } from 'react-hook-form';
import { Building2, Ship, Users, Briefcase } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ConsolFormData } from '@/types/consol-form.types';
import { CONSOL_TYPES, CONSOL_SERVICE_TYPES, MOCK_BRANCHES, MOCK_CARRIERS, MOCK_SALES_PERSONS } from '@/types/consol-form.types';

export default function ConsolStep1Info() {
  const { register, setValue, watch, formState: { errors } } = useFormContext<ConsolFormData>();
  const consolType = watch('consolType');
  const serviceType = watch('serviceType');

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="bg-primary/5 border-b border-border px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Building2 className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">Consol Information</h3>
            <p className="text-[11px] text-muted-foreground">Define consol type and basic details</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Consol Type */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Consol Type <span className="text-destructive">*</span></Label>
            <Select value={consolType} onValueChange={(v) => setValue('consolType', v as any, { shouldValidate: true })}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                {CONSOL_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.consolType && <p className="text-[11px] text-destructive">{errors.consolType.message}</p>}
          </div>

          {/* Consol Number */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Consol Number</Label>
            <Input {...register('consolNumber')} readOnly className="bg-muted/50" />
          </div>

          {/* Branch Office */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Branch Office <span className="text-destructive">*</span></Label>
            <Select onValueChange={(v) => setValue('branchOffice', v, { shouldValidate: true })}>
              <SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger>
              <SelectContent>
                {MOCK_BRANCHES.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.branchOffice && <p className="text-[11px] text-destructive">{errors.branchOffice.message}</p>}
          </div>

          {/* Consol Operator */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Consol Operator</Label>
            <Input {...register('consolOperator')} readOnly className="bg-muted/50" />
          </div>

          {/* Carrier */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Carrier / Shipping Line <span className="text-destructive">*</span></Label>
            <Select onValueChange={(v) => setValue('carrier', v, { shouldValidate: true })}>
              <SelectTrigger><SelectValue placeholder="Select carrier" /></SelectTrigger>
              <SelectContent>
                {MOCK_CARRIERS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.carrier && <p className="text-[11px] text-destructive">{errors.carrier.message}</p>}
          </div>

          {/* Consol Status */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Status</Label>
            <Input value={watch('consolStatus') || 'Draft'} readOnly className="bg-muted/50" />
          </div>

          {/* Service Type */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Service Type</Label>
            <Select value={serviceType} onValueChange={(v) => setValue('serviceType', v as any)}>
              <SelectTrigger><SelectValue placeholder="Select service" /></SelectTrigger>
              <SelectContent>
                {CONSOL_SERVICE_TYPES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Sales Person */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Sales Person</Label>
            <Select onValueChange={(v) => setValue('salesPerson', v)}>
              <SelectTrigger><SelectValue placeholder="Select sales person" /></SelectTrigger>
              <SelectContent>
                {MOCK_SALES_PERSONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
