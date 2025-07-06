# Prisma Usage Guide

## How Prisma Works

**Prisma works differently from traditional ORMs:**

### Traditional ORMs (like Rails, Django):
1. **Create** migration file manually
2. **Write** SQL in migration file  
3. **Run** migration to update database
4. **Generate** models from database

### Prisma (Schema-First):
1. **Edit** `schema.prisma` file (your single source of truth)
2. **Generate** migration automatically from schema changes
3. **Apply** migration to database
4. **Generate** TypeScript client automatically

**Key Difference:**
- **Traditional**: You write SQL migrations
- **Prisma**: You write schema, it generates SQL migrations

The schema is your **single source of truth** - everything else derives from it.

## Available Commands

### Development Commands

**`pnpm --filter backend run db:generate`** - Generate Prisma client
- Creates TypeScript types from your schema
- Updates the client when schema changes
- Must run after schema modifications

**`pnpm --filter backend run db:push`** - Push schema directly to database
- Syncs schema to database without migrations
- Good for development/prototyping
- **Warning**: Can lose data if not careful
- **Auto-runs** `db:generate` after sync

**`pnpm --filter backend run db:migrate`** - Create and run migrations
- Creates SQL migration files
- Tracks changes for production deployments
- Safe for production use
- Preserves data during schema changes
- **Auto-runs** `db:generate` after applying migration

**`pnpm --filter backend run db:studio`** - Open Prisma Studio
- Visual database browser/editor
- View and edit data through web interface
- Runs on http://localhost:5555

### Production Commands

**`pnpm --filter backend run db:migrate:deploy`** - Deploy migrations to production
- Applies **only pending** migrations
- **Production-safe** (no schema changes)
- **No prompts** or interactive input
- **Doesn't** auto-generate client
- **Doesn't** create new migrations
- Perfect for CI/CD pipelines

## Workflows

### Development Workflow

1. **Edit** `apps/backend/prisma/schema.prisma`
2. **Run** `pnpm --filter backend run db:migrate`
3. **Enter** migration name when prompted
4. **Client is auto-generated** and ready to use

**What happens during `db:migrate`:**
- Compares schema vs current database
- **Auto-generates** SQL migration file in `prisma/migrations/`
- **Applies** migration to database
- **Runs** `db:generate` automatically (updates TypeScript client)
- **Prompts** for migration name

### Production Workflow

1. **Deploy** code with migration files to production
2. **Run** `pnpm --filter backend run db:migrate:deploy`
3. **Run** `pnpm --filter backend run db:generate` (if client needs updating)

**What happens during `db:migrate:deploy`:**
- Applies **only pending** migrations
- **Does NOT** auto-generate client
- **Does NOT** create new migrations
- **Does NOT** prompt for input

### Quick Development Alternative

**For rapid prototyping:**
```bash
pnpm --filter backend run db:push
```

**What `db:push` does:**
- Skips migration files entirely
- Directly syncs schema to database
- **Runs** `db:generate` automatically
- Good for rapid prototyping
- **Risk**: Can lose data on schema conflicts

## Best Practices

1. **Development**: Use `db:migrate` for proper migration tracking
2. **Production**: Use `db:migrate:deploy` for safe deployments
3. **Prototyping**: Use `db:push` for quick schema testing
4. **Always run**: `db:generate` after manual schema changes
5. **Version control**: Always commit migration files to git

## Migration Files

Migration files are stored in `apps/backend/prisma/migrations/` and contain:
- **Timestamp** and **name** in folder structure
- **migration.sql** - The actual SQL commands
- **Auto-generated** from schema changes
- **Must be committed** to version control for production deployments