# Triyit Backend Task 

This repository was created as an application task for Triyit. The application uses Express.Js, Prisma, and Apollo GraphQL.

## Deployed Application

The application is built with a CI/CD pipeline and is deployed on my personal server. Builds can be triggered by creating a new release with an apropriate tag on GitHub.

The deployed application can be accessed at the following URL: 

https://triyit.balint.dk/gql

## ⚠️ Diviation from the Task

Task:
Both album and artist are available under track

This requirement was not implemented straight away, as the provided DB doesnt't contain a Track <-> Artist relationship, rather it has a Artist -> Album -> Track relationship.

However, with filed resolvers it is possible to reach the available data like so: 

```graphql
query Track($trackId: ID!) {
  track(id: $trackId) {
    id
    album {
      id
      title
      artist {
        id
        name
      }
    }
  }
}
```


## Getting Started

To get started, install the dependencies:

```bash
yarn install
```

Clone the `.env.example` file to `.env` and configure your environment variables as needed.

```bash
cp .env.example .env
```

Generate the Prisma client, and GraphQL type definitions:

```bash
yarn db:generate
yarn codegen
```


## Running the app

For automatic reloading with nodemon, run:

```bash
# development
yarn dev
```

## For production

```bash
# build
yarn build
# Run the built application
yarn start:prod
```

## Test

I used Jest for testing. To run the tests, run the following command:

```bash
# unit tests
yarn test
```

The application has unit tests that cover the core functionality. To run only the unit tests, use:

```bash
yarn test:unit
```

To run the end-to-end (E2E) tests, use:
```bash
yarn test:e2e
```

_For more information on testing, refer to the [README-E2E-TESTS.md](README-E2E-TESTS.md) file._

## Database

The project uses Prisma as an ORM. To generate the Prisma client, run:

```bash
yarn db:generate
```

_For more information on the database, refer to the [README-DATABASE.md](README-DATABASE.md) file._
