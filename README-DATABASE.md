# Database Setup

This project can supports both SQLite and PostgreSQL.

## Current Setup: SQLite

The project is currently configured to use the Chinook SQLite database located at `sample_data/chinook.db`.
I used SQLite primarily because the test database is available as the above mentioned file, and it is easier to set up for development and testing purposes.

### Available Commands

- `yarn db:introspect` - Generate Prisma schema from database
- `yarn db:generate` - Generate Prisma client
- `yarn db:studio` - Open Prisma Studio to browse data
- `yarn db:reset` - Reset database schema (use with caution)

## Switching to PostgreSQL

To switch to PostgreSQL:

1. **Update `.env` file:**
   ```bash
   # Comment out SQLite configuration
   # DATABASE_PROVIDER="sqlite"
   # DATABASE_URL="file:/path/to/chinook.db"

   # Uncomment PostgreSQL configuration
   DATABASE_PROVIDER="postgresql"
   DATABASE_URL="postgresql://postgres:dev@localhost:5432/triyit-be"
   ```

2. **Update `prisma/schema.prisma`:**
   ```prisma
   datasource db {
     provider = "postgresql"  // Change from "sqlite"
     url      = env("DATABASE_URL")
   }
   ```