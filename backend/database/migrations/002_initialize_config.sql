-- Configuration Initialization Script
-- This script populates the app_config table with default values
-- Run this after creating the database schema

-- Insert default configuration values
-- These can be overridden by environment variables in the application
INSERT OR REPLACE INTO app_config (key, value, description) VALUES
('refresh_interval', '900', 'How often to check for new referendums (in seconds)'),
('deep_sync_limit', '100', 'Number of posts to fetch during deep sync'),
('deep_sync_hour', '3', 'Hour for daily deep sync (UTC)'),
('ready_check_interval', '60', 'How often to check for ready votes (in seconds)'),
('start_minute', '0', 'Minute of the hour to start operations'),
('polkadot_multisig', '', 'Polkadot multisig address'),
('kusama_multisig', '', 'Kusama multisig address'),
('subscan_api_key', '', 'Subscan API key');

-- Verify configuration was inserted
SELECT 'Configuration initialized successfully' as status;
SELECT COUNT(*) as config_count FROM app_config; 