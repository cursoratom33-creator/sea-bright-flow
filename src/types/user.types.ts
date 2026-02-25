// User & Auth Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions: Permission[];
  avatar?: string;
  companyId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'admin' | 'manager' | 'operator' | 'viewer' | 'finance';

export type Permission =
  | 'shipment:read' | 'shipment:create' | 'shipment:update' | 'shipment:delete'
  | 'consol:read' | 'consol:create' | 'consol:update' | 'consol:delete'
  | 'document:read' | 'document:create' | 'document:update' | 'document:delete'
  | 'billing:read' | 'billing:create' | 'billing:update' | 'billing:delete'
  | 'report:read' | 'report:export'
  | 'settings:read' | 'settings:update'
  | 'user:manage';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
