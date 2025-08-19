-- Migration Script: Notion to SQLite
-- This script helps migrate data from Notion to the new SQLite database

-- ============================================================================
-- MIGRATION HELPER FUNCTIONS
-- ============================================================================

-- Function to safely insert referendum data
-- This handles the transition from Notion's complex property structure to SQLite
CREATE TEMP TABLE temp_referendum_import (
    post_id INTEGER,
    chain TEXT,
    title TEXT,
    description TEXT,
    requested_amount_usd REAL,
    origin TEXT,
    referendum_timeline TEXT,
    internal_status TEXT,
    link TEXT,
    voting_start_date TEXT,
    voting_end_date TEXT,
    vote_executed_date TEXT,
    created_at TEXT,
    last_edited_by TEXT,
    public_comment TEXT,
    public_comment_made BOOLEAN,
    ai_summary TEXT,
    reason_for_vote TEXT,
    reason_for_no_way TEXT
);

-- Function to validate referendum data before insertion
CREATE TEMP TABLE temp_validation_errors (
    post_id INTEGER,
    chain TEXT,
    error_message TEXT
);

-- ============================================================================
-- SAMPLE DATA INSERTION (for testing)
-- ============================================================================

-- Insert sample team members
INSERT OR IGNORE INTO team_members (name, email) VALUES
('Alice Johnson', 'alice@dao.com'),
('Bob Smith', 'bob@dao.com'),
('Carol Davis', 'carol@dao.com'),
('David Wilson', 'david@dao.com');

-- Insert sample referendums
INSERT OR IGNORE INTO referendums (
    post_id, chain, title, description, requested_amount_usd, 
    origin, referendum_timeline, internal_status, link, 
    voting_start_date, voting_end_date, created_at
) VALUES
(1001, 'Polkadot', 'Sample Polkadot Referendum 1', 'This is a sample referendum for testing purposes.', 50000.0,
 'Root', 'Deciding', 'Not started', 'https://polkadot.polkassembly.io/referenda/1001',
 '2024-01-01T00:00:00Z', '2024-01-29T00:00:00Z', '2024-01-01T00:00:00Z'),

(1002, 'Polkadot', 'Sample Polkadot Referendum 2', 'Another sample referendum with different status.', 25000.0,
 'Treasurer', 'Submitted', 'Considering', 'https://polkadot.polkassembly.io/referenda/1002',
 '2024-01-02T00:00:00Z', '2024-01-30T00:00:00Z', '2024-01-02T00:00:00Z'),

(2001, 'Kusama', 'Sample Kusama Referendum 1', 'A Kusama network referendum for testing.', 15000.0,
 'SmallTipper', 'Deciding', 'Ready to vote', 'https://kusama.polkassembly.io/referenda/2001',
 '2024-01-03T00:00:00Z', '2024-01-17T00:00:00Z', '2024-01-03T00:00:00Z'),

(2002, 'Kusama', 'Sample Kusama Referendum 2', 'Another Kusama referendum with completed voting.', 75000.0,
 'BigSpender', 'Executed', 'Voted 👍 Aye 👍', 'https://kusama.polkassembly.io/referenda/2002',
 '2023-12-01T00:00:00Z', '2023-12-15T00:00:00Z', '2023-12-01T00:00:00Z');

-- Insert sample scoring criteria
INSERT OR IGNORE INTO scoring_criteria (
    referendum_id, necessity_score, funding_score, competition_score, 
    blueprint_score, track_record_score, reports_score, synergy_score, 
    revenue_score, security_score, open_source_score
) VALUES
((SELECT id FROM referendums WHERE post_id = 1001 AND chain = 'Polkadot'), 4, 3, 5, 4, 3, 4, 5, 2, 4, 5),
((SELECT id FROM referendums WHERE post_id = 1002 AND chain = 'Polkadot'), 3, 4, 3, 3, 4, 3, 4, 3, 3, 4),
((SELECT id FROM referendums WHERE post_id = 2001 AND chain = 'Kusama'), 5, 4, 4, 5, 4, 5, 4, 3, 5, 4),
((SELECT id FROM referendums WHERE post_id = 2002 AND chain = 'Kusama'), 4, 5, 3, 4, 5, 4, 3, 4, 4, 5);

