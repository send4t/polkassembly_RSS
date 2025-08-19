# SQLite Database Migration Guide

This guide explains how to migrate from the Notion database to a local SQLite database for the OpenGov Voting Tool.

## Overview

The migration involves replacing the Notion database with a local SQLite database that provides:
- Better performance for single referendum operations
- Offline capability for browser extensions
- Reduced API rate limiting issues
- More flexible querying and data manipulation

## Files Overview

### 1. `database_schema.sql`
The main database schema that creates all necessary tables, indexes, views, and triggers.

**Key Features:**
- **Core Tables**: `referendums`, `scoring_criteria`, `team_members`, `voting_decisions`
- **Collaboration Tables**: `referendum_team_roles` for team workflow management
- **Integration Tables**: `mimir_transactions` for Mimir multisig integration
- **Audit Tables**: `audit_log` for tracking all changes
- **Views**: Pre-built views for common queries
- **Triggers**: Automatic timestamp updates and data validation

### 2. `common_queries.sql`
A collection of SQL queries for common operations, especially useful for:
- Browser extension integration
- Single referendum operations
- Team collaboration workflows
- Voting management
- Statistics and reporting

### 3. `migration_script.sql`
Helper script for migrating data from Notion to SQLite, including:
- Sample data for testing
- Data validation queries
- Migration helper functions
- Rollback procedures

## Installation and Setup

### 1. Create the Database

```bash
# Create a new SQLite database
sqlite3 voting_tool.db < database_schema.sql
```

### 2. Initialize with Sample Data (Optional)

```bash
# Add sample data for testing
sqlite3 voting_tool.db < migration_script.sql
```

### 3. Verify Installation

```bash
# Check that tables were created correctly
sqlite3 voting_tool.db ".tables"

# Verify sample data
sqlite3 voting_tool.db "SELECT COUNT(*) as total_referendums FROM referendums;"
```

## Key Database Features

### Referendum Management
- **Single Referendum Operations**: Efficient queries for fetching individual referendums by `post_id` and `chain`
- **Scoring System**: 10-criteria scoring system with automatic average calculation
- **Status Tracking**: Complete workflow status management from "Not started" to "Voted"

### Team Collaboration
- **Role Assignment**: Team members can be assigned different roles per referendum
- **Workflow Support**: Supports the complete DAO workflow with responsible persons, agreement tracking, etc.
- **Audit Trail**: Complete history of all changes with user attribution

### Voting Integration
- **Mimir Integration**: Tracks Mimir multisig transactions and their status
- **Vote Execution**: Records when votes are executed on-chain
- **Decision Tracking**: Maintains both suggested and final vote decisions

## Common Use Cases

### Browser Extension Integration

The database is optimized for browser extension use cases:

```sql
-- Get a single referendum for overlay display
SELECT 
    r.*,
    sc.ref_score,
    vd.suggested_vote,
    vd.final_vote
FROM referendums r
LEFT JOIN scoring_criteria sc ON r.id = sc.referendum_id
LEFT JOIN voting_decisions vd ON r.id = vd.referendum_id
WHERE r.post_id = ? AND r.chain = ?;
```

### Single Referendum Operations

Instead of downloading all referendums, you can now fetch just one:

```sql
-- Check if referendum exists
SELECT COUNT(*) as exists 
FROM referendums 
WHERE post_id = ? AND chain = ?;

-- Get referendum with all related data
SELECT 
    r.*,
    sc.*,
    vd.*,
    GROUP_CONCAT(DISTINCT tm.name || ':' || rtr.role_type) as team_roles
FROM referendums r
LEFT JOIN scoring_criteria sc ON r.id = sc.referendum_id
LEFT JOIN voting_decisions vd ON r.id = vd.referendum_id
LEFT JOIN referendum_team_roles rtr ON r.id = rtr.referendum_id
LEFT JOIN team_members tm ON rtr.team_member_id = tm.id
WHERE r.post_id = ? AND r.chain = ?
GROUP BY r.id;
```

### Team Workflow Management

