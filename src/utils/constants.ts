export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;

export const APP_CONFIG = {
  APP_NAME: 'FreightFlow',
  VERSION: '1.0.0',
  DEFAULT_PAGE_SIZE: 20,
  TOKEN_REFRESH_THRESHOLD: 60 * 1000, // 1 minute before expiry
} as const;

export const SHIPMENT_STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  booked: 'Booked',
  in_transit: 'In Transit',
  arrived: 'Arrived',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const SHIPMENT_STATUS_COLORS: Record<string, string> = {
  draft: 'muted',
  booked: 'info',
  in_transit: 'accent',
  arrived: 'warning',
  delivered: 'success',
  cancelled: 'destructive',
};

export const CONTAINER_TYPES = ['20GP', '40GP', '40HC', '20RF', '40RF', '45HC'] as const;

export const ROLES_HIERARCHY: Record<string, number> = {
  admin: 100,
  manager: 80,
  operator: 60,
  finance: 50,
  viewer: 10,
};
