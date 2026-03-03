import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Save, Send, Ship, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { WIZARD_STEPS, shipmentFormSchema, type ShipmentFormData } from '@/types/shipment-form.types';
import Step1ShipmentType from '@/components/shipment-wizard/Step1ShipmentType';
import Step2Parties from '@/components/shipment-wizard/Step2Parties';
import Step3Routing from '@/components/shipment-wizard/Step3Routing';
import Step4Cargo from '@/components/shipment-wizard/Step4Cargo';
import Step5Charges from '@/components/shipment-wizard/Step5Charges';
import Step6Review from '@/components/shipment-wizard/Step6Review';
import ShipmentSummary from '@/components/shipment-wizard/ShipmentSummary';

const stepFieldMap: Record<number, string[]> = {
  1: ['shipmentType', 'movementType', 'shipmentMode', 'incoterm', 'freightTerm'],
  2: ['shipperId', 'shipperName', 'consigneeId', 'consigneeName', 'bookingNo'],
  3: ['portOfLoading', 'portOfDischarge', 'etd', 'eta', 'carrier'],
  4: ['fclCargo', 'lclCargo'],
  5: ['currency', 'charges'],
  6: ['blType'],
};

function generateShipmentNumber() {
  const year = new Date().getFullYear();
  const seq = String(Math.floor(Math.random() * 99999) + 1).padStart(5, '0');
  return `SE-${year}-${seq}`;
}

export default function NewShipmentPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [shipmentNumber] = useState(generateShipmentNumber);

  const methods = useForm<ShipmentFormData>({
    resolver: zodResolver(shipmentFormSchema),
    mode: 'onChange',
    defaultValues: {
      shipmentType: undefined,
      movementType: undefined,
      shipmentMode: 'Sea Export',
      serviceType: 'Direct',
      incoterm: undefined,
      freightTerm: undefined,
      shipperId: '', shipperName: '',
      consigneeId: '', consigneeName: '',
      notifyPartyId: '', notifyPartyName: '',
      forwardingAgentId: '', forwardingAgentName: '',
      customsBrokerId: '', customsBrokerName: '',
      salesPerson: '', customerRefNo: '', bookingNo: '', contractNo: '',
      placeOfReceipt: '', portOfLoading: '', portOfDischarge: '',
      finalDestination: '', vesselName: '', voyageNo: '',
      etd: '', eta: '', cutOffDate: '', carrier: '',
      fclCargo: [{ containerType: '20GP', numberOfContainers: 1, grossWeight: 0, cbm: 0, commodity: '', hsCode: '', isDangerous: false, unNumber: '', imoClass: '' }],
      lclCargo: [{ numberOfPackages: 1, packageType: undefined, grossWeight: 0, netWeight: 0, volume: 0, commodity: '', marksAndNumbers: '', isStackable: true }],
      currency: 'USD', exchangeRate: 1,
      charges: [],
      blType: undefined, hblRequired: false, mblRequired: true, telexRelease: false, originalBLCount: 3,
    },
  });

  const { trigger, getValues, formState: { errors } } = methods;

  // Auto-save draft every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      const data = getValues();
      localStorage.setItem('shipment_draft', JSON.stringify(data));
    }, 30000);
    return () => clearInterval(interval);
  }, [getValues]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('shipment_draft');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        methods.reset(parsed);
      } catch { /* ignore */ }
    }
  }, [methods]);

  const handleNext = useCallback(async () => {
    const fields = stepFieldMap[currentStep] as Array<keyof ShipmentFormData>;
    const valid = await trigger(fields);
    if (valid) setCurrentStep((s) => Math.min(s + 1, 6));
  }, [currentStep, trigger]);

  const handlePrev = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const handleSaveDraft = () => {
    const data = getValues();
    localStorage.setItem('shipment_draft', JSON.stringify(data));
    toast.success('Draft saved successfully');
  };

  const onSubmit = (data: ShipmentFormData) => {
    const payload = { ...data, shipmentNumber, status: 'confirmed' };
    console.log('Shipment payload:', payload);
    localStorage.removeItem('shipment_draft');
    toast.success(`Shipment ${shipmentNumber} created successfully!`);
    navigate('/shipments');
  };

  const completedSteps = Array.from({ length: 6 }, (_, i) => {
    const fields = stepFieldMap[i + 1] as Array<keyof ShipmentFormData>;
    return fields.every((f) => {
      const val = getValues(f);
      return val !== undefined && val !== '' && val !== null;
    });
  });

  const progressPercent = Math.round(
    (completedSteps.filter(Boolean).length / 6) * 100
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button type="button" variant="ghost" size="icon" onClick={() => navigate('/shipments')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Create New Shipment</h1>
              <p className="text-sm text-muted-foreground font-mono">{shipmentNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={handleSaveDraft}>
              <Save className="mr-1.5 h-4 w-4" /> Save Draft
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => navigate('/shipments')}>
              <X className="mr-1.5 h-4 w-4" /> Cancel
            </Button>
            {currentStep === 6 && (
              <Button type="submit" size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Send className="mr-1.5 h-4 w-4" /> Create Shipment
              </Button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            {WIZARD_STEPS.map((step) => (
              <button
                key={step.id}
                type="button"
                onClick={() => setCurrentStep(step.id)}
                className={cn(
                  'flex items-center gap-2 text-sm font-medium transition-colors',
                  currentStep === step.id
                    ? 'text-primary'
                    : completedSteps[step.id - 1]
                    ? 'text-accent'
                    : 'text-muted-foreground'
                )}
              >
                <span
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold border-2 transition-all',
                    currentStep === step.id
                      ? 'border-primary bg-primary text-primary-foreground'
                      : completedSteps[step.id - 1]
                      ? 'border-accent bg-accent text-accent-foreground'
                      : 'border-border bg-background text-muted-foreground'
                  )}
                >
                  {step.id}
                </span>
                <span className="hidden lg:inline">{step.title}</span>
              </button>
            ))}
          </div>
          <div className="h-2 w-full rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-accent transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">Completion: {progressPercent}%</p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3">
            {currentStep === 1 && <Step1ShipmentType />}
            {currentStep === 2 && <Step2Parties />}
            {currentStep === 3 && <Step3Routing />}
            {currentStep === 4 && <Step4Cargo />}
            {currentStep === 5 && <Step5Charges />}
            {currentStep === 6 && <Step6Review />}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <Button type="button" variant="outline" onClick={handlePrev} disabled={currentStep === 1}>
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Previous
              </Button>
              {currentStep < 6 ? (
                <Button type="button" onClick={handleNext}>
                  Next <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Ship className="mr-1.5 h-4 w-4" /> Create Shipment
                </Button>
              )}
            </div>
          </div>

          {/* Sticky Summary Sidebar */}
          <div className="hidden xl:block">
            <div className="sticky top-24">
              <ShipmentSummary currentStep={currentStep} />
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
