import { gql } from 'apollo-server-hapi';

const typeDefs = gql`
  type User {
    id: Int!
    name: String
    age: Int
    vipLevel: VIPLEVEL,
    posts: [Post]
  }

  type Post {
    id: Int!
    title: String
    content: String
    author: User
  }

  enum VIPLEVEL {
    BRONZE
    SILVER
    GOLD
    PLATINUM
  }
`;

export default typeDefs;
