import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Calendar, Anchor } from 'lucide-react';
import type { ShipmentFormData } from '@/types/shipment-form.types';

const MOCK_PORTS = [
  'CNSHA - Shanghai', 'CNNGB - Ningbo', 'SGSIN - Singapore',
  'AEJEA - Jebel Ali', 'USLAX - Los Angeles', 'USNYC - New York',
  'GBFXT - Felixstowe', 'DEHAM - Hamburg', 'NLRTM - Rotterdam',
  'INMUN - Mumbai JNPT', 'INNSA - Nhava Sheva', 'JPYOK - Yokohama',
  'KRPUS - Busan',
];

const MOCK_CARRIERS = [
  'Maersk Line', 'MSC', 'CMA CGM', 'COSCO', 'Hapag-Lloyd',
  'ONE', 'Evergreen', 'Yang Ming', 'HMM', 'ZIM',
];

export default function Step3Routing() {
  const { control } = useFormContext<ShipmentFormData>();

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-1">3. Routing & Schedule</h2>
        <p className="text-sm text-muted-foreground mb-6">Define ports, vessel, and schedule details</p>

        {/* Ports */}
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Ports</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <FormField
            control={control}
            name="placeOfReceipt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Place of Receipt</FormLabel>
                <FormControl><Input placeholder="e.g. Factory, City" {...field} value={typeof field.value === 'string' ? field.value : ''} list="ports-list" /></FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="portOfLoading"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Port of Loading <span className="text-destructive">*</span></FormLabel>
                <FormControl><Input placeholder="Search POL..." {...field} value={typeof field.value === 'string' ? field.value : ''} list="ports-list" /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="portOfDischarge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Port of Discharge <span className="text-destructive">*</span></FormLabel>
                <FormControl><Input placeholder="Search POD..." {...field} value={typeof field.value === 'string' ? field.value : ''} list="ports-list" /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="finalDestination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Final Destination</FormLabel>
                <FormControl><Input placeholder="e.g. Mumbai, India" {...field} value={typeof field.value === 'string' ? field.value : ''} /></FormControl>
              </FormItem>
            )}
          />
        </div>

        <datalist id="ports-list">
          {MOCK_PORTS.map((p) => <option key={p} value={p} />)}
        </datalist>

        {/* Schedule */}
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Schedule</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <FormField
            control={control}
            name="etd"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ETD</FormLabel>
                <FormControl><Input type="date" {...field} value={typeof field.value === 'string' ? field.value : ''} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="eta"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ETA <span className="text-destructive">*</span></FormLabel>
                <FormControl><Input type="date" {...field} value={typeof field.value === 'string' ? field.value : ''} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="cutOffDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cut-off Date</FormLabel>
                <FormControl><Input type="date" {...field} value={typeof field.value === 'string' ? field.value : ''} /></FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Vessel & Carrier */}
        <div className="flex items-center gap-2 mb-4">
          <Anchor className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Vessel & Carrier</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={control}
            name="carrier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Carrier <span className="text-destructive">*</span></FormLabel>
                <FormControl><Input placeholder="Search carrier..." {...field} value={typeof field.value === 'string' ? field.value : ''} list="carriers-list" /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="vesselName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vessel Name</FormLabel>
                <FormControl><Input placeholder="e.g. ML-2506" {...field} value={typeof field.value === 'string' ? field.value : ''} /></FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="voyageNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Voyage No</FormLabel>
                <FormControl><Input placeholder="e.g. V.126S" {...field} value={typeof field.value === 'string' ? field.value : ''} /></FormControl>
              </FormItem>
            )}
          />
        </div>

        <datalist id="carriers-list">
          {MOCK_CARRIERS.map((c) => <option key={c} value={c} />)}
        </datalist>
      </div>
    </div>
  );
}
