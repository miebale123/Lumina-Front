import { UserRole } from "./user-role.enum";

export interface JwtPayload {
  sub: number;
  email: string;
  roles: UserRole[];
}
