import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async findOrCreateGoogleUser(googleUser: any) {
    let user = await this.userModel.findOne({ email: googleUser.email });

    if (!user) {
      user = await this.userModel.create({
        email: googleUser.email,
        name: `${googleUser.firstName} ${googleUser.lastName}`,
        role: 'user',
      });
    }

    return user;
  }

  async signUp(data: { email: string; password: string; name: string }) {
    const { email, password, name } = data;

    const existingUser = await this.userModel.findOne({ email });

    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userModel.create({
      email,
      password: hashedPassword,
      name,
    });

    const token = await this.generateToken(newUser);

    return {
      message: 'User created successfully',
      data: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
      token,
    };
  }

  async signIn(data: { email: string; password: string }) {
    const { email, password } = data;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.generateToken(user);

    return {
      message: 'Login successful',
      data: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    };
  }

  async generateToken(user: UserDocument) {
    console.log(user);

    const payload = { sub: user._id, email: user.email, role: user.role };
    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET!,
    });
  }

  private async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userModel.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