-- Insert sample voting decisions
INSERT OR IGNORE INTO voting_decisions (
    referendum_id, suggested_vote, final_vote, vote_executed, vote_executed_date
) VALUES
((SELECT id FROM referendums WHERE post_id = 2001 AND chain = 'Kusama'), '👍 Aye 👍', '👍 Aye 👍', FALSE, NULL),
((SELECT id FROM referendums WHERE post_id = 2002 AND chain = 'Kusama'), '👍 Aye 👍', '👍 Aye 👍', TRUE, '2023-12-15T10:30:00Z');

-- Insert sample team roles
INSERT OR IGNORE INTO referendum_team_roles (referendum_id, team_member_id, role_type) VALUES
((SELECT id FROM referendums WHERE post_id = 1001 AND chain = 'Polkadot'), (SELECT id FROM team_members WHERE name = 'Alice Johnson'), 'responsible_person'),
((SELECT id FROM referendums WHERE post_id = 1002 AND chain = 'Polkadot'), (SELECT id FROM team_members WHERE name = 'Bob Smith'), 'responsible_person'),
((SELECT id FROM referendums WHERE post_id = 2001 AND chain = 'Kusama'), (SELECT id FROM team_members WHERE name = 'Carol Davis'), 'responsible_person'),
((SELECT id FROM referendums WHERE post_id = 2001 AND chain = 'Kusama'), (SELECT id FROM team_members WHERE name = 'Alice Johnson'), 'agree'),
((SELECT id FROM referendums WHERE post_id = 2001 AND chain = 'Kusama'), (SELECT id FROM team_members WHERE name = 'Bob Smith'), 'agree');

-- ============================================================================
-- DATA VALIDATION QUERIES
-- ============================================================================

-- Validate referendum data integrity
SELECT 
    'Referendums without scoring criteria' as check_type,
    COUNT(*) as count
FROM referendums r
LEFT JOIN scoring_criteria sc ON r.id = sc.referendum_id
WHERE sc.id IS NULL
UNION ALL
SELECT 
    'Referendums with invalid chain values' as check_type,
    COUNT(*) as count
FROM referendums
WHERE chain NOT IN ('Polkadot', 'Kusama')
UNION ALL
SELECT 
    'Referendums with invalid internal status' as check_type,
    COUNT(*) as count
FROM referendums
WHERE internal_status NOT IN (
    'Not started', 'Considering', 'Ready for approval', 'Waiting for agreement',
    'Ready to vote', 'Reconsidering', 'Voted 👍 Aye 👍', 'Voted 👎 Nay 👎',
    'Voted ✌️ Abstain ✌️', 'Not Voted'
)
UNION ALL
SELECT 
    'Scoring criteria with invalid scores' as check_type,
    COUNT(*) as count
FROM scoring_criteria
WHERE necessity_score < 1 OR necessity_score > 5
   OR funding_score < 1 OR funding_score > 5
   OR competition_score < 1 OR competition_score > 5
   OR blueprint_score < 1 OR blueprint_score > 5
   OR track_record_score < 1 OR track_record_score > 5
   OR reports_score < 1 OR reports_score > 5
   OR synergy_score < 1 OR synergy_score > 5
   OR revenue_score < 1 OR revenue_score > 5
   OR security_score < 1 OR security_score > 5
   OR open_source_score < 1 OR open_source_score > 5;

-- ============================================================================
-- MIGRATION FROM NOTION DATA STRUCTURE
-- ============================================================================

-- Helper function to convert Notion property to SQLite value
-- This would be used when migrating actual Notion data
CREATE TEMP TABLE notion_property_mapping (
    notion_property_name TEXT,
    sqlite_column_name TEXT,
    conversion_type TEXT, -- 'direct', 'extract_text', 'extract_number', 'extract_select', 'extract_status'
    default_value TEXT
);

INSERT INTO notion_property_mapping VALUES
('Title', 'title', 'extract_text', ''),
('Number', 'post_id', 'extract_number', '0'),
('Requested $', 'requested_amount_usd', 'extract_number', '0'),
('Chain', 'chain', 'extract_select', ''),
('Origin', 'origin', 'extract_select', ''),
('Referendum timeline', 'referendum_timeline', 'extract_status', ''),
('Internal status', 'internal_status', 'extract_status', 'Not started'),
('Link', 'link', 'extract_url', ''),
('Voting', 'voting_start_date', 'extract_date_start', ''),
('Vote Executed', 'vote_executed_date', 'extract_date', ''),
('Created time', 'created_at', 'extract_date', ''),
('Last edited by', 'last_edited_by', 'extract_user', ''),
('Public comment', 'public_comment', 'extract_text', ''),
('Public comment made', 'public_comment_made', 'extract_checkbox', 'FALSE'),
('AI Summary', 'ai_summary', 'extract_text', ''),
('Reason for vote', 'reason_for_vote', 'extract_text', ''),
('Reason for NO WAY', 'reason_for_no_way', 'extract_text', '');

