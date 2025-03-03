"use client";

import { createContext, useContext, ReactNode } from "react";
import { useRBAC } from "@/hooks/useRBAC";

type Action = "create" | "read" | "update" | "delete";
type Role = "admin" | "manager" | "staff" | "user";

interface RBACContextType {
  role: string;
  isLoading: boolean;
  hasRole: (requiredRole: Role) => boolean;
  isExactRole: (role: Role) => boolean;
  can: (action: Action, resource: string) => boolean;
  isAdmin: () => boolean;
  isManager: () => boolean;
  isStaff: () => boolean;
  isUser: () => boolean;
}

const RBACContext = createContext<RBACContextType>({
  role: "user",
  isLoading: true,
  hasRole: () => false,
  isExactRole: () => false,
  can: () => false,
  isAdmin: () => false,
  isManager: () => false,
  isStaff: () => false,
  isUser: () => false,
});

export function RBACProvider({ children }: { children: ReactNode }) {
  const rbac = useRBAC();

  return <RBACContext.Provider value={rbac}>{children}</RBACContext.Provider>;
}

export const useRBACContext = () => useContext(RBACContext); 