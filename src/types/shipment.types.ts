export type ShipmentType = 'FCL' | 'LCL';
export type ShipmentStatus = 'draft' | 'booked' | 'in_transit' | 'arrived' | 'delivered' | 'cancelled';
export type ShipmentDirection = 'export' | 'import';

export interface Shipment {
  id: string;
  referenceNumber: string;
  type: ShipmentType;
  status: ShipmentStatus;
  direction: ShipmentDirection;
  shipper: Party;
  consignee: Party;
  origin: Port;
  destination: Port;
  vessel?: string;
  voyage?: string;
  etd?: string;
  eta?: string;
  atd?: string;
  ata?: string;
  containers: Container[];
  consolId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Party {
  id: string;
  name: string;
  address: string;
  country: string;
  contact?: string;
  email?: string;
  phone?: string;
}

export interface Port {
  code: string;
  name: string;
  country: string;
}

export interface Container {
  id: string;
  number: string;
  type: '20GP' | '40GP' | '40HC' | '20RF' | '40RF' | '45HC';
  sealNumber?: string;
  weight?: number;
  volume?: number;
  packages?: number;
}

export interface ShipmentFilters {
  search?: string;
  type?: ShipmentType;
  status?: ShipmentStatus;
  direction?: ShipmentDirection;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
