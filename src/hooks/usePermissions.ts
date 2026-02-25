import { useAuthStore } from '@/store/auth.store';
import type { Permission, UserRole } from '@/types/user.types';
import { ROLES_HIERARCHY } from '@/utils/constants';

export function usePermissions() {
  const user = useAuthStore((s) => s.user);

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return user.permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(hasPermission);
  };

  const hasRole = (role: UserRole): boolean => {
    if (!user) return false;
    return ROLES_HIERARCHY[user.role] >= ROLES_HIERARCHY[role];
  };

  return { hasPermission, hasAnyPermission, hasRole, user };
}
