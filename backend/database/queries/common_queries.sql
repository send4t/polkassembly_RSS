-- Common SQL Queries for OpenGov Voting Tool
-- These queries support the browser extension and single referendum operations

-- ============================================================================
-- SINGLE REFERENDUM OPERATIONS
-- ============================================================================

-- Get a single referendum by post_id and chain
-- Used when browser extension needs to fetch specific referendum data
SELECT 
    r.*,
    sc.*,
    vd.suggested_vote,
    vd.final_vote,
    vd.vote_executed,
    vd.vote_executed_date,
    GROUP_CONCAT(DISTINCT tm.name || ':' || rtr.role_type) as team_roles
FROM referendums r
LEFT JOIN scoring_criteria sc ON r.id = sc.referendum_id
LEFT JOIN voting_decisions vd ON r.id = vd.referendum_id
LEFT JOIN referendum_team_roles rtr ON r.id = rtr.referendum_id
LEFT JOIN team_members tm ON rtr.team_member_id = tm.id
WHERE r.post_id = ? AND r.chain = ?
GROUP BY r.id;

-- Get referendum with all related data (for detailed view)
SELECT 
    r.*,
    sc.necessity_score,
    sc.funding_score,
    sc.competition_score,
    sc.blueprint_score,
    sc.track_record_score,
    sc.reports_score,
    sc.synergy_score,
    sc.revenue_score,
    sc.security_score,
    sc.open_source_score,
    sc.ref_score,
    vd.suggested_vote,
    vd.final_vote,
    vd.vote_executed,
    vd.vote_executed_date,
    mt.calldata as mimir_calldata,
    mt.status as mimir_status,
    mt.extrinsic_hash as mimir_extrinsic_hash
FROM referendums r
LEFT JOIN scoring_criteria sc ON r.id = sc.referendum_id
LEFT JOIN voting_decisions vd ON r.id = vd.referendum_id
LEFT JOIN mimir_transactions mt ON r.id = mt.referendum_id
WHERE r.post_id = ? AND r.chain = ?;

-- ============================================================================
-- TEAM COLLABORATION QUERIES
-- ============================================================================

-- Get team members and their roles for a specific referendum
SELECT 
    tm.name,
    tm.email,
    rtr.role_type,
    rtr.created_at as role_assigned_at
FROM referendum_team_roles rtr
JOIN team_members tm ON rtr.team_member_id = tm.id
WHERE rtr.referendum_id = (SELECT id FROM referendums WHERE post_id = ? AND chain = ?)
ORDER BY rtr.created_at;

-- Get referendums assigned to a specific team member
SELECT 
    r.id,
    r.post_id,
    r.chain,
    r.title,
    r.internal_status,
    r.created_at,
    rtr.role_type
FROM referendums r
JOIN referendum_team_roles rtr ON r.id = rtr.referendum_id
JOIN team_members tm ON rtr.team_member_id = tm.id
WHERE tm.name = ?
ORDER BY r.created_at DESC;

-- ============================================================================
-- SCORING QUERIES
-- ============================================================================

-- Update scoring criteria for a referendum
UPDATE scoring_criteria 
SET 
    necessity_score = ?,
    funding_score = ?,
    competition_score = ?,
    blueprint_score = ?,
    track_record_score = ?,
    reports_score = ?,
    synergy_score = ?,
    revenue_score = ?,
    security_score = ?,
    open_source_score = ?,
    updated_at = datetime('now')
WHERE referendum_id = (SELECT id FROM referendums WHERE post_id = ? AND chain = ?);

-- Insert scoring criteria if it doesn't exist
INSERT OR IGNORE INTO scoring_criteria (
    referendum_id,
    necessity_score,
    funding_score,
    competition_score,
    blueprint_score,
    track_record_score,
    reports_score,
    synergy_score,
    revenue_score,
    security_score,
    open_source_score
) VALUES (
    (SELECT id FROM referendums WHERE post_id = ? AND chain = ?),
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
);

