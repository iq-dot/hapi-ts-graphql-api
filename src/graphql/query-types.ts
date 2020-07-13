import { gql } from 'apollo-server-hapi';

const typeDefs = gql`
  type Query {
    users(pageSize: Int!, after: Int): UserConnection!
    user(id: Int!): User

    postsByUser(userId: Int!, pageSize: Int!, after: Int): PostConnection!
    posts(pageSize: Int!, after: Int): PostConnection!
    post(id: Int!): Post
  }

  type PostConnection {
    cursor: Int!
    hasMore: Boolean!
    posts: [Post]!
  }

  type UserConnection {
    cursor: Int!
    hasMore: Boolean!
    users: [User]!
  }
`;

export default typeDefs;
