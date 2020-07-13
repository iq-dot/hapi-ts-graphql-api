import { FindManyPostArgs, PrismaClient, PostUpdateInput } from '@prisma/client';
import { PostConnection, Post, PostOpResponse, PostCreateInput, PostEditInput } from '../types/graphql';

type GetPostParam = {
  size: number,
  after?: number | null,
  authorId?: number
}

export default class PostService {

  db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async getPosts(params: GetPostParam): Promise<PostConnection> {
    const { size, after, authorId } = params;

    const query: FindManyPostArgs = {
      take: size + 1, // take one more to determine if there are more results
      orderBy: {
        id: 'asc',
      },
    };

    if (authorId) {
      query.where = { authorId };
    }

    if (after) {
      query.cursor = { id: after };
      query.skip = 1;
    }

    const posts = await this.db.post.findMany(query) as Post[];

    return {
      posts,
      cursor: posts[posts.length - 1].id,
      hasMore: posts.length > size
    };
  }

  getPost(id: number): Promise<Post> {
    return this.db.post.findOne({
      where: { id }
    }) as Promise<Post>;
  }

  getAllAuthorPosts(id: number): Promise<Post[]> {
    return this.db.post.findMany({
      where: { authorId: id }
    });
  }

  async addPost(data: PostCreateInput): Promise<PostOpResponse> {
    const { title, content, author } = data;

    try {
      const post = await this.db.post.create({
        data: {
          title,
          content,
          author: { connect: { id: author } }
        },
        include: { author: true }
      }) as Post;

      return this.opResponse(true, post, 'success');

    } catch(e) {
      return this.opResponse(false, null, e.message);
    }
  }

  async editPost(id: number, data: PostEditInput): Promise<PostOpResponse> {
    const { title, content } = data;
    const update: PostUpdateInput = {};

    if (title){
      update.title = title;
    }

    if (content) {
      update.content = content;
    }

    try {
      const post = await this.db.post.update({
        data: update,
        where: { id },
        include: { author: true }
      }) as Post;

      return this.opResponse(true, post, 'success');

    } catch(e) {
      return this.opResponse(false, null, e.message);
    }
  }

  opResponse(success: boolean, post: Post | null, message: string): PostOpResponse {
    return {
      success,
      post,
      message
    };
  }

}
