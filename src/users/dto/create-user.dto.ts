export class CreateUserDto {
  email: string;
  password: string;
  refreshToken?: string | null;
  role?: string;
}
