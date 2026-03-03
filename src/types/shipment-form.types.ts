import { z } from 'zod';

// ── Enums & Constants ──────────────────────────────────────
export const SHIPMENT_TYPES = ['FCL', 'LCL'] as const;
export const MOVEMENT_TYPES = ['Port to Port', 'Door to Port', 'Port to Door', 'Door to Door'] as const;
export const SHIPMENT_MODES = ['Sea Export', 'Sea Import'] as const;
export const SERVICE_TYPES = ['Direct', 'Transshipment'] as const;
export const INCOTERMS = ['EXW', 'FOB', 'CFR', 'CIF', 'DDP', 'DAP'] as const;
export const FREIGHT_TERMS = ['Prepaid', 'Collect'] as const;
export const CONTAINER_TYPES_OPTIONS = ['20GP', '40GP', '40HC', '45HC'] as const;
export const PACKAGE_TYPES = ['Cartons', 'Pallets', 'Bags', 'Drums', 'Crates', 'Bundles', 'Rolls'] as const;
export const DIMENSION_UNITS = ['CM', 'M', 'MM', 'IN'] as const;
export const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'AED', 'CNY', 'JPY'] as const;
export const CHARGE_UNITS = ['CBM', 'Container', 'BL', 'Shipment', 'KG', 'TEU'] as const;
export const BL_TYPES = ['Direct Master B/L', 'Own House B/L'] as const;

// ── Step 1 ─────────────────────────────────────────────────
export const step1Schema = z.object({
  shipmentType: z.enum(SHIPMENT_TYPES, { required_error: 'Shipment type is required' }),
  movementType: z.enum(MOVEMENT_TYPES, { required_error: 'Movement type is required' }),
  shipmentMode: z.enum(SHIPMENT_MODES, { required_error: 'Shipment mode is required' }),
  serviceType: z.enum(SERVICE_TYPES).optional(),
  incoterm: z.enum(INCOTERMS, { required_error: 'Incoterm is required' }),
  freightTerm: z.enum(FREIGHT_TERMS, { required_error: 'Freight term is required' }),
});

// ── Step 2 ─────────────────────────────────────────────────
export const step2Schema = z.object({
  shipperId: z.string().min(1, 'Shipper is required'),
  shipperName: z.string().min(1, 'Shipper is required'),
  consigneeId: z.string().min(1, 'Consignee is required'),
  consigneeName: z.string().min(1, 'Consignee is required'),
  notifyPartyId: z.string().optional(),
  notifyPartyName: z.string().optional(),
  forwardingAgentId: z.string().optional(),
  forwardingAgentName: z.string().optional(),
  customsBrokerId: z.string().optional(),
  customsBrokerName: z.string().optional(),
  salesPerson: z.string().optional(),
  customerRefNo: z.string().optional(),
  bookingNo: z.string().optional(),
  contractNo: z.string().optional(),
}).refine(data => data.shipperId !== data.consigneeId || !data.shipperId, {
  message: 'Shipper and Consignee cannot be the same',
  path: ['consigneeId'],
});

// ── Step 3 ─────────────────────────────────────────────────
export const step3Schema = z.object({
  placeOfReceipt: z.string().optional(),
  portOfLoading: z.string().min(1, 'Port of Loading is required'),
  portOfDischarge: z.string().min(1, 'Port of Discharge is required'),
  finalDestination: z.string().optional(),
  vesselName: z.string().optional(),
  voyageNo: z.string().optional(),
  etd: z.string().optional(),
  eta: z.string().optional(),
  cutOffDate: z.string().optional(),
  carrier: z.string().optional(),
}).refine(data => data.portOfLoading !== data.portOfDischarge, {
  message: 'POL and POD cannot be the same',
  path: ['portOfDischarge'],
}).refine(data => {
  if (data.etd && data.eta) return new Date(data.etd) < new Date(data.eta);
  return true;
}, {
  message: 'ETD must be before ETA',
  path: ['eta'],
});

// ── Step 4 (FCL) ──────────────────────────────────────────
export const fclCargoItemSchema = z.object({
  containerType: z.enum(CONTAINER_TYPES_OPTIONS, { required_error: 'Container type is required' }),
  numberOfContainers: z.number().min(1, 'At least 1 container'),
  grossWeight: z.number().min(0.01, 'Weight must be > 0'),
  cbm: z.number().min(0.01, 'CBM must be > 0'),
  commodity: z.string().min(1, 'Commodity is required'),
  hsCode: z.string().optional(),
  isDangerous: z.boolean().default(false),
  unNumber: z.string().optional(),
  imoClass: z.string().optional(),
});

