import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Users, Building2, UserCheck, Briefcase } from 'lucide-react';
import type { ShipmentFormData } from '@/types/shipment-form.types';

const MOCK_PARTIES = [
  { id: 'P001', name: 'ABC Exports Ltd.' },
  { id: 'P002', name: 'Global Traders LLC.' },
  { id: 'P003', name: 'Pacific Imports Inc.' },
  { id: 'P004', name: 'Euro Freight GmbH' },
  { id: 'P005', name: 'Silk Road Trading Co.' },
];

function PartyField({ name, idName, label, icon: Icon, required = false }: {
  name: keyof ShipmentFormData;
  idName: keyof ShipmentFormData;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  required?: boolean;
}) {
  const { control, setValue } = useFormContext<ShipmentFormData>();

  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">{label} {required && <span className="text-destructive">*</span>}</span>
      </div>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                placeholder={`Search ${label.toLowerCase()}...`}
                {...field}
                value={typeof field.value === 'string' ? field.value : ''}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  const match = MOCK_PARTIES.find((p) => p.name.toLowerCase().includes(e.target.value.toLowerCase()));
                  if (match) setValue(idName, match.id as never);
                }}
                list={`${String(name)}-options`}
              />
            </FormControl>
            <datalist id={`${String(name)}-options`}>
              {MOCK_PARTIES.map((p) => <option key={p.id} value={p.name} />)}
            </datalist>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

export default function Step2Parties() {
  const { control, watch } = useFormContext<ShipmentFormData>();
  const shipmentType = watch('shipmentType');

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-1">2. Customer & Parties</h2>
        <p className="text-sm text-muted-foreground mb-6">Select the parties involved in this shipment</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PartyField name="shipperName" idName="shipperId" label="Shipper" icon={Building2} required />
          <PartyField name="consigneeName" idName="consigneeId" label="Consignee" icon={Users} required />
          <PartyField name="notifyPartyName" idName="notifyPartyId" label="Notify Party" icon={UserCheck} />
          <PartyField name="forwardingAgentName" idName="forwardingAgentId" label="Forwarding Agent" icon={Briefcase} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <PartyField name="customsBrokerName" idName="customsBrokerId" label="CHA / Customs Broker" icon={Briefcase} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 mt-6">
          <FormField
            control={control}
            name="salesPerson"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sales Person</FormLabel>
                <FormControl><Input placeholder="Auto-fill" {...field} value={typeof field.value === 'string' ? field.value : ''} /></FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="customerRefNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Reference No</FormLabel>
                <FormControl><Input placeholder="e.g. PO-12345" {...field} value={typeof field.value === 'string' ? field.value : ''} /></FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="bookingNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Booking No {shipmentType === 'FCL' && <span className="text-destructive">*</span>}</FormLabel>
                <FormControl><Input placeholder="Booking number" {...field} value={typeof field.value === 'string' ? field.value : ''} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="contractNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contract No</FormLabel>
                <FormControl><Input placeholder="Optional" {...field} value={typeof field.value === 'string' ? field.value : ''} /></FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
