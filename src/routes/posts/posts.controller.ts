import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PrismaService } from 'src/shared/services/prisma.service';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postService: PostsService,
    private readonly prismaService: PrismaService,
  ) {}
  @Get()
  getPosts() {
    return this.prismaService.post.findMany();
  }
  @Post()
  createPost(@Body() body: any) {
    return this.prismaService.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: 1,
      },
    });
  }

  @Get(':id')
  getPostById(@Param('id') id: string) {
    return this.postService.getPostById(id);
  }
  @Put(':id')
  updatePost(@Param('id') id: string, @Body() body: any) {
    return this.postService.updatePostById(id, body);
  }
  @Delete(':id')
  deletePost(@Param('id') id: string) {
    return this.postService.deletePost(id);
  }
}