```sql
-- Get referendums assigned to a team member
SELECT 
    r.post_id,
    r.chain,
    r.title,
    r.internal_status,
    rtr.role_type
FROM referendums r
JOIN referendum_team_roles rtr ON r.id = rtr.referendum_id
JOIN team_members tm ON rtr.team_member_id = tm.id
WHERE tm.name = ?
ORDER BY r.created_at DESC;
```

## Migration from Notion

### Step 1: Export Notion Data
1. Use the Notion API to export all pages from your database
2. Convert the complex Notion property structure to the SQLite format
3. Use the mapping table in `migration_script.sql` as a reference

### Step 2: Data Transformation
The Notion property structure needs to be transformed:

```javascript
// Example transformation function
function transformNotionToSQLite(notionPage) {
    return {
        post_id: extractNumber(notionPage.properties['Number']),
        chain: extractSelect(notionPage.properties['Chain']),
        title: extractText(notionPage.properties['Title']),
        // ... other fields
    };
}
```

### Step 3: Import Data
```bash
# Import transformed data
sqlite3 voting_tool.db < your_transformed_data.sql
```

### Step 4: Validate Migration
```bash
# Run validation queries
sqlite3 voting_tool.db < migration_script.sql
```

## Performance Optimizations

### Indexes
The schema includes optimized indexes for:
- `post_id` and `chain` lookups (for single referendum operations)
- `internal_status` filtering
- `voting_end_date` for expiring referendums
- `ref_score` for prioritization

### Views
Pre-built views for common queries:
- `ready_to_vote_referendums`: Referendums ready for voting
- `pending_evaluation_referendums`: Referendums needing evaluation
- `completed_votes`: Historical voting data

### Triggers
Automatic updates for:
- `updated_at` timestamps
- Calculated `ref_score` values
- Audit log entries

## Browser Extension Integration

### Database Location
For browser extensions, the SQLite database should be stored in the extension's local storage or a dedicated directory.

### Query Optimization
The database is designed for efficient single-referendum operations:
- Primary key on `(post_id, chain)` for fast lookups
- Denormalized data structure to minimize joins
- Pre-calculated scores and status fields

### Offline Capability
The local SQLite database enables:
- Offline referendum viewing and scoring
- Local caching of referendum data
- Reduced API calls to external services

## Maintenance and Backup

### Regular Maintenance
```sql
-- Clean up old audit logs
DELETE FROM audit_log 
WHERE changed_at < datetime('now', '-30 days');

-- Update table statistics
ANALYZE;
```

### Backup Strategy
```bash
# Create backup
cp voting_tool.db voting_tool_backup_$(date +%Y%m%d).db

# Restore from backup
cp voting_tool_backup_20240101.db voting_tool.db
```

## Troubleshooting

### Common Issues

1. **Foreign Key Constraint Errors**
   - Ensure all referenced records exist before inserting
   - Use `INSERT OR IGNORE` for optional relationships

2. **Performance Issues**
   - Run `ANALYZE` to update table statistics
   - Check that indexes are being used with `EXPLAIN QUERY PLAN`

3. **Data Integrity Issues**
   - Run validation queries from `migration_script.sql`
   - Check for orphaned records and clean them up

### Validation Queries
```sql
-- Check for data integrity issues
SELECT 
    'Referendums without scoring criteria' as check_type,
    COUNT(*) as count
FROM referendums r
LEFT JOIN scoring_criteria sc ON r.id = sc.referendum_id
WHERE sc.id IS NULL;
```

## Next Steps

1. **Implement Database Layer**: Create TypeScript interfaces and database access functions
2. **Update API Endpoints**: Modify existing endpoints to use SQLite instead of Notion
3. **Browser Extension**: Implement the overlay UI using the local database
4. **Testing**: Validate all workflows with the new database structure
5. **Migration**: Plan and execute the migration from Notion to SQLite

## Support

For questions or issues with the database migration:
1. Check the validation queries in `migration_script.sql`
2. Review the common queries in `common_queries.sql`
3. Ensure all foreign key constraints are satisfied
4. Verify that indexes are being used for performance-critical queries 