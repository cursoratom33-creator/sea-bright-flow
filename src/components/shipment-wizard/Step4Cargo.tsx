import { useFormContext, useFieldArray } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Package, Container, Info } from 'lucide-react';
import { CONTAINER_TYPES_OPTIONS, PACKAGE_TYPES, DIMENSION_UNITS, type ShipmentFormData } from '@/types/shipment-form.types';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import FclCargoSection from './cargo/FclCargoSection';
import LclCargoSection from './cargo/LclCargoSection';

export default function Step4Cargo() {
  const { control, watch } = useFormContext<ShipmentFormData>();
  const shipmentType = watch('shipmentType');

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-1">4. Cargo Details</h2>
        <p className="text-sm text-muted-foreground mb-6">
          {shipmentType === 'FCL' ? 'Container and cargo information' : 'Package and cargo information'}
        </p>

        {shipmentType === 'FCL' ? (
          <FclCargoSection />
        ) : (
          <LclCargoSection />
        )}
      </div>
    </div>
  );
}
