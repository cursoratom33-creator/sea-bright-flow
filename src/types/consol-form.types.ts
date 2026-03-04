import { z } from 'zod';

// ── Enums & Constants ──────────────────────────────────────
export const CONSOL_TYPES = ['LCL Export Consol', 'Buyer Consol', 'Co-loader Consol'] as const;
export const CONSOL_STATUSES = ['Draft', 'Planning', 'Confirmed', 'Container Stuffed', 'Sailed', 'Completed'] as const;
export const CONSOL_SERVICE_TYPES = ['Direct', 'Transshipment'] as const;
export const CONSOL_CONTAINER_TYPES = ['20GP', '40GP', '40HC'] as const;
export const MBL_TYPES = ['Seaway Bill', 'Original BL'] as const;
export const CONSOL_CHARGE_UNITS = ['per CBM', 'per Shipment', 'per Container', 'per BL'] as const;

export const CONTAINER_CAPACITY: Record<string, { maxWeight: number; maxCbm: number }> = {
  '20GP': { maxWeight: 28000, maxCbm: 33 },
  '40GP': { maxWeight: 28000, maxCbm: 67 },
  '40HC': { maxWeight: 28000, maxCbm: 76 },
};

// ── Consol Shipment (HBL) ─────────────────────────────────
export const consolShipmentSchema = z.object({
  shipmentId: z.string().min(1),
  shipmentNumber: z.string(),
  hblNumber: z.string(),
  shipperName: z.string(),
  consigneeName: z.string(),
  packages: z.number().min(0),
  grossWeight: z.number().min(0),
  cbm: z.number().min(0),
  commodity: z.string(),
  freightTerm: z.enum(['PP', 'CC']).default('PP'),
});

// ── Consol Charge ─────────────────────────────────────────
export const consolChargeSchema = z.object({
  chargeType: z.enum(['buy', 'sell']).default('buy'),
  chargeCode: z.string().min(1, 'Charge code required'),
  description: z.string().min(1, 'Description required'),
  rate: z.number().min(0, 'Rate must be >= 0'),
  unit: z.enum(CONSOL_CHARGE_UNITS),
  quantity: z.number().min(1, 'Qty must be >= 1'),
  amount: z.number(),
  ppcc: z.enum(['PP', 'CC']).default('PP'),
});

// ── Step 1 ─────────────────────────────────────────────────
export const consolStep1Schema = z.object({
  consolType: z.enum(CONSOL_TYPES, { required_error: 'Consol type is required' }),
  consolNumber: z.string(),
  branchOffice: z.string().min(1, 'Branch office is required'),
  consolOperator: z.string(),
  carrier: z.string().min(1, 'Carrier is required'),
  consolStatus: z.enum(CONSOL_STATUSES).default('Draft'),
  serviceType: z.enum(CONSOL_SERVICE_TYPES).optional(),
  salesPerson: z.string().optional(),
});

