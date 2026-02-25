import api from './api';
import type { Shipment, ShipmentFilters, PaginatedResponse } from '@/types/shipment.types';
import type { ApiResponse, DashboardKPIs, Consol, BillingInvoice } from '@/types/common.types';

export const shipmentService = {
  async list(filters?: ShipmentFilters): Promise<PaginatedResponse<Shipment>> {
    const { data } = await api.get<ApiResponse<PaginatedResponse<Shipment>>>('/shipments', {
      params: filters,
    });
    return data.data;
  },

  async getById(id: string): Promise<Shipment> {
    const { data } = await api.get<ApiResponse<Shipment>>(`/shipments/${id}`);
    return data.data;
  },

  async create(shipment: Partial<Shipment>): Promise<Shipment> {
    const { data } = await api.post<ApiResponse<Shipment>>('/shipments', shipment);
    return data.data;
  },

  async update(id: string, shipment: Partial<Shipment>): Promise<Shipment> {
    const { data } = await api.put<ApiResponse<Shipment>>(`/shipments/${id}`, shipment);
    return data.data;
  },
};

export const consolService = {
  async list(): Promise<Consol[]> {
    const { data } = await api.get<ApiResponse<Consol[]>>('/consols');
    return data.data;
  },
};

export const billingService = {
  async list(): Promise<BillingInvoice[]> {
    const { data } = await api.get<ApiResponse<BillingInvoice[]>>('/billing/invoices');
    return data.data;
  },
};

export const dashboardService = {
  async getKPIs(): Promise<DashboardKPIs> {
    const { data } = await api.get<ApiResponse<DashboardKPIs>>('/dashboard/kpis');
    return data.data;
  },
};