-- Get referendums with high scores (for prioritization)
SELECT 
    r.post_id,
    r.chain,
    r.title,
    r.requested_amount_usd,
    sc.ref_score,
    r.internal_status
FROM referendums r
JOIN scoring_criteria sc ON r.id = sc.referendum_id
WHERE sc.ref_score >= 4.0
  AND r.internal_status IN ('Not started', 'Considering')
ORDER BY sc.ref_score DESC, r.created_at;

-- ============================================================================
-- VOTING QUERIES
-- ============================================================================

-- Update voting decision
INSERT OR REPLACE INTO voting_decisions (
    referendum_id,
    suggested_vote,
    final_vote,
    vote_executed,
    vote_executed_date,
    updated_at
) VALUES (
    (SELECT id FROM referendums WHERE post_id = ? AND chain = ?),
    ?,
    ?,
    ?,
    ?,
    datetime('now')
);

-- Get referendums ready for voting
SELECT 
    r.id,
    r.post_id,
    r.chain,
    r.title,
    r.requested_amount_usd,
    r.voting_end_date,
    vd.suggested_vote,
    sc.ref_score
FROM referendums r
LEFT JOIN voting_decisions vd ON r.id = vd.referendum_id
LEFT JOIN scoring_criteria sc ON r.id = sc.referendum_id
WHERE r.internal_status = 'Ready to vote'
  AND r.voting_end_date > datetime('now')
  AND (vd.vote_executed IS NULL OR vd.vote_executed = FALSE)
ORDER BY r.voting_end_date;

-- ============================================================================
-- STATUS UPDATE QUERIES
-- ============================================================================

-- Update internal status
UPDATE referendums 
SET 
    internal_status = ?,
    last_edited_by = ?,
    updated_at = datetime('now')
WHERE post_id = ? AND chain = ?;

-- Update referendum timeline status
UPDATE referendums 
SET 
    referendum_timeline = ?,
    updated_at = datetime('now')
WHERE post_id = ? AND chain = ?;

-- ============================================================================
-- SEARCH AND FILTER QUERIES
-- ============================================================================

-- Search referendums by title or description
SELECT 
    r.id,
    r.post_id,
    r.chain,
    r.title,
    r.internal_status,
    r.created_at,
    sc.ref_score
FROM referendums r
LEFT JOIN scoring_criteria sc ON r.id = sc.referendum_id
WHERE r.title LIKE '%' || ? || '%'
   OR r.description LIKE '%' || ? || '%'
ORDER BY r.created_at DESC;

-- Filter referendums by multiple criteria
SELECT 
    r.id,
    r.post_id,
    r.chain,
    r.title,
    r.requested_amount_usd,
    r.internal_status,
    r.referendum_timeline,
    r.created_at,
    sc.ref_score
FROM referendums r
LEFT JOIN scoring_criteria sc ON r.id = sc.referendum_id
WHERE (? IS NULL OR r.chain = ?)
  AND (? IS NULL OR r.internal_status = ?)
  AND (? IS NULL OR r.referendum_timeline = ?)
  AND (? IS NULL OR r.requested_amount_usd >= ?)
  AND (? IS NULL OR r.requested_amount_usd <= ?)
  AND (? IS NULL OR sc.ref_score >= ?)
ORDER BY r.created_at DESC;

-- ============================================================================
-- STATISTICS QUERIES
-- ============================================================================

-- Get voting statistics
SELECT 
    COUNT(*) as total_referendums,
    COUNT(CASE WHEN vd.final_vote = '👍 Aye 👍' THEN 1 END) as aye_votes,
    COUNT(CASE WHEN vd.final_vote = '👎 Nay 👎' THEN 1 END) as nay_votes,
    COUNT(CASE WHEN vd.final_vote = '✌️ Abstain ✌️' THEN 1 END) as abstain_votes,
    COUNT(CASE WHEN vd.vote_executed = TRUE THEN 1 END) as executed_votes,
    AVG(sc.ref_score) as average_score
FROM referendums r
LEFT JOIN voting_decisions vd ON r.id = vd.referendum_id
LEFT JOIN scoring_criteria sc ON r.id = sc.referendum_id
WHERE r.chain = ?;

