// import { createReferenda } from './create'; // Moved to beforeEach
import { Chain, InternalStatus, Origin, TimelineStatus } from '../types/properties';
import { NotionDatabaseId, CreateReferendumInput } from '../types/notion';
import { PolkassemblyReferenda, PostType } from '../types/polkassemly';
import type { AxiosStatic } from 'axios'; // Import AxiosStatic for typing the mock
// import axios from 'axios'; // Axios is mocked globally and re-required if needed
// import * as fetchReferendasModule from '../polkAssembly/fetchReferendas'; // Re-required in beforeEach
// import * as updateContentModule from './updateContent'; // Re-required in beforeEach

// Mock axios globally
jest.mock('axios');

// Mock modules whose specific functions will be used/asserted
jest.mock('../polkAssembly/fetchReferendas');
jest.mock('./updateContent');

// const mockedFetchReferendumContent = fetchReferendasModule.fetchReferendumContent as jest.Mock;
// const mockedUpdateContent = updateContentModule.updateContent as jest.Mock;

describe('Notion Integration - createReferenda', () => {
  const ORIGINAL_ENV = { ...process.env };
  let createReferendaFunction: typeof import('./create').createReferenda;
  let mockFetchReferendumContent: jest.Mock;
  let mockUpdateContent: jest.Mock;
  let mockedAxios: jest.Mocked<AxiosStatic>; // Typed as a mocked AxiosStatic

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    process.env.NOTION_API_TOKEN = 'test-notion-token';
    process.env.NOTION_VERSION = '2022-06-28';

    jest.resetModules();

    // Import modules AFTER resetting and setting env
    const fetchReferendasModuleActual = require('../polkAssembly/fetchReferendas');
    const updateContentModuleActual = require('./updateContent');
    mockedAxios = require('axios'); // require('axios') returns the mocked module/instance

    // Get the mocked functions/instances
    mockFetchReferendumContent = fetchReferendasModuleActual.fetchReferendumContent;
    mockUpdateContent = updateContentModuleActual.updateContent;
    
    // Now require the module under test
    createReferendaFunction = require('./create').createReferenda;

    // Clear mocks
    mockFetchReferendumContent.mockClear();
    mockUpdateContent.mockClear();
    mockedAxios.post.mockClear(); // Clear post mock on the correctly typed axios mock
  });

  afterEach(() => { 
    process.env = { ...ORIGINAL_ENV };
  });
  
  it('should create a new Notion page and add content successfully', async () => {
    // Arrange
    const databaseId: NotionDatabaseId = 'test-db-id';
    const mockReferendum: PolkassemblyReferenda = {
      post_id: 123,
      title: 'Test Referendum for Notion',
      created_at: '2023-01-01T00:00:00Z',
      proposer: 'proposerAddress',
      status: 'Submitted',
      origin: Origin.SmallTipper, 
      track_number: 10,
      type: PostType.ReferendumV2,
      network: Chain.Polkadot,
      is_spam: false,
      is_spam_report_invalid: false,
      spam_users_count: 0,
    };
    const exchangeRate = 10.5;
    const network = Chain.Polkadot;

    const mockFetchedContent = {
      content: '<p>This is the fetched HTML content.</p>',
      title: 'Original Title',
      beneficiaries: [], 
      proposer: 'mockProposerForFetchedContent', // Ensuring proposer is present for calculateReward
      requested: '1000000000000', 
      assetId: undefined, // Or a specific test assetId if a path in calculateReward depends on it
    };
    mockFetchReferendumContent.mockResolvedValue(mockFetchedContent);

    const mockNotionPageCreateResponse = {
      data: {
        id: 'new-notion-page-id',
      },
    };
    mockedAxios.post.mockResolvedValue(mockNotionPageCreateResponse);
    mockUpdateContent.mockResolvedValue(undefined);

    // Act
    const newPageId = await createReferendaFunction(databaseId, mockReferendum, exchangeRate, network);

    // Assert
    expect(mockFetchReferendumContent).toHaveBeenCalledWith(mockReferendum.post_id, mockReferendum.network);
    
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://api.notion.com/v1/pages',
      expect.objectContaining({
        parent: { database_id: databaseId, type: 'database_id' },
        properties: expect.objectContaining({
          'Title': expect.anything(),
          'Number': { type: 'title', title: [{ text: { content: '123' } }] },
          'Chain': { type: 'select', select: { name: network } },
          'Requested $': expect.anything(), 
          'Internal status': { type: 'status', status: { name: InternalStatus.NotStarted } }
        }),
      }),
      expect.objectContaining({
        headers: {
          'Authorization': `Bearer test-notion-token`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28',
        },
      })
    );

    expect(mockUpdateContent).toHaveBeenCalledWith('new-notion-page-id', mockFetchedContent.content);
    expect(newPageId).toBe('new-notion-page-id');
  });

  // Add tests for failure modes (e.g., Notion API errors, fetchReferendumContent failure, updateContent failure)
}); 