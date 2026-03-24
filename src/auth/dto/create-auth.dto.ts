export class CreateAuthDto {
  email: string;
  password: string;
  name: string;
  role?: string;
  isEmailVerified: boolean;
  country: string;
}
