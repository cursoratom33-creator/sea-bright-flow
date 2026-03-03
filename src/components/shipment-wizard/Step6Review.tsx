import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, CheckCircle2 } from 'lucide-react';
import { BL_TYPES, type ShipmentFormData } from '@/types/shipment-form.types';
import { useEffect } from 'react';

export default function Step6Review() {
  const { control, watch, setValue } = useFormContext<ShipmentFormData>();
  const blType = watch('blType');
  const hblRequired = watch('hblRequired');
  const mblRequired = watch('mblRequired');
  const originalBLCount = watch('originalBLCount') || 0;
  const nonNegotiableBLCount = watch('nonNegotiableBLCount') || 0;
  const totalCopies = originalBLCount + nonNegotiableBLCount;

  // Reset values when MBL is selected
  useEffect(() => {
    if (mblRequired) {
      setValue('hblRequired', false);
      setValue('originalBLCount', 0);
      setValue('nonNegotiableBLCount', 0);
    }
  }, [mblRequired, setValue]);

  // Reset values when HBL is deselected
  useEffect(() => {
    if (!hblRequired) {
      setValue('originalBLCount', 0);
      setValue('nonNegotiableBLCount', 0);
    }
  }, [hblRequired, setValue]);

  // Reset when HBL is selected
  useEffect(() => {
    if (hblRequired) {
      setValue('mblRequired', false);
      setValue('telexRelease', false);
    }
  }, [hblRequired, setValue]);

  const isDirectMasterBL = blType === 'Direct Master B/L';

  return (
    <div className="space-y-6">
      {/* Document Options */}
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

          {/* Direct Master B/L: Show HBL / MBL toggles */}
          {isDirectMasterBL && (
            <div className="space-y-4 border-t border-border pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={control} name="hblRequired" render={({ field }) =>
                  <FormItem className="flex items-center gap-3">
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <Label>HBL Required</Label>
                  </FormItem>
                } />
                <FormField control={control} name="mblRequired" render={({ field }) =>
                  <FormItem className="flex items-center gap-3">
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <Label>MBL Required</Label>
                  </FormItem>
                } />
              </div>

              {/* MBL Selected → Sea Way Bill */}
              {mblRequired && (
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    Sea Way Bill
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Master B/L will be issued as a Sea Way Bill.</p>
                </div>
              )}

              {/* HBL Selected → Original with B/L counts */}
              {hblRequired && (
                <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    Original
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={control} name="originalBLCount" render={({ field }) =>
                      <FormItem>
                        <FormLabel>Original B/L Count <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            max={3}
                            className="w-full"
                            {...field}
                            onChange={(e) => field.onChange(Math.min(3, Math.max(0, Number(e.target.value))))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    } />
                    <FormField control={control} name="nonNegotiableBLCount" render={({ field }) =>
                      <FormItem>
                        <FormLabel>Non-Negotiable B/L Count <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            max={3}
                            className="w-full"
                            {...field}
                            onChange={(e) => field.onChange(Math.min(3, Math.max(0, Number(e.target.value))))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    } />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