// ── Step 2 ─────────────────────────────────────────────────
export const consolStep2Schema = z.object({
  portOfLoading: z.string().min(1, 'Port of Loading is required'),
  portOfDischarge: z.string().min(1, 'Port of Discharge is required'),
  transshipmentPorts: z.array(z.string()).default([]),
  finalDestination: z.string().optional(),
  placeOfReceipt: z.string().optional(),
  vesselName: z.string().optional(),
  voyageNo: z.string().optional(),
  etd: z.string().min(1, 'ETD is required'),
  eta: z.string().min(1, 'ETA is required'),
  cutOffDate: z.string().optional(),
  carrierBookingNo: z.string().optional(),
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

// ── Container Item ─────────────────────────────────────────
export const consolContainerSchema = z.object({
  id: z.string(),
  containerType: z.enum(CONSOL_CONTAINER_TYPES, { required_error: 'Container type is required' }),
  quantity: z.number().min(1, 'At least 1').default(1),
  containerNumber: z.string().optional(),
  sealNumber: z.string().optional(),
});

// ── Step 3 ─────────────────────────────────────────────────
export const consolStep3Schema = z.object({
  containers: z.array(consolContainerSchema).min(1, 'At least 1 container is required'),
});

// ── Step 4 ─────────────────────────────────────────────────
export const consolStep4Schema = z.object({
  shipments: z.array(consolShipmentSchema).default([]),
});

// ── Step 5 ─────────────────────────────────────────────────
export const consolStep5Schema = z.object({
  charges: z.array(consolChargeSchema).default([]),
});

// ── Step 6 ─────────────────────────────────────────────────
export const consolStep6Schema = z.object({
  masterBLType: z.enum(MBL_TYPES, { required_error: 'Master BL type is required' }),
  numberOfOriginalBLs: z.number().min(0).default(0),
  telexRelease: z.boolean().default(false),
  placeOfIssue: z.string().optional(),
  issueDate: z.string().optional(),
});

// ── Full Form Schema ───────────────────────────────────────
export const consolFormSchema = z.object({
  ...consolStep1Schema.shape,
  ...consolStep2Schema.innerType().innerType().shape,
  ...consolStep3Schema.shape,
  ...consolStep4Schema.shape,
  ...consolStep5Schema.shape,
  ...consolStep6Schema.shape,
});

export type ConsolContainer = z.infer<typeof consolContainerSchema>;
export type ConsolShipment = z.infer<typeof consolShipmentSchema>;
export type ConsolCharge = z.infer<typeof consolChargeSchema>;
export type ConsolFormData = z.infer<typeof consolFormSchema>;

export interface ConsolWizardStep {
  id: number;
  title: string;
  description: string;
}

export const CONSOL_WIZARD_STEPS: ConsolWizardStep[] = [
  { id: 1, title: 'Consol Info', description: 'Type & details' },
  { id: 2, title: 'Routing', description: 'Ports & vessel' },
  { id: 3, title: 'Container', description: 'Container details' },
  { id: 4, title: 'Shipments', description: 'Attach HBLs' },
  { id: 5, title: 'Charges', description: 'Freight charges' },
  { id: 6, title: 'Review', description: 'Documents & review' },
];

// Mock data for dropdowns
export const MOCK_BRANCHES = ['Chennai HQ', 'Mumbai Branch', 'Delhi Branch', 'Kolkata Branch'];
export const MOCK_CARRIERS = ['MSC', 'Maersk', 'CMA CGM', 'Hapag-Lloyd', 'ONE', 'Evergreen', 'COSCO', 'Yang Ming'];
export const MOCK_SALES_PERSONS = ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Gupta'];
export const MOCK_PORTS = ['INMUN - Mundra', 'INNSA - Nhava Sheva', 'INMAA - Chennai', 'LKCMB - Colombo', 'CNSHA - Shanghai', 'CNNGB - Ningbo', 'SGSIN - Singapore', 'USLAX - Los Angeles', 'USNYC - New York', 'GBFXT - Felixstowe', 'DEHAM - Hamburg', 'AEJEA - Jebel Ali'];
export const MOCK_VESSELS = ['MSC ANNA', 'EVER GIVEN', 'CMA CGM MARCO POLO', 'MAERSK ELBA', 'ONE STORK'];

export const MOCK_AVAILABLE_SHIPMENTS: ConsolShipment[] = [
  { shipmentId: 'S001', shipmentNumber: 'SE-2026-00012', hblNumber: 'HBL-2026-0012', shipperName: 'ABC Exports Pvt Ltd', consigneeName: 'XYZ Imports LLC', packages: 120, grossWeight: 2400, cbm: 8.5, commodity: 'Garments', freightTerm: 'PP' },
  { shipmentId: 'S002', shipmentNumber: 'SE-2026-00013', hblNumber: 'HBL-2026-0013', shipperName: 'Delta Textiles', consigneeName: 'Euro Fashion GmbH', packages: 85, grossWeight: 1700, cbm: 6.2, commodity: 'Textiles', freightTerm: 'CC' },
  { shipmentId: 'S003', shipmentNumber: 'SE-2026-00014', hblNumber: 'HBL-2026-0014', shipperName: 'Star Industries', consigneeName: 'Global Trade Inc', packages: 200, grossWeight: 4500, cbm: 12.0, commodity: 'Auto Parts', freightTerm: 'PP' },
  { shipmentId: 'S004', shipmentNumber: 'SE-2026-00015', hblNumber: 'HBL-2026-0015', shipperName: 'Horizon Chemicals', consigneeName: 'ChemWorld SA', packages: 50, grossWeight: 3000, cbm: 4.8, commodity: 'Chemicals', freightTerm: 'PP' },
  { shipmentId: 'S005', shipmentNumber: 'SE-2026-00016', hblNumber: 'HBL-2026-0016', shipperName: 'Pinnacle Exports', consigneeName: 'Oceanic Traders', packages: 160, grossWeight: 3200, cbm: 9.6, commodity: 'Electronics', freightTerm: 'CC' },
];

export const MOCK_CHARGE_CODES = [
  { code: 'OFR', description: 'Ocean Freight' },
  { code: 'THC', description: 'Terminal Handling Charges' },
  { code: 'BLC', description: 'BL Charges' },
  { code: 'CFS', description: 'CFS Charges' },
  { code: 'DOC', description: 'Documentation Charges' },
  { code: 'SBC', description: 'Seal Charges' },
  { code: 'INS', description: 'Insurance' },
  { code: 'CUS', description: 'Customs Clearance' },
];
