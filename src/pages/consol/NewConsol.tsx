import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, X, Ship } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { consolFormSchema, type ConsolFormData, CONTAINER_CAPACITY } from '@/types/consol-form.types';
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
      transshipmentPorts: [],
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

  useEffect(() => {
    const interval = setInterval(() => {
      const data = getValues();
      localStorage.setItem('consol_draft', JSON.stringify(data));
    }, 30000);
    return () => clearInterval(interval);
  }, [getValues]);

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

        {/* Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 space-y-6">
            <ConsolStep1Info />
            <ConsolStep2Routing />
            <ConsolStep3Container />
            <ConsolStep4Shipments />
            <ConsolStep5Charges />
            <ConsolStep6Review />
          </div>

          {/* Sticky Summary */}
          <div className="hidden xl:block">
            <div className="sticky top-24">
              <ConsolSummary />
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}