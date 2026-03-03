import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, Send, Ship, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { shipmentFormSchema, type ShipmentFormData } from '@/types/shipment-form.types';
import Step1ShipmentType from '@/components/shipment-wizard/Step1ShipmentType';
import Step2Parties from '@/components/shipment-wizard/Step2Parties';
import Step3Routing from '@/components/shipment-wizard/Step3Routing';
import Step4Cargo from '@/components/shipment-wizard/Step4Cargo';
import Step5Charges from '@/components/shipment-wizard/Step5Charges';
import Step6Review from '@/components/shipment-wizard/Step6Review';
import ShipmentSummary from '@/components/shipment-wizard/ShipmentSummary';

function generateShipmentNumber() {
  const year = new Date().getFullYear();
  const seq = String(Math.floor(Math.random() * 99999) + 1).padStart(5, '0');
  return `SE-${year}-${seq}`;
}

export default function NewShipmentPage() {
  const navigate = useNavigate();
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
      billToId: '', billToName: '', billToGst: '',
      salesPerson: '', customerRefNo: '', bookingNo: '', contractNo: '',
      placeOfReceipt: '', portOfLoading: '', portOfDischarge: '',
      finalDestination: '', vesselName: '', voyageNo: '',
      etd: '', eta: '', cutOffDate: '', carrier: '',
      fclCargo: [{ containerType: '20GP', numberOfContainers: 1, grossWeight: 0, cbm: 0, commodity: '', hsCode: '', isDangerous: false, unNumber: '', imoClass: '' }],
      lclCargo: [{ isStackable: true, packageType: undefined, dimensionUnit: 'CM' as const, length: 0, breadth: 0, height: 0, weightPerPackage: 0, numberOfPackages: 1, commodity: '', hsCode: '', grossWeight: 0, netWeight: 0, volume: 0, marksAndNumbers: '', confirmNotDangerous: false }],
      currency: 'USD', exchangeRate: 1,
      charges: [],
      blType: undefined, hblRequired: false, mblRequired: false, telexRelease: false, originalBLCount: 0, nonNegotiableBLCount: 0
    }
  });

  const { getValues } = methods;

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
      } catch {/* ignore */}
    }
  }, [methods]);

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

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="animate-fade-in-up">
        {/* Sticky Header */}
        <div className="sticky top-16 z-20 bg-background border-b border-border pb-4 mb-6 -mx-6 px-6 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button type="button" variant="ghost" size="icon" onClick={() => navigate('/shipments')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Create New Shipment</h1>
                
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={handleSaveDraft}>
                <Save className="mr-1.5 h-4 w-4" /> Save Draft
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => navigate('/shipments')}>
                <X className="mr-1.5 h-4 w-4" /> Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Ship className="mr-1.5 h-4 w-4" /> Create Shipment
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 space-y-6">
            <Step1ShipmentType />
            <Step2Parties />
            <Step3Routing />
            <Step4Cargo />
            <Step5Charges />
            <Step6Review />

          </div>

          {/* Sticky Summary Sidebar */}
          <div className="hidden xl:block">
            <div className="sticky top-24">
              <ShipmentSummary currentStep={0} />
            </div>
          </div>
        </div>
      </form>
    </FormProvider>);

}