import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { Model } from 'mongoose';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
  ) {}

  async create(createPostDto: Post) {
    return await this.postModel.create(createPostDto);
  }

  async findAll() {
    return await this.postModel.find();
  }

  async findOne(id: string) {
    return await this.postModel.findById(id);
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    return await this.postModel.findByIdAndUpdate(id, updatePostDto, {
      returnDocument: 'after',
    });
  }

  async remove(id: string) {
    return await this.postModel.findByIdAndDelete(id);
  }
}
