import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsService {
  getPosts() {
    return 'All post';
  }
  createPosts(body: any) {
    return body;
  }
  getPostById(id: string) {
    return `Post ${id}`;
  }
  updatePostById(id: string, body: any) {
    return `Updated post ${id} ${body} `;
  }

  deletePost(id: string) {
    return `Delete post ${id}  `;
  }
}
