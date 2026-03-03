import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Users, Building2, UserCheck, Briefcase, Receipt } from 'lucide-react';
import type { ShipmentFormData } from '@/types/shipment-form.types';
import PartyField from './parties/PartyField';

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
          <PartyField name="customsBrokerName" idName="customsBrokerId" label="CHA / Customs Broker" icon={Briefcase} hideAddress />
          <PartyField name="billToName" idName="billToId" label="Bill To" icon={Receipt} />
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
