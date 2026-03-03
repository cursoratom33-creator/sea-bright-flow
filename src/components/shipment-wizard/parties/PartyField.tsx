import { useState, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator } from '@/components/ui/command';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, MapPin, ChevronsUpDown, Check, Phone, Mail, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ShipmentFormData } from '@/types/shipment-form.types';

interface PartyAddress {
  id: string;
  label: string;
  address: string;
  contactNumber: string;
  email: string;
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
      { id: 'A001', label: 'Head Office', address: '12 Marine Drive, Mumbai 400001, India', contactNumber: '+91 22 2281 1234', email: 'headoffice@abcexports.in' },
      { id: 'A002', label: 'Branch Office', address: '56 MG Road, Pune 411001, India', contactNumber: '+91 20 2553 5678', email: 'pune@abcexports.in' },
      { id: 'A003', label: 'Warehouse', address: 'Plot 7, JNPT SEZ, Navi Mumbai 400707, India', contactNumber: '+91 22 2724 9012', email: 'warehouse@abcexports.in' },
    ],
  },
  {
    id: 'P002', name: 'Global Traders LLC.',
    addresses: [
      { id: 'A004', label: 'Main Office', address: '45 Sheikh Zayed Rd, Dubai, UAE', contactNumber: '+971 4 321 4567', email: 'info@globaltraders.ae' },
      { id: 'A005', label: 'Free Zone', address: 'Jebel Ali Free Zone, Dubai, UAE', contactNumber: '+971 4 881 2345', email: 'freezone@globaltraders.ae' },
    ],
  },
  {
    id: 'P003', name: 'Pacific Imports Inc.',
    addresses: [
      { id: 'A006', label: 'Headquarters', address: '890 Harbor Blvd, Long Beach, CA 90802, USA', contactNumber: '+1 562 435 7890', email: 'hq@pacificimports.com' },
      { id: 'A007', label: 'East Coast', address: '200 Port Newark Blvd, Newark, NJ 07114, USA', contactNumber: '+1 973 522 3456', email: 'eastcoast@pacificimports.com' },
    ],
  },
  {
    id: 'P004', name: 'Euro Freight GmbH',
    addresses: [
      { id: 'A008', label: 'Head Office', address: 'Hafenstr. 22, 20457 Hamburg, Germany', contactNumber: '+49 40 3012 5678', email: 'info@eurofreight.de' },
    ],
  },
  {
    id: 'P005', name: 'Silk Road Trading Co.',
    addresses: [
      { id: 'A009', label: 'Shanghai Office', address: '168 Pudong Ave, Shanghai 200120, China', contactNumber: '+86 21 5888 1234', email: 'shanghai@silkroadtrading.cn' },
      { id: 'A010', label: 'Shenzhen Office', address: '88 Nanhai Blvd, Shenzhen 518000, China', contactNumber: '+86 755 2688 5678', email: 'shenzhen@silkroadtrading.cn' },
    ],
  },
];
interface PartyFieldProps {
  name: keyof ShipmentFormData;
  idName: keyof ShipmentFormData;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  required?: boolean;
  hideAddress?: boolean;
  showGst?: boolean;
  gstFieldName?: keyof ShipmentFormData;
}

