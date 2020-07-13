import { gql } from 'apollo-server-hapi';

const typeDefs = gql`
  type Mutation {
    updateUser(id: Int!, name: String!): UserOpResponse!
    addPost(post: PostCreateInput!): PostOpResponse!
    editPost(id: Int!, post: PostEditInput!): PostOpResponse!
  }

  type UserOpResponse {
    success: Boolean!
    message: String
    user: User
  }

  type PostOpResponse {
    success: Boolean!
    message: String
    post: Post
  }

  input PostEditInput {
    title: String,
    content: String
  }

  input PostCreateInput {
    title: String!
    content: String!
    author: Int!
  }
`;

export default typeDefs;
