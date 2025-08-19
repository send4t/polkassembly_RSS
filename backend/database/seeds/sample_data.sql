-- Sample Data for Testing
-- This file contains sample data for development and testing purposes
-- Run this after creating the database schema

-- ============================================================================
-- SAMPLE TEAM MEMBERS
-- ============================================================================

INSERT OR IGNORE INTO team_members (name, email) VALUES
('Alice Johnson', 'alice@dao.com'),
('Bob Smith', 'bob@dao.com'),
('Carol Davis', 'carol@dao.com'),
('David Wilson', 'david@dao.com'),
('Eve Brown', 'eve@dao.com');

-- ============================================================================
-- SAMPLE REFERENDUMS
-- ============================================================================

INSERT OR IGNORE INTO referendums (
    post_id, chain, title, description, requested_amount_usd, 
    origin, referendum_timeline, internal_status, link, 
    voting_start_date, voting_end_date, created_at
) VALUES
(1001, 'Polkadot', 'Sample Polkadot Referendum 1', 'This is a sample referendum for testing purposes. It demonstrates the basic functionality of the voting tool.', 50000.0,
 'Root', 'Deciding', 'Not started', 'https://polkadot.polkassembly.io/referenda/1001',
 '2024-01-01T00:00:00Z', '2024-01-29T00:00:00Z', '2024-01-01T00:00:00Z'),

(1002, 'Polkadot', 'Sample Polkadot Referendum 2', 'Another sample referendum with different status. This one is being considered by the team.', 25000.0,
 'Treasurer', 'Submitted', 'Considering', 'https://polkadot.polkassembly.io/referenda/1002',
 '2024-01-02T00:00:00Z', '2024-01-30T00:00:00Z', '2024-01-02T00:00:00Z'),

(1003, 'Polkadot', 'Sample Polkadot Referendum 3', 'A referendum that is ready for approval after team evaluation.', 75000.0,
 'BigSpender', 'Deciding', 'Ready for approval', 'https://polkadot.polkassembly.io/referenda/1003',
 '2024-01-03T00:00:00Z', '2024-01-31T00:00:00Z', '2024-01-03T00:00:00Z'),

(2001, 'Kusama', 'Sample Kusama Referendum 1', 'A Kusama network referendum that is ready for voting.', 15000.0,
 'SmallTipper', 'Deciding', 'Ready to vote', 'https://kusama.polkassembly.io/referenda/2001',
 '2024-01-03T00:00:00Z', '2024-01-17T00:00:00Z', '2024-01-03T00:00:00Z'),

(2002, 'Kusama', 'Sample Kusama Referendum 2', 'A completed Kusama referendum with executed voting.', 75000.0,
 'BigSpender', 'Executed', 'Voted 👍 Aye 👍', 'https://kusama.polkassembly.io/referenda/2002',
 '2023-12-01T00:00:00Z', '2023-12-15T00:00:00Z', '2023-12-01T00:00:00Z'),

(2003, 'Kusama', 'Sample Kusama Referendum 3', 'A referendum that was rejected by the team.', 30000.0,
 'MediumSpender', 'Rejected', 'Voted 👎 Nay 👎', 'https://kusama.polkassembly.io/referenda/2003',
 '2023-11-01T00:00:00Z', '2023-11-15T00:00:00Z', '2023-11-01T00:00:00Z');

-- ============================================================================
-- SAMPLE SCORING CRITERIA
-- ============================================================================

INSERT OR IGNORE INTO scoring_criteria (
    referendum_id, necessity_score, funding_score, competition_score, 
    blueprint_score, track_record_score, reports_score, synergy_score, 
    revenue_score, security_score, open_source_score
) VALUES
((SELECT id FROM referendums WHERE post_id = 1001 AND chain = 'Polkadot'), 4, 3, 5, 4, 3, 4, 5, 2, 4, 5),
((SELECT id FROM referendums WHERE post_id = 1002 AND chain = 'Polkadot'), 3, 4, 3, 3, 4, 3, 4, 3, 3, 4),
((SELECT id FROM referendums WHERE post_id = 1003 AND chain = 'Polkadot'), 5, 4, 4, 5, 4, 5, 4, 3, 5, 4),
((SELECT id FROM referendums WHERE post_id = 2001 AND chain = 'Kusama'), 5, 4, 4, 5, 4, 5, 4, 3, 5, 4),
((SELECT id FROM referendums WHERE post_id = 2002 AND chain = 'Kusama'), 4, 5, 3, 4, 5, 4, 3, 4, 4, 5),
((SELECT id FROM referendums WHERE post_id = 2003 AND chain = 'Kusama'), 2, 1, 3, 2, 1, 2, 2, 1, 2, 1);

-- ============================================================================
-- SAMPLE VOTING DECISIONS
-- ============================================================================

INSERT OR IGNORE INTO voting_decisions (
    referendum_id, suggested_vote, final_vote, vote_executed, vote_executed_date
) VALUES
((SELECT id FROM referendums WHERE post_id = 2001 AND chain = 'Kusama'), '👍 Aye 👍', '👍 Aye 👍', FALSE, NULL),
((SELECT id FROM referendums WHERE post_id = 2002 AND chain = 'Kusama'), '👍 Aye 👍', '👍 Aye 👍', TRUE, '2023-12-15T10:30:00Z'),
((SELECT id FROM referendums WHERE post_id = 2003 AND chain = 'Kusama'), '👎 Nay 👎', '👎 Nay 👎', TRUE, '2023-11-15T14:20:00Z');

