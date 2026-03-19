import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommentDocument, Post, PostDocument } from './post.schema';
import { Model } from 'mongoose';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
  ) {}

  async create(post: PostDocument): Promise<PostDocument> {
    const newPost = new this.postModel(post);
    return newPost.save();
  }

  async findAll(query: any = {}): Promise<PostDocument[]> {
    return this.postModel
      .find({ ...query })
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<PostDocument | null> {
    return this.postModel
      .findById(id)
      .populate('author', 'username')
      .populate('comments.author', 'name')
      .exec();
  }

  async update(
    id: string,
    updatePost: Partial<PostDocument>,
  ): Promise<PostDocument | null> {
    return this.postModel
      .findByIdAndUpdate(id, updatePost, { new: true })
      .exec();
  }

  async remove(id: string): Promise<PostDocument | null> {
    return this.postModel.findByIdAndDelete(id).exec();
  }

  async addComment(
    postId: string,
    comment: CommentDocument,
  ): Promise<PostDocument | null> {
    return this.postModel
      .findByIdAndUpdate(
        postId,
        { $push: { comments: comment } },
        { new: true },
      )
      .exec();
  }

  async search(keyword: string): Promise<PostDocument[]> {
    return this.postModel
      .find({
        $or: [
          { title: { $regex: keyword, $options: 'i' } },
          { content: { $regex: keyword, $options: 'i' } },
          { tags: { $in: [keyword] } },
        ],
      })
      .populate('author', 'name')
      .exec();
  }

  async findByTag(tag: string) {
    return this.postModel
      .find({ tags: { $in: [tag] } })
      .populate('author', 'name')
      .exec();
  }

  async findPopular(limit: number = 10) {
    return this.postModel
      .find({ published: true })
      .sort({ views: -1 })
      .limit(limit)
      .populate('author', 'name')
      .exec();
  }
}