-- Get team member activity statistics
SELECT 
    tm.name,
    COUNT(DISTINCT rtr.referendum_id) as assigned_referendums,
    COUNT(CASE WHEN rtr.role_type = 'responsible_person' THEN 1 END) as responsible_for,
    COUNT(CASE WHEN rtr.role_type = 'agree' THEN 1 END) as agreed_with,
    COUNT(CASE WHEN rtr.role_type = 'no_way' THEN 1 END) as opposed
FROM team_members tm
LEFT JOIN referendum_team_roles rtr ON tm.id = rtr.team_member_id
GROUP BY tm.id, tm.name
ORDER BY assigned_referendums DESC;

-- ============================================================================
-- AUDIT AND HISTORY QUERIES
-- ============================================================================

-- Get audit log for a specific referendum
SELECT 
    al.table_name,
    al.action,
    al.old_values,
    al.new_values,
    al.changed_by,
    al.changed_at
FROM audit_log al
WHERE al.referendum_id = (SELECT id FROM referendums WHERE post_id = ? AND chain = ?)
ORDER BY al.changed_at DESC;

-- Get recent changes across all referendums
SELECT 
    r.post_id,
    r.chain,
    r.title,
    al.table_name,
    al.action,
    al.changed_by,
    al.changed_at
FROM audit_log al
JOIN referendums r ON al.referendum_id = r.id
ORDER BY al.changed_at DESC
LIMIT ?;

-- ============================================================================
-- CONFIGURATION QUERIES
-- ============================================================================

-- Get configuration value
SELECT value FROM app_config WHERE key = ?;

-- Update configuration value
UPDATE app_config 
SET value = ?, updated_at = datetime('now') 
WHERE key = ?;

-- Get all configuration
SELECT key, value, description FROM app_config ORDER BY key;

-- ============================================================================
-- MIMIR INTEGRATION QUERIES
-- ============================================================================

-- Record Mimir transaction
INSERT INTO mimir_transactions (
    referendum_id,
    calldata,
    timestamp,
    status
) VALUES (
    (SELECT id FROM referendums WHERE post_id = ? AND chain = ?),
    ?,
    ?,
    'pending'
);

-- Update Mimir transaction status
UPDATE mimir_transactions 
SET 
    status = ?,
    extrinsic_hash = ?
WHERE referendum_id = (SELECT id FROM referendums WHERE post_id = ? AND chain = ?)
  AND status = 'pending';

-- Get pending Mimir transactions
SELECT 
    r.post_id,
    r.chain,
    r.title,
    mt.calldata,
    mt.timestamp,
    mt.created_at
FROM mimir_transactions mt
JOIN referendums r ON mt.referendum_id = r.id
WHERE mt.status = 'pending'
ORDER BY mt.created_at;

-- ============================================================================
-- UTILITY QUERIES
-- ============================================================================

-- Check if referendum exists
SELECT COUNT(*) as exists 
FROM referendums 
WHERE post_id = ? AND chain = ?;

-- Get referendum count by status
SELECT 
    internal_status,
    COUNT(*) as count
FROM referendums 
GROUP BY internal_status
ORDER BY count DESC;

-- Get referendums expiring soon (within 24 hours)
SELECT 
    r.id,
    r.post_id,
    r.chain,
    r.title,
    r.voting_end_date,
    r.internal_status,
    vd.suggested_vote
FROM referendums r
LEFT JOIN voting_decisions vd ON r.id = vd.referendum_id
WHERE r.voting_end_date BETWEEN datetime('now') AND datetime('now', '+1 day')
  AND r.internal_status != 'Voted 👍 Aye 👍'
  AND r.internal_status != 'Voted 👎 Nay 👎'
  AND r.internal_status != 'Voted ✌️ Abstain ✌️'
ORDER BY r.voting_end_date;

-- Clean up old audit logs (keep last 30 days)
DELETE FROM audit_log 
WHERE changed_at < datetime('now', '-30 days'); 