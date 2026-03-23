import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Action, CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { CheckPolicies } from 'src/common/decorators/check-policies.decorator';
import { Post as PostEntity } from './schemas/post.schema';
import { type Request } from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PoliciesGuard } from 'src/common/guards/policies.guard';

@Controller('posts')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Post()
  @CheckPolicies((ability) => ability.can(Action.Create, PostEntity))
  async create(@Req() req: Request, @Body() createPostDto: CreatePostDto) {
    // return await this.postsService.create();
  }

  @Get()
  @CheckPolicies((ability) => ability.can(Action.Read, PostEntity))
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: Request,
  ) {
    const post = this.postsService.findOne(id);
    const ability = this.caslAbilityFactory.createForUser(req.user as any);
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
