import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, X, Ship, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { consolFormSchema, type ConsolFormData, CONSOL_WIZARD_STEPS, CONTAINER_CAPACITY } from '@/types/consol-form.types';
import ConsolStep1Info from '@/components/consol-wizard/ConsolStep1Info';
import ConsolStep2Routing from '@/components/consol-wizard/ConsolStep2Routing';
import ConsolStep3Container from '@/components/consol-wizard/ConsolStep3Container';
import ConsolStep4Shipments from '@/components/consol-wizard/ConsolStep4Shipments';
import ConsolStep5Charges from '@/components/consol-wizard/ConsolStep5Charges';
import ConsolStep6Review from '@/components/consol-wizard/ConsolStep6Review';
import ConsolSummary from '@/components/consol-wizard/ConsolSummary';

function generateConsolNumber() {
  const year = new Date().getFullYear();
  const seq = String(Math.floor(Math.random() * 99999) + 1).padStart(5, '0');
  return `CONS-${year}-${seq}`;
}

export default function NewConsolPage() {
  const navigate = useNavigate();
  const [consolNumber] = useState(generateConsolNumber);
  const [currentStep, setCurrentStep] = useState(1);

  const methods = useForm<ConsolFormData>({
    resolver: zodResolver(consolFormSchema),
    mode: 'onChange',
    defaultValues: {
      consolType: undefined,
      consolNumber,
      branchOffice: '',
      consolOperator: 'Current User',
      carrier: '',
      consolStatus: 'Draft',
      serviceType: undefined,
      salesPerson: '',
      portOfLoading: '',
      portOfDischarge: '',
      finalDestination: '',
      placeOfReceipt: '',
      vesselName: '',
      voyageNo: '',
      etd: '',
      eta: '',
      cutOffDate: '',
      carrierBookingNo: '',
      containerType: undefined,
      containerQuantity: 1,
      containerNumber: '',
      sealNumber: '',
      shipments: [],
      charges: [],
      masterBLType: undefined,
      numberOfOriginalBLs: 0,
      telexRelease: false,
      placeOfIssue: '',
      issueDate: '',
    },
  });

  const { getValues } = methods;

  // Auto-save draft every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      const data = getValues();
      localStorage.setItem('consol_draft', JSON.stringify(data));
    }, 30000);
    return () => clearInterval(interval);
  }, [getValues]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('consol_draft');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        methods.reset({ ...parsed, consolNumber });
      } catch { /* ignore */ }
    }
  }, [methods, consolNumber]);

  const handleSaveDraft = () => {
    const data = getValues();
    localStorage.setItem('consol_draft', JSON.stringify(data));
    toast.success('Draft saved successfully');
  };

  const onSubmit = (data: ConsolFormData) => {
    const cap = data.containerType ? CONTAINER_CAPACITY[data.containerType] : null;
    const totalCbm = (data.shipments || []).reduce((s, sh) => s + sh.cbm, 0);
    const totalWeight = (data.shipments || []).reduce((s, sh) => s + sh.grossWeight, 0);
    if (cap && (totalCbm > cap.maxCbm || totalWeight > cap.maxWeight)) {
      toast.error('Container capacity exceeded. Cannot create consol.');
      return;
    }
    const payload = { ...data, consolNumber, status: 'confirmed' };
    console.log('Consol payload:', payload);
    localStorage.removeItem('consol_draft');
    toast.success(`Consol ${consolNumber} created successfully!`);
    navigate('/consol');
  };

  const goNext = () => setCurrentStep(s => Math.min(6, s + 1));
  const goPrev = () => setCurrentStep(s => Math.max(1, s - 1));

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <ConsolStep1Info />;
      case 2: return <ConsolStep2Routing />;
      case 3: return <ConsolStep3Container />;
      case 4: return <ConsolStep4Shipments />;
      case 5: return <ConsolStep5Charges />;
      case 6: return <ConsolStep6Review />;
      default: return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="animate-fade-in-up">
        {/* Sticky Header */}
        <div className="sticky top-16 z-20 bg-background border-b border-border pb-4 mb-6 -mx-6 px-6 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button type="button" variant="ghost" size="icon" onClick={() => navigate('/consol')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Create LCL Consol</h1>
                <p className="text-xs text-muted-foreground">{consolNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={handleSaveDraft}>
                <Save className="mr-1.5 h-4 w-4" /> Save Draft
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => navigate('/consol')}>
                <X className="mr-1.5 h-4 w-4" /> Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Ship className="mr-1.5 h-4 w-4" /> Create Consol
              </Button>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-6">
          <div className="flex items-center gap-1">
            {CONSOL_WIZARD_STEPS.map((step, i) => (
              <div key={step.id} className="flex items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-xs ${
                    currentStep === step.id
                      ? 'bg-primary text-primary-foreground font-semibold'
                      : currentStep > step.id
                      ? 'bg-accent/10 text-accent font-medium'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    currentStep > step.id ? 'bg-accent text-accent-foreground' : 'bg-background/20'
                  }`}>
                    {currentStep > step.id ? <Check className="h-3 w-3" /> : step.id}
                  </span>
                  <span className="hidden md:inline">{step.title}</span>
                </button>
                {i < CONSOL_WIZARD_STEPS.length - 1 && (
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground mx-0.5 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 space-y-6">
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-2">
              <Button type="button" variant="outline" size="sm" onClick={goPrev} disabled={currentStep === 1}>
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Previous
              </Button>
              {currentStep < 6 ? (
                <Button type="button" size="sm" onClick={goNext}>
                  Next <ChevronRight className="ml-1.5 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Ship className="mr-1.5 h-4 w-4" /> Create Consol
                </Button>
              )}
            </div>
          </div>

          {/* Sticky Summary */}
          <div className="hidden xl:block">
            <div className="sticky top-44">
              <ConsolSummary />
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
