export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  shipmentId?: string;
  consolId?: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

export type DocumentType =
  | 'bill_of_lading'
  | 'commercial_invoice'
  | 'packing_list'
  | 'certificate_of_origin'
  | 'customs_declaration'
  | 'insurance_certificate'
  | 'delivery_order'
  | 'other';
