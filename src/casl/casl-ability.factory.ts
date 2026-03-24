import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Post } from 'src/posts/schemas/post.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}
type Subjects = InferSubjects<typeof User | typeof Post> | 'all';
export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: UserDocument): AppAbility {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createMongoAbility,
    );

    switch (user.role) {
      case 'admin':
        can(Action.Manage, 'all');
        break;
      case 'moderator':
        can(Action.Read, 'all');
        can(Action.Delete, Post);
        cannot(Action.Delete, User);
        cannot(Action.Update, User);
        break;
      case 'user':
        can(Action.Create, Post);
        can(Action.Read, Post);
        can(Action.Update, Post, { userId: user.id });
        can(Action.Delete, Post, { userId: user.id });
        can(Action.Read, User, { _id: user.id } as any);
        can(Action.Update, User, { _id: user.id } as any);
        cannot(Action.Delete, User);
        break;
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
