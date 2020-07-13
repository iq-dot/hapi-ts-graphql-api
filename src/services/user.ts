import { PrismaClient, FindManyUserArgs } from '@prisma/client';
import { UserConnection, User, UserOpResponse, Viplevel } from '../types/graphql';

type UserUpdateData = {
  name?: string,
  vipLevel?: Viplevel
};

export default class UserService {

  db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async getUsers(size: number, after?: number | null): Promise<UserConnection> {

    const query: FindManyUserArgs = {
      take: size + 1, // take one more to determine if there are more results
      orderBy: {
        id: 'asc',
      },
    };

    if (after) {
      query.cursor = { id: after };
      query.skip = 1;
    }

    const users = await this.db.user.findMany(query) as User[];

    return {
      users,
      cursor: users[users.length - 1].id,
      hasMore: users.length > size
    };
  }

  getUser(id: number): Promise<User> {
    return this.db.user.findOne({
      where: { id }
    }) as Promise<User>;
  }

  async updateUser(id: number, data: UserUpdateData): Promise<UserOpResponse> {
    const { name } = data;

    try {
      const user = await this.db.user.update({
        where: { id },
        data: { name }
      }) as User;

      return {
        success: true,
        message: 'success',
        user
      };

    } catch (e) {
      return {
        user: null,
        success: false,
        message: e.message
      };
    }
  }

}
