# Routinize

## Description

Server and client app using [Nest](https://github.com/nestjs/nest) and EmberJS with TypeScript and GraphQL.

## First Time Setup

Ask Ross or Peter for the Dispatch API Service Account JSON file, and place it
here: `src/credentials/dispatcher.json`.

### Install Dependencies

Install Volta: https://volta.sh/ This will use the correct version of node and yarn when you are in this project.

Install the dependencies of the server and client

```sh
yarn
cd client && yarn
```

### Setup Config

Copy `.env.example` to `.env` and tweak the values.

```env
LOCAL=true
```

Should be set locally otherwise localhost will try to redirect to https and you won't be able to open the page.

### Setup DB

Using Postgres create a new database called `goodroute` which should use the default
postgres env vars. You can see which ones here: `src/ormconfig.ts` to configure details.

Run the migrations: `yarn typeorm:run`.

### Create A User

Edit `tools/create-user.ts` to update credentials for your new user and run via:

```sh
npx ts-node tools/create-user.ts
```

### Start For Dev

To start/watch the server and rebuild run:

```sh
yarn start:dev
```

For the client:

```sh
yarn watch
```

## Running the app

```bash
# production
$ yarn start

# watch mode
$ yarn start:dev

# debug mode
$ yarn start:debug
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## NestJS Resources

- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

## Links

If things go south with Dispatch API, we always have HERE's Tour API https://developer.here.com/documentation/tour-planning/dev_guide/index.html
