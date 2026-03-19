import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import type { CommentDocument, PostDocument } from './post.schema';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll(@Query() query: any): Promise<PostDocument[]> {
    return this.postsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PostDocument | null> {
    return this.postsService.findOne(id);
  }
  
  @Get('popular')
  findPopular(): Promise<PostDocument[]> {
    return this.postsService.findPopular();
  }

  @Get('search')
  search(@Query('s') keyword: string): Promise<PostDocument[]> {
    return this.postsService.search(keyword);
  }

  @Post()
  create(@Body() post: PostDocument): Promise<PostDocument> {
    return this.postsService.create(post);
  }

  @Post(':id/comments')
  addComment(
    @Param('id') id: string,
    @Body() comment: CommentDocument,
  ): Promise<PostDocument | null> {
    return this.postsService.addComment(id, comment);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() post: Partial<PostDocument>,
  ): Promise<PostDocument | null> {
    return this.postsService.update(id, post);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<PostDocument | null> {
    return this.postsService.remove(id);
  }
}
