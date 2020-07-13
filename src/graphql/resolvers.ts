import { QueryResolvers, MutationResolvers, UserResolvers } from '../types/graphql';
import UserService from '../services/user';
import PostService from '../services/post';

const queryResolver: QueryResolvers = {

  user: async (parent, args, { services }) => {
    const user: UserService = services.user;
    return user.getUser(args.id);
  },

  users: async (parent, args, { services }) => {
    const { pageSize, after } = args;
    const user: UserService = services.user;

    return user.getUsers(pageSize, after);
  },

  post: (parent, args, ctx) => {
    const post: PostService = ctx.services.post;
    return post.getPost(args.id);
  },

  posts: (parent, args, ctx) => {
    const { pageSize, after } = args;
    const post: PostService = ctx.services.post;

    return post.getPosts({ size: pageSize, after });
  },

  postsByUser: async (parent, args, ctx) => {
    const { pageSize, after, userId } = args;
    const post: PostService = ctx.services.post;

    return post.getPosts({ size: pageSize, authorId: userId, after });
  }

};

const mutationResolver: MutationResolvers = {

  addPost: async (parent, args, ctx) => {
    const post: PostService = ctx.services.post;
    return post.addPost(args.post);
  },

  editPost: async (parent, args, ctx) => {
    const post: PostService = ctx.services.post;
    return post.editPost(args.id, args.post);
  }

};

const userResolver: UserResolvers = {

  posts: (user, arg, ctx) => {
    const post: PostService = ctx.services.post;
    return post.getAllAuthorPosts(user.id);
  }

};

export default {
  Query: queryResolver,
  Mutation: mutationResolver,
  User: userResolver
};
