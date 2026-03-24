import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { count } from 'console';
import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User, UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {
    console.log('JwtStrategy');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  async validate(paylod: any) {
    console.log('JwtStrategy validate');
    const user = await this.userModel.findById(paylod.sub);

    if (!user) {
      throw new UnauthorizedException('User no logger exists');
    }

    return {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      country: user.country,
      isEmailVerified: user.isEmailVerified,
    };
  }
}