export const fclCargoRefinedSchema = fclCargoItemSchema.refine(data => {
  if (data.isDangerous) return !!data.unNumber && !!data.imoClass;
  return true;
}, { message: 'UN No and IMO Class required for dangerous goods', path: ['unNumber'] });

// ── Step 4 (LCL) ──────────────────────────────────────────
export const lclCargoItemSchema = z.object({
  isStackable: z.boolean().default(true),
  packageType: z.enum(PACKAGE_TYPES).optional(),
  dimensionUnit: z.enum(DIMENSION_UNITS).default('CM'),
  length: z.number().min(0).default(0),
  breadth: z.number().min(0).default(0),
  height: z.number().min(0).default(0),
  weightPerPackage: z.number().min(0.01, 'Weight must be > 0'),
  numberOfPackages: z.number().min(1, 'At least 1 package'),
  commodity: z.string().min(1, 'Commodity is required'),
  hsCode: z.string().optional(),
  grossWeight: z.number().min(0.01, 'Weight must be > 0'),
  netWeight: z.number().optional(),
  volume: z.number().min(0.01, 'Volume must be > 0'),
  marksAndNumbers: z.string().optional(),
  confirmNotDangerous: z.boolean().default(false),
});

export const step4Schema = z.object({
  fclCargo: z.array(fclCargoItemSchema).optional(),
  lclCargo: z.array(lclCargoItemSchema).optional(),
});

// ── Step 5 ─────────────────────────────────────────────────
export const CHARGE_TYPES = ['buy', 'sell'] as const;

export const chargeLineSchema = z.object({
  chargeType: z.enum(CHARGE_TYPES).default('buy'),
  chargeCode: z.string().min(1, 'Charge code required'),
  description: z.string().min(1, 'Description required'),
  rate: z.number().min(0, 'Rate must be >= 0'),
  unit: z.enum(CHARGE_UNITS),
  quantity: z.number().min(1, 'Qty must be >= 1'),
  amount: z.number(),
  ppcc: z.enum(['PP', 'CC']).default('PP'),
});

export const step5Schema = z.object({
  currency: z.enum(CURRENCIES, { required_error: 'Currency is required' }),
  exchangeRate: z.number().optional(),
  charges: z.array(chargeLineSchema).default([]),
});

// ── Step 6 ─────────────────────────────────────────────────
export const step6Schema = z.object({
  blType: z.enum(BL_TYPES, { required_error: 'B/L type is required' }),
  hblRequired: z.boolean().default(false),
  mblRequired: z.boolean().default(true),
  telexRelease: z.boolean().default(false),
  originalBLCount: z.number().min(0).default(3),
});

// ── Full Form Schema ───────────────────────────────────────
export const shipmentFormSchema = z.object({
  ...step1Schema.shape,
  ...step2Schema.innerType().shape,
  ...step3Schema.innerType().innerType().shape,
  ...step4Schema.shape,
  ...step5Schema.shape,
  ...step6Schema.shape,
  confirmNotDangerous: z.boolean().default(false),
});

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type FclCargoItem = z.infer<typeof fclCargoItemSchema>;
export type LclCargoItem = z.infer<typeof lclCargoItemSchema>;
export type Step4Data = z.infer<typeof step4Schema>;
export type ChargeLine = z.infer<typeof chargeLineSchema>;
export type Step5Data = z.infer<typeof step5Schema>;
export type Step6Data = z.infer<typeof step6Schema>;
export type ShipmentFormData = z.infer<typeof shipmentFormSchema>;

export interface WizardStep {
  id: number;
  title: string;
  description: string;
}

export const WIZARD_STEPS: WizardStep[] = [
  { id: 1, title: 'Shipment Type', description: 'Type & terms' },
  { id: 2, title: 'Parties', description: 'Customers & agents' },
  { id: 3, title: 'Routing', description: 'Ports & schedule' },
  { id: 4, title: 'Cargo', description: 'Goods & containers' },
  { id: 5, title: 'Documents', description: 'B/L & review' },
  { id: 6, title: 'Commercial', description: 'Costs & revenue' },
];
