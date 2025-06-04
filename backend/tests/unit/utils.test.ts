import { fetchDotToUsdRate, fetchKusToUsdRate } from '../../src/utils/utils';

// Mocking global fetch
global.fetch = jest.fn();

describe('CoinGecko Integration - Price Fetching', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods on the mock
    (fetch as jest.Mock).mockClear();
  });

  describe('fetchDotToUsdRate', () => {
    it('should return the DOT/USD rate successfully', async () => {
      // Arrange
      const mockRate = 123.45;
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ polkadot: { usd: mockRate } }),
      } as Response);

      // Act
      const rate = await fetchDotToUsdRate();
      console.log('rate', rate);
      // Assert
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('https://api.coingecko.com/api/v3/simple/price?ids=polkadot&vs_currencies=usd');
      expect(rate).toBe(mockRate);
    });

    it('should throw an error if the fetch call fails', async () => {
      // Arrange
      const errorMessage = 'Network failure';
      (fetch as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      // Act & Assert
      await expect(fetchDotToUsdRate()).rejects.toThrow(errorMessage);
    });

    it('should throw an error if the API response is not ok', async () => {
      // Arrange
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      } as Response);

      // Act & Assert
      await expect(fetchDotToUsdRate()).rejects.toThrow('Error fetching DOT/USD rate: Not Found');
    });

    it('should return 0 if the expected data structure is missing in the response', async () => {
      // Arrange
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ someothercoin: { usd: 100 } }), // polkadot field missing
      } as Response);
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // Act
      const rate = await fetchDotToUsdRate();

      // Assert
      expect(rate).toBe(0);
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });

    it('should return 0 if the usd field is missing in the response', async () => {
      // Arrange
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ polkadot: { eur: 100 } }), // usd field missing
      } as Response);
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // Act
      const rate = await fetchDotToUsdRate();

      // Assert
      expect(rate).toBe(0);
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });

    // Add tests for failure modes later
  });

  describe('fetchKusToUsdRate', () => {
    it('should return the KSM/USD rate successfully', async () => {
      // Arrange
      const mockRate = 67.89;
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ kusama: { usd: mockRate } }),
      } as Response);

      // Act
      const rate = await fetchKusToUsdRate();

      // Assert
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('https://api.coingecko.com/api/v3/simple/price?ids=kusama&vs_currencies=usd');
      expect(rate).toBe(mockRate);
    });

    // Add tests for failure modes later
  });
}); 