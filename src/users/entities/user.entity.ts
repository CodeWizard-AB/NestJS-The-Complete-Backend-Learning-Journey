import { Exclude } from 'class-transformer';

export class User {
  id: string;
  name: string;
  email: string;

  @Exclude()
  password: string;

  age: number;
  bio?: string;
  isActive?: boolean;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
