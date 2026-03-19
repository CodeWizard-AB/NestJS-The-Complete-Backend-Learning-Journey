import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;
export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId;

  @Prop({ required: true })
  text: string;

  @Prop({ default: Date.now() })
  createdAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId;

  @Prop([String])
  tags: string[];

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: false })
  published: boolean;

  @Prop({ type: [CommentSchema], default: [] })
  comments: Comment[];
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.pre('findOne', function () {
  this.updateOne({}, { $inc: { views: 1 } });
});
