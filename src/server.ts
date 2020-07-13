import env from 'dotenv';
env.config();

import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import { ApolloServer } from 'apollo-server-hapi';
import { PrismaClient } from '@prisma/client';

import entityTypes from './graphql/entity-types';
import queryTypes from './graphql/query-types';
import mutationTypes from './graphql/mutation-types';
import resolvers from './graphql/resolvers';
import echoRoutes from './routes/echo';
import UserService from './services/user';
import PostService from './services/post';

const prisma = new PrismaClient();
const apollo = new ApolloServer({
  typeDefs: [entityTypes, queryTypes, mutationTypes],
  resolvers,
  context: () => ({
    services: {
      user: new UserService(prisma),
      post: new PostService(prisma)
    }
  })
});

const init = async () => {
  const app = new Hapi.Server({
    port: process.env.API_PORT,
    host: process.env.API_HOST,
  });

  // setup middleware
  await apollo.applyMiddleware({ app });

  // setup routes
  echoRoutes(app);

  // 404 route handling
  app.route({
    method: '*',
    path: '/{any*}',
    handler: (request) => {
      request.log('Unknown Request:', request.path);
      throw Boom.badRequest('Unknown API Request');
    }
  });

  await app.start();
  console.log('Server running on %s', app.info.uri);
};

process.on('unhandledRejection', async (err) => {
  console.log('Server Shutting Due to Exception:', err);
  await prisma.disconnect();
  process.exit(1);
});

init();
