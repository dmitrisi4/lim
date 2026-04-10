export type Role = "admin" | "user" | "guest";

export interface UserContext {
  id: string;
  roles: Role[];
}

export const rbacProvider = {
  hasRole: (user: UserContext | null | undefined, role: Role): boolean => {
    if (!user) return role === "guest";
    return user.roles.includes(role);
  },
  hasAnyRole: (user: UserContext | null | undefined, roles: Role[]): boolean => {
    if (!user) return roles.includes("guest");
    return roles.some(r => user.roles.includes(r));
  }
};
