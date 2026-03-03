import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Users, Building2, UserCheck, Briefcase, Plus, MapPin } from 'lucide-react';
import type { ShipmentFormData } from '@/types/shipment-form.types';

interface PartyAddress {
  id: string;
  label: string;
  address: string;
}

interface MockParty {
  id: string;
  name: string;
  addresses: PartyAddress[];
}

const MOCK_PARTIES: MockParty[] = [
  {
    id: 'P001', name: 'ABC Exports Ltd.',
    addresses: [
      { id: 'A001', label: 'Head Office', address: '12 Marine Drive, Mumbai 400001, India' },
      { id: 'A002', label: 'Branch Office', address: '56 MG Road, Pune 411001, India' },
      { id: 'A003', label: 'Warehouse', address: 'Plot 7, JNPT SEZ, Navi Mumbai 400707, India' },
    ],
  },
  {
    id: 'P002', name: 'Global Traders LLC.',
    addresses: [
      { id: 'A004', label: 'Main Office', address: '45 Sheikh Zayed Rd, Dubai, UAE' },
      { id: 'A005', label: 'Free Zone', address: 'Jebel Ali Free Zone, Dubai, UAE' },
    ],
  },
  {
    id: 'P003', name: 'Pacific Imports Inc.',
    addresses: [
      { id: 'A006', label: 'Headquarters', address: '890 Harbor Blvd, Long Beach, CA 90802, USA' },
      { id: 'A007', label: 'East Coast', address: '200 Port Newark Blvd, Newark, NJ 07114, USA' },
    ],
  },
  {
    id: 'P004', name: 'Euro Freight GmbH',
    addresses: [
      { id: 'A008', label: 'Head Office', address: 'Hafenstr. 22, 20457 Hamburg, Germany' },
    ],
  },
  {
    id: 'P005', name: 'Silk Road Trading Co.',
    addresses: [
      { id: 'A009', label: 'Shanghai Office', address: '168 Pudong Ave, Shanghai 200120, China' },
      { id: 'A010', label: 'Shenzhen Office', address: '88 Nanhai Blvd, Shenzhen 518000, China' },
    ],
  },
];

function PartyField({ name, idName, label, icon: Icon, required = false }: {
  name: keyof ShipmentFormData;
  idName: keyof ShipmentFormData;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  required?: boolean;
}) {
  const { control, setValue, watch } = useFormContext<ShipmentFormData>();
  const currentName = watch(name);
  const matchedParty = MOCK_PARTIES.find((p) => p.name === currentName);

  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [customAddresses, setCustomAddresses] = useState<PartyAddress[]>([]);

  const allAddresses = matchedParty
    ? [...matchedParty.addresses, ...customAddresses.filter(ca => ca.id.startsWith(matchedParty.id))]
    : [];

  // Auto-select first address when party changes
  const selectedAddress = allAddresses.find(a => a.id === selectedAddressId) || allAddresses[0];

  const handleAddAddress = () => {
    if (!newLabel.trim() || !newAddress.trim() || !matchedParty) return;
    const newId = `${matchedParty.id}-custom-${Date.now()}`;
    setCustomAddresses(prev => [...prev, { id: newId, label: newLabel.trim(), address: newAddress.trim() }]);
    setSelectedAddressId(newId);
    setNewLabel('');
    setNewAddress('');
    setShowAddDialog(false);
  };

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
                  if (match) {
                    setValue(idName, match.id as never);
                    setSelectedAddressId(match.addresses[0]?.id || '');
                  }
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

      {matchedParty && allAddresses.length > 0 && (
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Address</span>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={selectedAddress?.id || ''}
              onValueChange={(val) => setSelectedAddressId(val)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select address" />
              </SelectTrigger>
              <SelectContent>
                {allAddresses.map((addr) => (
                  <SelectItem key={addr.id} value={addr.id} className="text-xs">
                    <span className="font-medium">{addr.label}</span>
                    <span className="text-muted-foreground ml-1">— {addr.address}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => setShowAddDialog(true)}
              title="Add new address"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
          {selectedAddress && (
            <p className="text-xs text-muted-foreground pl-1">{selectedAddress.address}</p>
          )}
        </div>
      )}

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Add New Address — {matchedParty?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <FormLabel className="text-xs">Label</FormLabel>
              <Input
                placeholder="e.g. Warehouse, Branch Office"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <FormLabel className="text-xs">Full Address</FormLabel>
              <Input
                placeholder="Street, City, ZIP, Country"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button type="button" size="sm" onClick={handleAddAddress} disabled={!newLabel.trim() || !newAddress.trim()}>
              Add Address
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
