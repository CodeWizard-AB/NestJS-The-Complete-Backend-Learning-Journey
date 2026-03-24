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
import {
  Action,
  AppAbility,
  CaslAbilityFactory,
} from 'src/casl/casl-ability.factory';
import { CheckPolicies } from 'src/common/decorators/check-policies.decorator';
import { Post as PostEntity } from './schemas/post.schema';
import { type Request } from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PoliciesGuard } from 'src/common/guards/policies.guard';
import { ClaimRequired } from 'src/common/decorators/claim.decorator';
import { ClaimGuard } from 'src/common/guards/claim.guard';

@Controller('posts')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Post()
  // @CheckPolicies((ability) => ability.can(Action.Create, PostEntity))
  async create(
    @Req() req: Request & { user: any },
    @Body() createPostDto: CreatePostDto,
  ) {
    return await this.postsService.create({
      ...createPostDto,
      userId: req.user.id as string,
    });
  }

  @Get()
  // @CheckPolicies((ability) => ability.can(Action.Read, PostEntity))
  findAll() {
    return this.postsService.findAll();
  }

  @Get('country')
  @UseGuards(JwtAuthGuard, ClaimGuard)
  @ClaimRequired(
    { key: 'country', value: 'BD' },
    { key: 'isEmailVerified', value: true },
  )
  getCountryContent() {
    return 'country content';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, PostEntity),
  )
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return await this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @CheckPolicies((ability) => ability.can(Action.Delete, PostEntity))
  remove(@Param('id') id: string, @Req() req: Request & { user: any }) {
    return this.postsService.remove(id);
  }
}
