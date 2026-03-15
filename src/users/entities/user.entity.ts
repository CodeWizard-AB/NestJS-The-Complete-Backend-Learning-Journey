import { Role } from "../enums/role.enum";

export class User {
  id: number;
  name: string;
  email: string;
  password: string;
  roles: Role[];
  isActive: boolean;
  createdAt: Date;
}
