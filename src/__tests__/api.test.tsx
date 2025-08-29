import { api, ApiError } from '../services/api';

// Mock fetch
global.fetch = jest.fn();

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.clearCache();
  });

  it('should fetch users successfully', async () => {
    const mockUsers = [
      { id: 1, name: 'John Doe', email: 'john@example.com' }
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    });

    const users = await api.getUsers();
    expect(users).toEqual(mockUsers);
    expect(fetch).toHaveBeenCalledWith(
      'https://jsonplaceholder.typicode.com/users',
      expect.objectContaining({
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })
    );
  });

  it('should retry on failure and eventually succeed', async () => {
    const mockUsers = [{ id: 1, name: 'John Doe' }];

    // First two calls fail, third succeeds
    (fetch as jest.Mock)
      .mockRejectedValueOnce(new Error('Network error'))
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockUsers,
      });

    const users = await api.getUsers();
    expect(users).toEqual(mockUsers);
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it('should throw ApiError after max retries', async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    await expect(api.getUsers()).rejects.toThrow(ApiError);
    expect(fetch).toHaveBeenCalledTimes(4); // Initial + 3 retries
  });

  it('should use cached data when available', async () => {
    const mockUsers = [{ id: 1, name: 'John Doe' }];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    });

    // First call
    const users1 = await api.getUsers();
    expect(users1).toEqual(mockUsers);
    expect(fetch).toHaveBeenCalledTimes(1);

    // Second call should use cache
    const users2 = await api.getUsers();
    expect(users2).toEqual(mockUsers);
    expect(fetch).toHaveBeenCalledTimes(1); // No additional fetch
  });

  it('should handle timeout errors', async () => {
    (fetch as jest.Mock).mockImplementation(() => 
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('AbortError')), 100)
      )
    );

    await expect(api.getUsers()).rejects.toThrow('Request timeout');
  });
});