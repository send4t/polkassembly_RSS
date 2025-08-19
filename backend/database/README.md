# Database Structure

This folder contains all database-related files for the OpenGov Voting Tool.

## Folder Structure

```
database/
├── README.md                           # This file
├── schema.sql                          # Main database schema
├── migrations/                         # Database migration scripts
│   ├── 001_notion_to_sqlite_migration.sql
│   └── 002_initialize_config.sql
├── queries/                           # Common SQL queries
│   └── common_queries.sql
└── seeds/                             # Sample data for testing
    └── sample_data.sql
```

## Files Overview

### `schema.sql`
The main database schema that creates all tables, indexes, views, and triggers.

**Usage:**
```bash
# Create a new database
sqlite3 voting_tool.db < schema.sql
```

### `migrations/`
Scripts for migrating data and making database changes.

#### `001_notion_to_sqlite_migration.sql`
Migration script to help transition from Notion to SQLite:
- Migration helper functions
- Data validation queries
- Migration verification
- Rollback procedures

#### `002_initialize_config.sql`
Initializes the configuration table with default values.

**Usage:**
```bash
# Run migrations in order
sqlite3 voting_tool.db < migrations/001_notion_to_sqlite_migration.sql
sqlite3 voting_tool.db < migrations/002_initialize_config.sql
```

### `queries/`
Common SQL queries for different use cases.

#### `common_queries.sql`
Collection of SQL queries for:
- Single referendum operations
- Team collaboration workflows
- Voting management
- Statistics and reporting
- Search and filtering

**Usage:**
```bash
# Reference these queries in your application code
# or run them directly for testing
sqlite3 voting_tool.db < queries/common_queries.sql
```

### `seeds/`
Sample data for development and testing.

#### `sample_data.sql`
Sample data including:
- Team members
- Referendums with different statuses
- Scoring criteria
- Voting decisions
- Team role assignments
- Mimir transactions

**Usage:**
```bash
# Add sample data for testing
sqlite3 voting_tool.db < seeds/sample_data.sql
```

## Complete Setup Process

### 1. Create Database
```bash
sqlite3 voting_tool.db < schema.sql
```

### 2. Initialize Configuration (Optional)
```bash
sqlite3 voting_tool.db < migrations/002_initialize_config.sql
```

### 3. Add Sample Data (Optional)
```bash
sqlite3 voting_tool.db < seeds/sample_data.sql
```

### 4. Verify Setup
```bash
sqlite3 voting_tool.db ".tables"
sqlite3 voting_tool.db "SELECT COUNT(*) as total_referendums FROM referendums;"
```

## Migration from Notion

If migrating from an existing Notion database:

### 1. Export Notion Data
Use the Notion API to export your database.

### 2. Transform Data
Convert Notion's complex property structure to SQLite format.

### 3. Run Migration
```bash
sqlite3 voting_tool.db < migrations/001_notion_to_sqlite_migration.sql
```

### 4. Validate Migration
Check the migration verification queries in the migration script.

## Development Workflow

### Adding New Tables
1. Add table creation to `schema.sql`
2. Create migration script if needed
3. Update sample data if relevant

### Adding New Queries
1. Add to `queries/common_queries.sql` or create new query file
2. Document the query purpose
3. Add to sample data if needed for testing

### Database Changes
1. Create new migration script in `migrations/`
2. Test with sample data
3. Update documentation

## Best Practices

1. **Always backup** before running migrations
2. **Test migrations** with sample data first
3. **Use transactions** for complex operations
4. **Validate data** after migrations
5. **Document changes** in migration scripts

## Troubleshooting

### Common Issues

1. **Foreign Key Constraint Errors**
   - Ensure all referenced records exist
   - Check migration order

2. **Data Type Mismatches**
   - Verify data types match schema
   - Check for NULL values where not allowed

3. **Performance Issues**
   - Run `ANALYZE` after major changes
   - Check index usage with `EXPLAIN QUERY PLAN`

### Validation Queries

Run these to verify database integrity:
```sql
-- Check for orphaned records
SELECT COUNT(*) FROM scoring_criteria sc 
LEFT JOIN referendums r ON sc.referendum_id = r.id 
WHERE r.id IS NULL;

-- Check for invalid scores
SELECT COUNT(*) FROM scoring_criteria 
WHERE necessity_score < 1 OR necessity_score > 5;
``` 