-- ============================================================================
-- DATA CLEANUP AND MAINTENANCE
-- ============================================================================

-- Clean up orphaned records
DELETE FROM scoring_criteria 
WHERE referendum_id NOT IN (SELECT id FROM referendums);

DELETE FROM voting_decisions 
WHERE referendum_id NOT IN (SELECT id FROM referendums);

DELETE FROM referendum_team_roles 
WHERE referendum_id NOT IN (SELECT id FROM referendums)
   OR team_member_id NOT IN (SELECT id FROM team_members);

DELETE FROM mimir_transactions 
WHERE referendum_id NOT IN (SELECT id FROM referendums);

-- Update calculated fields
UPDATE scoring_criteria 
SET ref_score = ROUND(
    (COALESCE(necessity_score, 0) + 
     COALESCE(funding_score, 0) + 
     COALESCE(competition_score, 0) + 
     COALESCE(blueprint_score, 0) + 
     COALESCE(track_record_score, 0) + 
     COALESCE(reports_score, 0) + 
     COALESCE(synergy_score, 0) + 
     COALESCE(revenue_score, 0) + 
     COALESCE(security_score, 0) + 
     COALESCE(open_source_score, 0)) / 10.0, 2
);

-- ============================================================================
-- PERFORMANCE OPTIMIZATION
-- ============================================================================

-- Analyze tables for query optimization
ANALYZE;

-- Update table statistics
ANALYZE referendums;
ANALYZE scoring_criteria;
ANALYZE voting_decisions;
ANALYZE team_members;
ANALYZE referendum_team_roles;

-- ============================================================================
-- MIGRATION VERIFICATION
-- ============================================================================

-- Verify migration success
SELECT 
    'Total referendums' as metric,
    COUNT(*) as value
FROM referendums
UNION ALL
SELECT 
    'Referendums with scoring' as metric,
    COUNT(*) as value
FROM referendums r
JOIN scoring_criteria sc ON r.id = sc.referendum_id
UNION ALL
SELECT 
    'Referendums with voting decisions' as metric,
    COUNT(*) as value
FROM referendums r
JOIN voting_decisions vd ON r.id = vd.referendum_id
UNION ALL
SELECT 
    'Team members' as metric,
    COUNT(*) as value
FROM team_members
UNION ALL
SELECT 
    'Team role assignments' as metric,
    COUNT(*) as value
FROM referendum_team_roles
UNION ALL
SELECT 
    'Average score' as metric,
    ROUND(AVG(sc.ref_score), 2) as value
FROM scoring_criteria sc
WHERE sc.ref_score > 0;

-- ============================================================================
-- ROLLBACK PLAN (if needed)
-- ============================================================================

-- Create backup tables before major changes
-- (Uncomment these lines if you need to create backups)

/*
CREATE TABLE referendums_backup AS SELECT * FROM referendums;
CREATE TABLE scoring_criteria_backup AS SELECT * FROM scoring_criteria;
CREATE TABLE voting_decisions_backup AS SELECT * FROM voting_decisions;
CREATE TABLE team_members_backup AS SELECT * FROM team_members;
CREATE TABLE referendum_team_roles_backup AS SELECT * FROM referendum_team_roles;
*/

-- Rollback function (if needed)
-- (Uncomment these lines if you need to rollback)

/*
DROP TABLE IF EXISTS referendums;
DROP TABLE IF EXISTS scoring_criteria;
DROP TABLE IF EXISTS voting_decisions;
DROP TABLE IF EXISTS team_members;
DROP TABLE IF EXISTS referendum_team_roles;

ALTER TABLE referendums_backup RENAME TO referendums;
ALTER TABLE scoring_criteria_backup RENAME TO scoring_criteria;
ALTER TABLE voting_decisions_backup RENAME TO voting_decisions;
ALTER TABLE team_members_backup RENAME TO team_members;
ALTER TABLE referendum_team_roles_backup RENAME TO referendum_team_roles;
*/ 