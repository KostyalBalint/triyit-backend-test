# E2E Tests Documentation

This document describes the end-to-end (E2E) tests for the GraphQL API that test the actual running application with the provided `chinook.db` demo SQLite database.

## Overview

- **Real GraphQL API functionality** - Tests actual HTTP requests to the GraphQL endpoint
- **Similarity search** - Tests the fuzzy search functionality with 90% similarity threshold
- **Complex nested queries** - Tests relationships between artists, albums, and tracks
- **Error handling** - Tests error scenarios and edge cases

## Running Tests

### Prerequisites

```bash
# Install dependencies
yarn install

# Generate Prisma client
yarn db:generate
```


### Test Environment Configuration _(optinonal)_

Create a `.env.test` file for the E2E tests, and populate it with the following content:

```env
DATABASE_URL="file:../sample_data/chinook.db"
PORT=8081
GQL_PATH="/gql"
SIMILARITY_THRESHOLD=0.9
```

_If not created, the tests will use the default `.env` file._

### Available Test Commands

```bash
# Run only unit tests (excludes E2E)
yarn test:unit

# Run only E2E tests
yarn test:e2e

# Run all tests (unit + E2E)
yarn test:all
```