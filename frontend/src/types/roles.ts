export const APP_ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  RECEPTIONIST: "RECEPTIONIST",
  MECHANIC: "MECHANIC",
  CASHIER: "CASHIER",
  CUSTOMER: "CUSTOMER",
} as const;

export type AppRole = (typeof APP_ROLES)[keyof typeof APP_ROLES];

export function normalizeRole(role?: string | null): AppRole | null {
  if (!role) {
    return null;
  }

  const normalizedRole = role.trim().toUpperCase().replace(/\s+/g, "_");

  if (Object.values(APP_ROLES).includes(normalizedRole as AppRole)) {
    return normalizedRole as AppRole;
  }

  return null;
}

export function canAccessByRole(
  userRole: string | null | undefined,
  allowedRoles?: AppRole[],
): boolean {
  const normalizedRole = normalizeRole(userRole);

  if (!normalizedRole) {
    return false;
  }

  /*
   * SUPER_ADMIN ve absolutamente todo.
   */
  if (normalizedRole === APP_ROLES.SUPER_ADMIN) {
    return true;
  }

  /*
   * Si un módulo no define roles, se muestra.
   */
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  return allowedRoles.includes(normalizedRole);
}
