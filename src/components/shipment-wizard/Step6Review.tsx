import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, CalendarIcon } from 'lucide-react';
import { BL_TYPES, type ShipmentFormData } from '@/types/shipment-form.types';

export default function Step6Review() {
  const { control, watch, setValue, register } = useFormContext<ShipmentFormData>();
  const blType = watch('blType');
  const telexRelease = watch('telexRelease');
  const originalBLCount = watch('originalBLCount') || 0;
  const nonNegotiableBLCount = watch('nonNegotiableBLCount') || 0;

  const isDirectMasterBL = blType === 'Direct Master B/L';

  // Track HBL type with local state, initialized from form values
  const [hblType, setHblType] = useState<string>(() => {
    if (telexRelease) return 'swb';
    if (originalBLCount > 0 || nonNegotiableBLCount > 0) return 'original';
    return '';
  });

  const handleHblTypeChange = (value: string) => {
    setHblType(value);
    if (value === 'swb') {
      setValue('telexRelease', true);
      setValue('originalBLCount', 0);
      setValue('nonNegotiableBLCount', 0);
    } else if (value === 'original') {
      setValue('telexRelease', false);
    }
  };

  // Auto-enable HBL when Direct Master B/L is selected
  useEffect(() => {
    if (isDirectMasterBL) {
      setValue('hblRequired', true);
      setValue('mblRequired', false);
    }
  }, [isDirectMasterBL, setValue]);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-1">5. Documents & Review</h2>
        <p className="text-sm text-muted-foreground mb-6">Set document preferences and review your shipment</p>

        <div className="space-y-6">
          {/* B/L Type Selection */}
          <FormField control={control} name="blType" render={({ field }) =>
          <FormItem>
              <FormLabel>Bill of Lading Type <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} value={field.value} className="space-y-2 mt-2">
                  {BL_TYPES.map((t) =>
                <div key={t} className="flex items-center gap-2">
                      <RadioGroupItem value={t} id={`bl-${t}`} />
                      <Label htmlFor={`bl-${t}`} className="cursor-pointer text-sm">{t}</Label>
                    </div>
                )}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          } />

          {/* Direct Master B/L → HBL is mandatory, choose HBL Type */}
          {isDirectMasterBL &&
          <div className="space-y-4 border-t border-border pt-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <CheckCircle2 className="h-4 w-4 text-accent" />
                HBL Required (mandatory for Direct Master B/L)
              </div>

              {/* HBL Type: Sea Way Bill or Original */}
              <FormItem>
                <FormLabel>HBL Type <span className="text-destructive">*</span></FormLabel>
                <RadioGroup onValueChange={handleHblTypeChange} value={hblType} className="space-y-2 mt-2">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="swb" id="hbl-type-swb" />
                    <Label htmlFor="hbl-type-swb" className="cursor-pointer text-sm">Seaway Bill</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="original" id="hbl-type-original" />
                    <Label htmlFor="hbl-type-original" className="cursor-pointer text-sm">Original</Label>
                  </div>
                </RadioGroup>
              </FormItem>

              {/* Sea Way Bill info */}
              {hblType === 'swb' &&
            <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    Seaway Bill
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">HBL will be issued as a Seaway Bill.</p>
                </div>
            }

              {/* Original → enter copy counts */}
              {hblType === 'original' &&
            <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    Original
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={control} name="originalBLCount" render={({ field }) =>
                <FormItem>
                        <FormLabel>No. of Original Copies <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input
                      type="number"
                      min={0}
                      max={3}
                      className="w-full"
                      {...field}
                      onChange={(e) => field.onChange(Math.min(3, Math.max(0, Number(e.target.value))))} />
                    
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                } />
                    <FormField control={control} name="nonNegotiableBLCount" render={({ field }) =>
                <FormItem>
                        <FormLabel>No. of Negotiable Copies <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input
                      type="number"
                      min={0}
                      max={3}
                      className="w-full"
                      {...field}
                      onChange={(e) => field.onChange(Math.min(3, Math.max(0, Number(e.target.value))))} />
                    
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                } />
                  </div>
                </div>
            }
            </div>
          }

          {/* Place of Issue & Issue Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Place of Issue</Label>
              <Input {...register('placeOfIssue')} placeholder="Place of issue" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Issue Date</Label>
              <Input type="date" {...register('issueDate')} />
            </div>
          </div>
        </div>
      </div>
    </div>);

}