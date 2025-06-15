import { promises as fs } from 'fs';
import path from 'path';
import { ReadyProposal } from '../../src/types/mimir';
import { saveReadyProposalsToFile, loadReadyProposalsFromFile } from '../../src/utils/readyFileHandlers';
import { SuggestedVote } from '../../src/types/properties';

describe('ReadyFileHandlers Integration Tests', () => {
  const TEST_DIR = path.join(__dirname, 'test-files');
  const TEST_FILE = path.join(TEST_DIR, 'ready-proposals.json');
  
  const mockReadyProposals: ReadyProposal[] = [
    {
      id: 123,
      voted: SuggestedVote.Aye,
      timestamp: Date.now()
    }
  ];

  beforeAll(async () => {
    // Create test directory if it doesn't exist
    await fs.mkdir(TEST_DIR, { recursive: true });
  });

  afterAll(async () => {
    try {
      await fs.rm(TEST_DIR, { recursive: true, force: true });
    } catch (error) {
      console.error('Error cleaning up test directory:', error);
    }
  });

  beforeEach(async () => {
    // Clean up test file before each test
    try {
      await fs.unlink(TEST_FILE);
    } catch (error) {
      // Ignore error if file doesn't exist
    }
  });

  describe('saveReadyProposalsToFile', () => {
    it('should save proposals to a new file', async () => {
      await saveReadyProposalsToFile(mockReadyProposals, TEST_FILE);
      
      const fileContent = await fs.readFile(TEST_FILE, 'utf8');
      const savedProposals = JSON.parse(fileContent);
      
      expect(savedProposals).toEqual(mockReadyProposals);
    });

    it('should create directory if it does not exist', async () => {
      const nestedDir = path.join(TEST_DIR, 'nested', 'deep');
      const nestedFile = path.join(nestedDir, 'proposals.json');
      
      await saveReadyProposalsToFile(mockReadyProposals, nestedFile);
      
      const dirExists = await fs.access(nestedDir)
        .then(() => true)
        .catch(() => false);
      
      expect(dirExists).toBe(true);
      
      const fileContent = await fs.readFile(nestedFile, 'utf8');
      const savedProposals = JSON.parse(fileContent);
      
      expect(savedProposals).toEqual(mockReadyProposals);
    });

    it('should handle empty array of proposals', async () => {
      await saveReadyProposalsToFile([], TEST_FILE);
      
      const fileContent = await fs.readFile(TEST_FILE, 'utf8');
      const savedProposals = JSON.parse(fileContent);
      
      expect(savedProposals).toEqual([]);
    });

    it('should handle errors appropriately', async () => {
      // Create a directory with no write permissions
      const noWriteDir = path.join(TEST_DIR, 'no-write');
      await fs.mkdir(noWriteDir, { recursive: true });
      await fs.chmod(noWriteDir, 0o444); // Read-only permissions
      
      const noWriteFile = path.join(noWriteDir, 'proposals.json');
      
      await expect(saveReadyProposalsToFile(mockReadyProposals, noWriteFile))
        .rejects
        .toThrow();
      
      // Clean up
      await fs.chmod(noWriteDir, 0o777);
    });
  });

  describe('loadReadyProposalsFromFile', () => {
    it('should load proposals from an existing file', async () => {
      // First save some data
      await saveReadyProposalsToFile(mockReadyProposals, TEST_FILE);
      
      // Then load it
      const loadedProposals = await loadReadyProposalsFromFile(TEST_FILE);
      
      expect(loadedProposals).toEqual(mockReadyProposals);
    });

    it('should create empty file and return empty array if file does not exist', async () => {
      const nonExistentFile = path.join(TEST_DIR, 'non-existent.json');
      
      const loadedProposals = await loadReadyProposalsFromFile(nonExistentFile);
      
      expect(loadedProposals).toEqual([]);
      
      // Verify file was created
      const fileExists = await fs.access(nonExistentFile)
        .then(() => true)
        .catch(() => false);
      
      expect(fileExists).toBe(true);
      
      // Verify file contains empty array
      const fileContent = await fs.readFile(nonExistentFile, 'utf8');
      expect(fileContent).toBe('[]');
    });

    it('should handle invalid JSON data', async () => {
      // Write invalid JSON to file
      await fs.writeFile(TEST_FILE, 'invalid json');
      
      await expect(loadReadyProposalsFromFile(TEST_FILE))
        .rejects
        .toThrow();
    });

    it('should handle empty file', async () => {
      // Create empty file
      await fs.writeFile(TEST_FILE, '');
      
      await expect(loadReadyProposalsFromFile(TEST_FILE))
        .rejects
        .toThrow();
    });
  });

  describe('Integration Scenarios', () => {
    it('should maintain data integrity through save and load cycle', async () => {
      // Save initial data
      await saveReadyProposalsToFile(mockReadyProposals, TEST_FILE);
      
      // Load and verify
      const loadedProposals = await loadReadyProposalsFromFile(TEST_FILE);
      expect(loadedProposals).toEqual(mockReadyProposals);
      
      // Modify and save again
      const modifiedProposals = [
        ...mockReadyProposals,
        {
          id: 456,
          voted: SuggestedVote.Nay,
          timestamp: Date.now()
        }
      ];
      
      await saveReadyProposalsToFile(modifiedProposals, TEST_FILE);
      
      // Load and verify again
      const reloadedProposals = await loadReadyProposalsFromFile(TEST_FILE);
      expect(reloadedProposals).toEqual(modifiedProposals);
    });

    it('should handle special characters in file paths', async () => {
      const specialPath = path.join(TEST_DIR, 'special chars!@#$%^&*()_+', 'proposals.json');
      
      await saveReadyProposalsToFile(mockReadyProposals, specialPath);
      const loadedProposals = await loadReadyProposalsFromFile(specialPath);
      
      expect(loadedProposals).toEqual(mockReadyProposals);
    });
  });
}); 