-- ============================================================================
-- SAMPLE TEAM ROLES
-- ============================================================================

INSERT OR IGNORE INTO referendum_team_roles (referendum_id, team_member_id, role_type) VALUES
-- Referendum 1001 (Polkadot) - Not started
((SELECT id FROM referendums WHERE post_id = 1001 AND chain = 'Polkadot'), (SELECT id FROM team_members WHERE name = 'Alice Johnson'), 'responsible_person'),

-- Referendum 1002 (Polkadot) - Considering
((SELECT id FROM referendums WHERE post_id = 1002 AND chain = 'Polkadot'), (SELECT id FROM team_members WHERE name = 'Bob Smith'), 'responsible_person'),
((SELECT id FROM referendums WHERE post_id = 1002 AND chain = 'Polkadot'), (SELECT id FROM team_members WHERE name = 'Alice Johnson'), 'agree'),
((SELECT id FROM referendums WHERE post_id = 1002 AND chain = 'Polkadot'), (SELECT id FROM team_members WHERE name = 'Carol Davis'), 'to_be_discussed'),

-- Referendum 1003 (Polkadot) - Ready for approval
((SELECT id FROM referendums WHERE post_id = 1003 AND chain = 'Polkadot'), (SELECT id FROM team_members WHERE name = 'Carol Davis'), 'responsible_person'),
((SELECT id FROM referendums WHERE post_id = 1003 AND chain = 'Polkadot'), (SELECT id FROM team_members WHERE name = 'Alice Johnson'), 'agree'),
((SELECT id FROM referendums WHERE post_id = 1003 AND chain = 'Polkadot'), (SELECT id FROM team_members WHERE name = 'Bob Smith'), 'agree'),
((SELECT id FROM referendums WHERE post_id = 1003 AND chain = 'Polkadot'), (SELECT id FROM team_members WHERE name = 'David Wilson'), 'agree'),

-- Referendum 2001 (Kusama) - Ready to vote
((SELECT id FROM referendums WHERE post_id = 2001 AND chain = 'Kusama'), (SELECT id FROM team_members WHERE name = 'David Wilson'), 'responsible_person'),
((SELECT id FROM referendums WHERE post_id = 2001 AND chain = 'Kusama'), (SELECT id FROM team_members WHERE name = 'Alice Johnson'), 'agree'),
((SELECT id FROM referendums WHERE post_id = 2001 AND chain = 'Kusama'), (SELECT id FROM team_members WHERE name = 'Bob Smith'), 'agree'),
((SELECT id FROM referendums WHERE post_id = 2001 AND chain = 'Kusama'), (SELECT id FROM team_members WHERE name = 'Carol Davis'), 'agree'),

-- Referendum 2002 (Kusama) - Completed Aye vote
((SELECT id FROM referendums WHERE post_id = 2002 AND chain = 'Kusama'), (SELECT id FROM team_members WHERE name = 'Eve Brown'), 'responsible_person'),
((SELECT id FROM referendums WHERE post_id = 2002 AND chain = 'Kusama'), (SELECT id FROM team_members WHERE name = 'Alice Johnson'), 'agree'),
((SELECT id FROM referendums WHERE post_id = 2002 AND chain = 'Kusama'), (SELECT id FROM team_members WHERE name = 'Bob Smith'), 'agree'),

-- Referendum 2003 (Kusama) - Completed Nay vote
((SELECT id FROM referendums WHERE post_id = 2003 AND chain = 'Kusama'), (SELECT id FROM team_members WHERE name = 'Alice Johnson'), 'responsible_person'),
((SELECT id FROM referendums WHERE post_id = 2003 AND chain = 'Kusama'), (SELECT id FROM team_members WHERE name = 'Bob Smith'), 'no_way'),
((SELECT id FROM referendums WHERE post_id = 2003 AND chain = 'Kusama'), (SELECT id FROM team_members WHERE name = 'Carol Davis'), 'no_way');

-- ============================================================================
-- SAMPLE MIMIR TRANSACTIONS
-- ============================================================================

INSERT OR IGNORE INTO mimir_transactions (
    referendum_id, calldata, timestamp, status, extrinsic_hash
) VALUES
((SELECT id FROM referendums WHERE post_id = 2002 AND chain = 'Kusama'), 
 '0x1234567890abcdef...', 1702645800, 'executed', '0xabcdef1234567890...'),
((SELECT id FROM referendums WHERE post_id = 2003 AND chain = 'Kusama'), 
 '0xfedcba0987654321...', 1700065200, 'executed', '0x0987654321abcdef...');

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify sample data was inserted correctly
SELECT 'Sample data verification' as check_type;

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

-- Show sample referendum with all related data
SELECT 
    'Sample referendum details' as info,
    r.post_id,
    r.chain,
    r.title,
    r.internal_status,
    sc.ref_score,
    vd.suggested_vote,
    vd.final_vote
FROM referendums r
LEFT JOIN scoring_criteria sc ON r.id = sc.referendum_id
LEFT JOIN voting_decisions vd ON r.id = vd.referendum_id
WHERE r.post_id = 2001 AND r.chain = 'Kusama'; 