import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import bcrypt from 'bcrypt';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory() {
          const schema = UserSchema;
          schema.pre('save', async function () {
            if (this.isModified('password')) {
              this.password = await bcrypt.hash(this.password, 10);
            }
          });
          return schema;
        },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
