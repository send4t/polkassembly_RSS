// import { createReferenda } from '../../src/notion/create'; // Moved to beforeEach
import { Chain, InternalStatus, Origin, TimelineStatus } from '../../src/types/properties';
import { NotionDatabaseId, CreateReferendumInput } from '../../src/types/notion';
import { PolkassemblyReferenda, PostType } from '../../src/types/polkassemly';
import type { AxiosStatic } from 'axios'; // Import AxiosStatic for typing the mock

// Mock axios globally
jest.mock('axios');

// Mock modules whose specific functions will be used/asserted
jest.mock('../../src/polkAssembly/fetchReferendas');
jest.mock('../../src/notion/updateContent');

describe('Notion Integration - createReferenda', () => {
  const ORIGINAL_ENV = { ...process.env };
  let createReferendaFunction: typeof import('../../src/notion/create').createReferenda;
  let mockFetchReferendumContent: jest.Mock;
  let mockUpdateContent: jest.Mock;
  let mockedAxios: jest.Mocked<AxiosStatic>; 

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    process.env.NOTION_API_TOKEN = 'test-notion-token';
    process.env.NOTION_VERSION = '2022-06-28';

    jest.resetModules();

    const fetchReferendasModuleActual = require('../../src/polkAssembly/fetchReferendas');
    const updateContentModuleActual = require('../../src/notion/updateContent');
    mockedAxios = require('axios'); 

    mockFetchReferendumContent = fetchReferendasModuleActual.fetchReferendumContent;
    mockUpdateContent = updateContentModuleActual.updateContent;
    
    createReferendaFunction = require('../../src/notion/create').createReferenda;

    mockFetchReferendumContent.mockClear();
    mockUpdateContent.mockClear();
    mockedAxios.post.mockClear(); 
  });

  afterEach(() => { 
    process.env = { ...ORIGINAL_ENV };
  });
  
  it('should create a new Notion page and add content successfully', async () => {
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
      proposer: 'mockProposerForFetchedContent',
      requested: '1000000000000', 
      assetId: undefined, 
    };
    mockFetchReferendumContent.mockResolvedValue(mockFetchedContent);

    const mockNotionPageCreateResponse = {
      data: {
        id: 'new-notion-page-id',
      },
    };
    mockedAxios.post.mockResolvedValue(mockNotionPageCreateResponse);
    mockUpdateContent.mockResolvedValue(undefined);

    const newPageId = await createReferendaFunction(databaseId, mockReferendum, exchangeRate, network);

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

}); 