export default function PartyField({ name, idName, label, icon: Icon, required = false, hideAddress = false, showGst = false, gstFieldName }: PartyFieldProps) {
  const { control, setValue, watch } = useFormContext<ShipmentFormData>();
  const currentName = watch(name);
  const matchedParty = MOCK_PARTIES.find((p) => p.name === currentName);

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showAddPartyDialog, setShowAddPartyDialog] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newContactNumber, setNewContactNumber] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPartyName, setNewPartyName] = useState('');
  const [newPartyAddress, setNewPartyAddress] = useState('');
  const [newPartyContact, setNewPartyContact] = useState('');
  const [newPartyEmail, setNewPartyEmail] = useState('');
  const [customParties, setCustomParties] = useState<MockParty[]>([]);
  const [customAddresses, setCustomAddresses] = useState<PartyAddress[]>([]);

  const allParties = useMemo(() => [...MOCK_PARTIES, ...customParties], [customParties]);

  const allAddresses = matchedParty
    ? [...matchedParty.addresses, ...customAddresses.filter(ca => ca.id.startsWith(matchedParty.id))]
    : (() => {
        const customMatch = customParties.find(p => p.name === currentName);
        return customMatch ? [...customMatch.addresses, ...customAddresses.filter(ca => ca.id.startsWith(customMatch.id))] : [];
      })();

  const selectedAddress = allAddresses.find(a => a.id === selectedAddressId) || allAddresses[0];

  const activeParty = matchedParty || customParties.find(p => p.name === currentName);

  const filteredParties = useMemo(() => {
    if (!searchQuery) return allParties;
    return allParties.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, allParties]);

  const handleSelectParty = (party: MockParty) => {
    setValue(name, party.name as never);
    setValue(idName, party.id as never);
    setSelectedAddressId(party.addresses[0]?.id || '');
    setOpen(false);
    setSearchQuery('');
  };

  const handleAddParty = () => {
    if (!newPartyName.trim()) return;
    const newId = `P-custom-${Date.now()}`;
    const newParty: MockParty = {
      id: newId,
      name: newPartyName.trim(),
      addresses: newPartyAddress.trim()
        ? [{ id: `${newId}-A001`, label: 'Main Office', address: newPartyAddress.trim(), contactNumber: newPartyContact.trim(), email: newPartyEmail.trim() }]
        : [],
    };
    setCustomParties(prev => [...prev, newParty]);
    setValue(name, newParty.name as never);
    setValue(idName, newParty.id as never);
    setSelectedAddressId(newParty.addresses[0]?.id || '');
    setNewPartyName('');
    setNewPartyAddress('');
    setNewPartyContact('');
    setNewPartyEmail('');
    setShowAddPartyDialog(false);
  };

  const handleAddAddress = () => {
    if (!newLabel.trim() || !newAddress.trim() || !activeParty) return;
    const newId = `${activeParty.id}-custom-${Date.now()}`;
    setCustomAddresses(prev => [...prev, { id: newId, label: newLabel.trim(), address: newAddress.trim(), contactNumber: newContactNumber.trim(), email: newEmail.trim() }]);
    setSelectedAddressId(newId);
    setNewLabel('');
    setNewAddress('');
    setNewContactNumber('');
    setNewEmail('');
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
        render={() => (
          <FormItem>
            <FormControl>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between h-10 font-normal text-sm"
                  >
                    <span className={cn(!currentName && "text-muted-foreground")}>
                      {currentName ? String(currentName) : `Search ${label.toLowerCase()}...`}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder={`Search ${label.toLowerCase()}...`}
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                    />
                    <CommandList>
                      {filteredParties.length === 0 && (
                        <CommandEmpty className="py-3 text-center text-sm text-muted-foreground">
                          No company found.
                        </CommandEmpty>
                      )}
                      <CommandGroup>
                        {filteredParties.map((party) => (
                          <CommandItem
                            key={party.id}
                            value={party.id}
                            onSelect={() => handleSelectParty(party)}
                            className="cursor-pointer"
                          >
                            <Check className={cn("mr-2 h-4 w-4", currentName === party.name ? "opacity-100" : "opacity-0")} />
                            {party.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                      <CommandSeparator />
                      <CommandGroup>
                        <CommandItem
                          onSelect={() => {
                            setNewPartyName(searchQuery);
                            setShowAddPartyDialog(true);
                            setOpen(false);
                            setSearchQuery('');
                          }}
                          className="cursor-pointer text-primary"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add New Company{searchQuery ? `: "${searchQuery}"` : ''}
                        </CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {!hideAddress && activeParty && allAddresses.length > 0 && (
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
                <div className="border-t border-border mt-1 pt-1 px-1">
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-xs text-primary hover:bg-accent cursor-pointer"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setShowAddDialog(true);
                    }}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add New Address
                  </button>
                </div>
              </SelectContent>
            </Select>
          </div>
          {selectedAddress && (
            <div className="space-y-1 pl-1">
              <p className="text-xs text-muted-foreground">{selectedAddress.address}</p>
              {selectedAddress.contactNumber && (
                <div className="flex items-center gap-1.5">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{selectedAddress.contactNumber}</span>
                </div>
              )}
              {selectedAddress.email && (
                <div className="flex items-center gap-1.5">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{selectedAddress.email}</span>
                </div>
              )}
            </div>
      )}

      {showGst && gstFieldName && activeParty && (
        <div className="mt-3">
          <FormField
            control={control}
            name={gstFieldName}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-muted-foreground">GST Number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 27AABCU9603R1ZM" {...field} value={typeof field.value === 'string' ? field.value : ''} className="h-8 text-xs" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      )}
        </div>
      )}

      {/* Add Address Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Add New Address — {activeParty?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <FormLabel className="text-xs">Label</FormLabel>
              <Input placeholder="e.g. Warehouse, Branch Office" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} className="mt-1" />
            </div>
            <div>
              <FormLabel className="text-xs">Full Address</FormLabel>
              <Input placeholder="Street, City, ZIP, Country" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} className="mt-1" />
            </div>
            <div>
              <FormLabel className="text-xs">Contact Number</FormLabel>
              <Input placeholder="e.g. +91 22 1234 5678" value={newContactNumber} onChange={(e) => setNewContactNumber(e.target.value)} className="mt-1" />
            </div>
            <div>
              <FormLabel className="text-xs">Email</FormLabel>
              <Input placeholder="e.g. office@company.com" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button type="button" size="sm" onClick={handleAddAddress} disabled={!newLabel.trim() || !newAddress.trim()}>Add Address</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Party Dialog */}
      <Dialog open={showAddPartyDialog} onOpenChange={setShowAddPartyDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Add New Company</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <FormLabel className="text-xs">Company Name</FormLabel>
              <Input placeholder="e.g. Acme Corp" value={newPartyName} onChange={(e) => setNewPartyName(e.target.value)} className="mt-1" />
            </div>
            <div>
              <FormLabel className="text-xs">Address (optional)</FormLabel>
              <Input placeholder="Street, City, ZIP, Country" value={newPartyAddress} onChange={(e) => setNewPartyAddress(e.target.value)} className="mt-1" />
            </div>
            <div>
              <FormLabel className="text-xs">Contact Number (optional)</FormLabel>
              <Input placeholder="e.g. +1 555 123 4567" value={newPartyContact} onChange={(e) => setNewPartyContact(e.target.value)} className="mt-1" />
            </div>
            <div>
              <FormLabel className="text-xs">Email (optional)</FormLabel>
              <Input placeholder="e.g. info@company.com" value={newPartyEmail} onChange={(e) => setNewPartyEmail(e.target.value)} className="mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowAddPartyDialog(false)}>Cancel</Button>
            <Button type="button" size="sm" onClick={handleAddParty} disabled={!newPartyName.trim()}>Add Company</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
