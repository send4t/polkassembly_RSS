import { fetchDataFromAPI } from './fetchReferendas';
import { Chain } from '../types/properties';
import { PostType, PolkassemblyReferenda, FetchReferendaReturnType } from '../types/polkassemly';
import axios from 'axios';

// If you're using Jest, you can mock axios like this:
// jest.mock('axios');
// const mockedAxios = axios as jest.Mocked<typeof axios>;

// For other frameworks, you might need a different approach to mock.
// For this example, we'll assume axios.get can be globally mocked
// or you have a setup file that handles this.

describe('Polkassembly Integration - fetchDataFromAPI', () => {
  // Placeholder for a global mock setup if not using Jest's auto-mocking
  let mockAxiosGet: jest.SpyInstance;

  beforeEach(() => {
    // If using Jest and jest.mock('axios') at the top, this manual spy might not be needed.
    // This is a more manual way to mock if jest.mock isn't used or for other frameworks.
    // Ensure this aligns with your chosen mocking strategy.
    // If not using Jest, this will need to be adapted.
    mockAxiosGet = jest.spyOn(axios, 'get');
  });

  afterEach(() => {
    mockAxiosGet.mockRestore(); // Restore the original axios.get after each test
  });

  it('should fetch and parse proposals correctly from Polkassembly API for a given network', async () => {
    // Arrange
    const mockNetwork = Chain.Polkadot;
    const mockLimit = 5;
    const mockPolkassemblyResponse = {
      data: {
        posts: [
          {
            post_id: 100,
            title: 'Test Referendum 1',
            created_at: '2023-01-01T10:00:00Z',
            proposer: 'address1',
            type: PostType.ReferendumV2,
            // Add other mandatory PolkassemblyReferenda fields
            status: 'Submitted',
            track_number: 1,
            is_spam: false,
            is_spam_report_invalid: false,
            spam_users_count: 0,

          },
          {
            post_id: 101,
            title: 'Test Discussion 1',
            created_at: '2023-01-02T11:00:00Z',
            user_id: 123,
            username: 'userX',
            type: PostType.Discussions,
            // Add other mandatory PolkassemblyReferenda fields for discussions
            is_spam: false,
            is_spam_report_invalid: false,
            spam_users_count: 0,
          },
          {
            post_id: 102,
            title: 'Test Referendum 2',
            created_at: '2023-01-03T12:00:00Z',
            proposer: 'address2',
            type: PostType.ReferendumV2,
            status: 'Deciding',
            track_number: 2,
            is_spam: false,
            is_spam_report_invalid: false,
            spam_users_count: 0,
          },
        ],
      },
    };

    // Configure the mock for axios.get
    // If using jest.mock('axios') at the top:
    // mockedAxios.get.mockResolvedValue(mockPolkassemblyResponse);
    // If using jest.spyOn:
    mockAxiosGet.mockResolvedValue(mockPolkassemblyResponse);

    const expectedUrl = `https://api.polkassembly.io/api/v1/latest-activity/all-posts?govType=open_gov&listingLimit=${mockLimit}`;

    // Act
    const result: FetchReferendaReturnType = await fetchDataFromAPI(mockLimit, mockNetwork);

    // Assert
    expect(mockAxiosGet).toHaveBeenCalledTimes(1);
    expect(mockAxiosGet).toHaveBeenCalledWith(expectedUrl, {
      headers: { 'x-network': mockNetwork.toLowerCase() },
    });

    expect(result.referendas).toHaveLength(2);
    expect(result.discussions).toHaveLength(1);

    // Check first referendum
    const referendum1 = result.referendas[0];
    expect(referendum1.post_id).toBe(100);
    expect(referendum1.title).toBe('Test Referendum 1');
    expect(referendum1.network).toBe(mockNetwork);
    expect(referendum1.type).toBe(PostType.ReferendumV2);
    expect(referendum1.proposer).toBe('address1');


    // Check second referendum
    const referendum2 = result.referendas[1];
    expect(referendum2.post_id).toBe(102);
    expect(referendum2.title).toBe('Test Referendum 2');
    expect(referendum2.network).toBe(mockNetwork);
    expect(referendum2.type).toBe(PostType.ReferendumV2);
    expect(referendum2.proposer).toBe('address2');


    // Check discussion
    const discussion1 = result.discussions[0];
    expect(discussion1.post_id).toBe(101);
    expect(discussion1.title).toBe('Test Discussion 1');
    expect(discussion1.network).toBe(mockNetwork);
    expect(discussion1.type).toBe(PostType.Discussions);
    expect(discussion1.username).toBe('userX');
  });

  it('should handle API errors gracefully and return empty arrays', async () => {
    // Arrange
    const mockNetwork = Chain.Kusama;
    const mockLimit = 3;
    const errorMessage = 'Network Error';

    // Configure the mock for axios.get to reject with an error
    mockAxiosGet.mockRejectedValue(new Error(errorMessage));

    // Act
    const result = await fetchDataFromAPI(mockLimit, mockNetwork);

    // Assert
    expect(mockAxiosGet).toHaveBeenCalledTimes(1);
    expect(result.referendas).toEqual([]);
    expect(result.discussions).toEqual([]);
    // Optionally, you could check if console.error was called if your actual function logs the error.
    // This requires spying on console.error: jest.spyOn(console, 'error').mockImplementation(() => {});
    // And then: expect(console.error).toHaveBeenCalledWith(expect.stringContaining("Error fetching data"), expect.any(String));
  });

  it('should handle an empty list of posts from the API and return empty arrays', async () => {
    // Arrange
    const mockNetwork = Chain.Polkadot;
    const mockLimit = 5;
    const mockEmptyResponse = {
      data: {
        posts: [], // Empty posts array
      },
    };

    mockAxiosGet.mockResolvedValue(mockEmptyResponse);

    // Act
    const result = await fetchDataFromAPI(mockLimit, mockNetwork);

    // Assert
    expect(mockAxiosGet).toHaveBeenCalledTimes(1);
    expect(result.referendas).toEqual([]);
    expect(result.discussions).toEqual([]);
  });

  it('should handle a null list of posts from the API and return empty arrays', async () => {
    // Arrange
    const mockNetwork = Chain.Polkadot;
    const mockLimit = 5;
    const mockNullPostsResponse = {
      data: {
        posts: null, // Null posts
      },
    };

    mockAxiosGet.mockResolvedValue(mockNullPostsResponse);

    // Act
    const result = await fetchDataFromAPI(mockLimit, mockNetwork);

    // Assert
    // The function should still be called once
    expect(mockAxiosGet).toHaveBeenCalledTimes(1);
    // And it should gracefully handle the null by returning empty arrays
    expect(result.referendas).toEqual([]);
    expect(result.discussions).toEqual([]);
  });

  it('should handle a response where the posts field is undefined and return empty arrays', async () => {
    // Arrange
    const mockNetwork = Chain.Polkadot;
    const mockLimit = 5;
    const mockUndefinedPostsResponse = {
      data: {}, // posts field is missing
    };

    mockAxiosGet.mockResolvedValue(mockUndefinedPostsResponse);

    // Act
    const result = await fetchDataFromAPI(mockLimit, mockNetwork);

    // Assert
    expect(mockAxiosGet).toHaveBeenCalledTimes(1);
    expect(result.referendas).toEqual([]);
    expect(result.discussions).toEqual([]);
  });

  // We can add more tests here for other scenarios from the plan later:
  // - Test updates to existing proposals (e.g. edited title/status). (This function primarily fetches, updates are by Notion sync)
  // - Test failure modes (e.g. invalid JSON, 404, empty response).
}); 