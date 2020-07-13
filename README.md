# TypeScript & GraphQL API Boilerplate

A Hapi based API server with Apollo GraphQL and TypeScript setup.

There is a lot of emphasis to bring in type support so majority of tech choices have been based on that, such as Prisma and GraphQL codegen.

This boilerplate has all the build scripts setup with sample patterns for GraphQL and API routes.

## Tech Stack
- [Hapi](https://github.com/hapijs/hapi) - API Server
- [Apollo](https://github.com/apollographql/apollo-server) - Graphql Server
- [TypeScript](https://github.com/microsoft/TypeScript) - For adding type support
- [Prisma](https://github.com/prisma/prisma) - A new gen ORM with type support
- [Graphql Codegen](https://github.com/dotansimha/graphql-code-generator) - Generate TypeScript definition for GraphQL schemas
- [Joi](https://github.com/hapijs/joi) - Used for API input validation
- [Boom](https://github.com/hapijs/boom) - Easy HTTP error responses
- [Node DB-Migrate](https://github.com/db-migrate/node-db-migrate) - Easy DB migrations
- [Jest](https://github.com/facebook/jest) - For testing
- [Prettier](https://github.com/prettier/prettier) - Opinionated code formatting
- [ESLint](https://github.com/eslint/eslint) - Code linting with TypeScript rule setup

## How To Run

First step install dependencies
```bash
npm install
```
Also you can use this sample `.env` file:
```bash
API_HOST=localhost
API_PORT=4000
DATABASE_URL=postgres://postgres:password@localhost:5432/dev
PGUSER=postgres
PGPASSWORD=password
PGHOST=localhost
PGPORT=5432
PGDATABASE=dev
```

Second step, start up the Docker compose for running Postgres DB using:
```bash
docker-compose up
```
Alternatiely run your own local version if preferred. The docker-compose version also starts up `Adminer` a basic GUI for local DB management.

Third step, run DB migrations to setup the db
```
npm run migrations
npm run setup-testdb
```

Third step, start the dev server
```bash
npm run dev
```

## Workflow

A couple of workflow points to note to get a better type support experience, local dev workflow and production deployment information.

### Prisma and DB

Prisma is used for connecting with the database, it uses introspection to generate to auto create a schema and also generate type definitions when interacting with your database.

It is recommended you go through their docs to get familiar.

On every schema change, ensure you run:
```bash
npm run prisma-introspect
```

To re-create the Prisma models. These models may require name adjustments to conform to standard JS came case naming scheme.

On any changes to the Prisma models, ensure you run:
```bash
npm run prisma-generate
```

This generates type definitions from the models

### GraphQL Code Gen

Every time you make any GraphQL schema changes, run:
```bash
npm run graphql-codegen
```
This generates type defintions for all your GraphQL types and puts in `src/types`

### DB Migrate

It is recommended to use `node-db-migrate` for managing schema changes and updates. It is a great way to do migrations and also quickly setup a new Database. It can track migrations as well as revert them.

Please read their docs to learn more about them.

It uses `database.json` for configuration

### Test

All test files are located in `/test` folder and can be ran with:

```bash
npm run test
```

### Production

For deploying to prod, in your CI or wherever you are building install only prod dependencies:

```bash
npm install --production
```
Note: You can omit `--production` if your `NODE_ENV=production`

Then build your `dist` folder.
```bash
npm run build
```
This will also lint your build and will exit if linting fails.

You must also generate Prisma definitions after installing due to the way it stores these definitions in the node_modules folder

```bash
npm run prisma-generate
```

Now tarball / zip up everything and deploy to your server and use this command to start it up:

```bash
npm run start
```

