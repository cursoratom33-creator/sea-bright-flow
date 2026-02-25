export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

export interface DashboardKPIs {
  activeShipments: number;
  activeShipmentsChange: number;
  pendingDocuments: number;
  pendingDocumentsChange: number;
  revenue: number;
  revenueChange: number;
  containersInTransit: number;
  containersChange: number;
}

export interface Consol {
  id: string;
  referenceNumber: string;
  status: 'open' | 'closed' | 'shipped' | 'delivered';
  type: 'FCL' | 'LCL';
  origin: { code: string; name: string; country: string };
  destination: { code: string; name: string; country: string };
  vessel?: string;
  voyage?: string;
  etd?: string;
  eta?: string;
  shipmentIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BillingInvoice {
  id: string;
  invoiceNumber: string;
  shipmentId?: string;
  clientName: string;
  amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate: string;
  createdAt: string;
}
