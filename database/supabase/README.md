# Supabase Database Setup

This directory contains the SQL schema files for setting up your Supabase database.

## Files

### `schema-simple.sql`

#### Recommended for initial setup and testing

- Creates tables without authentication requirements
- Includes all necessary tables: `pets`, `health_entries`, `users`, `sync_queue`
- Includes indexes and constraints
- Adds a test user for initial testing
- **Use this file first to get started quickly**

### `schema-with-auth.sql`

#### For production with authentication

- Includes Row Level Security (RLS) policies
- Requires Supabase Auth to be set up
- More secure but requires user authentication
- **Use this when you're ready to add user authentication**

## How to Use

### Step 1: Go to Supabase Dashboard

1. Visit: [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project: `ewecisixnudncfvdjvwxj`

### Step 2: Open SQL Editor

1. Click **"SQL Editor"** in the left sidebar
2. Click **"New query"**

### Step 3: Run the Schema

1. Copy the content from `schema-simple.sql`
2. Paste it into the SQL Editor
3. Click **"Run"** to execute

### Step 4: Verify Tables

1. Go to **"Table Editor"** in the left sidebar
2. You should see: `pets`, `health_entries`, `users`, `sync_queue`

## Table Structure

### `pets`

- Stores pet information (name, type, breed, etc.)
- Primary key: `id` (TEXT)
- Includes health score and last checkup info

### `health_entries`

- Stores health records for pets
- Foreign key to `pets.id`
- Includes type, severity, date, time
- Supports: symptom, medication, appointment, behavior, vitals, feeding, hydration, examination

### `users`

- Stores user profile information
- Primary key: `id` (TEXT for simple, UUID for auth version)
- Includes name, email, avatar, member since date

### `sync_queue`

- Tracks data synchronization between local and cloud
- Stores operations: INSERT, UPDATE, DELETE
- Used for offline-first functionality

## Column Naming

The schema uses **snake_case** for column names (Supabase convention):

- `petId` → `pet_id`
- `userName` → `user_name`
- `createdAt` → `created_at`
- `syncedToCloud` → `synced_to_cloud`

See `config/supabase.ts` for column mapping between local camelCase and Supabase snake_case.

## File Organization

All database-related files are now organized in the `database/` folder:

```jsx
database/
├── types.ts              # Database type definitions and interfaces
├── DatabaseService.ts    # Local SQLite database service
├── SupabaseService.ts    # Supabase cloud database service
├── schema.ts            # Local SQLite schema
└── supabase/
    ├── README.md        # This documentation
    ├── schema-simple.sql # Simple schema (no auth)
    └── schema-with-auth.sql # Full schema with RLS
```

## Testing

After running the schema:

1. Open your app
2. Navigate to the main screen
3. Use the **DatabaseTest** component to verify the connection
4. You should see: `Supabase connection successful`
