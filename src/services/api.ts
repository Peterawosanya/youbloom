import { User, Post } from '../types';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

// Simple in-memory cache
class ApiCache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  set(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  get(key: string) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > this.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  clear() {
    this.cache.clear();
  }
}

const cache = new ApiCache();

// Retry logic with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        break;
      }

      // Exponential backoff: 1s, 2s, 4s
      const delay = baseDelay * Math.pow(2, attempt);
      console.warn(`API call failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delay}ms...`, error);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new ApiError(`HTTP error! status: ${response.status}`, response.status);
  }
  return response.json();
}

// Enhanced fetch with timeout and better error handling
async function fetchWithTimeout(url: string, timeout: number = 10000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Request timeout - please check your internet connection');
    }
    throw error;
  }
}

export const api = {
  async getUsers(): Promise<User[]> {
    const cacheKey = 'users';
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log('Returning cached users data');
      return cached;
    }

    try {
      const users = await retryWithBackoff(async () => {
        const response = await fetchWithTimeout(`${BASE_URL}/users`);
        return handleResponse<User[]>(response);
      });
      
      cache.set(cacheKey, users);
      return users;
    } catch (error) {
      throw new ApiError(
        error instanceof Error ? error.message : 'Failed to fetch users. Please check your internet connection and try again.'
      );
    }
  },

  async getPosts(): Promise<Post[]> {
    const cacheKey = 'posts';
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log('Returning cached posts data');
      return cached;
    }

    try {
      const posts = await retryWithBackoff(async () => {
        const response = await fetchWithTimeout(`${BASE_URL}/posts`);
        return handleResponse<Post[]>(response);
      });
      
      cache.set(cacheKey, posts);
      return posts;
    } catch (error) {
      throw new ApiError(
        error instanceof Error ? error.message : 'Failed to fetch posts. Please check your internet connection and try again.'
      );
    }
  },

  async getUser(id: number): Promise<User> {
    const cacheKey = `user-${id}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log(`Returning cached user ${id} data`);
      return cached;
    }

    try {
      const user = await retryWithBackoff(async () => {
        const response = await fetchWithTimeout(`${BASE_URL}/users/${id}`);
        return handleResponse<User>(response);
      });
      
      cache.set(cacheKey, user);
      return user;
    } catch (error) {
      throw new ApiError(
        error instanceof Error ? error.message : `Failed to fetch user ${id}. Please try again.`
      );
    }
  },

  async getPost(id: number): Promise<Post> {
    const cacheKey = `post-${id}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log(`Returning cached post ${id} data`);
      return cached;
    }

    try {
      const post = await retryWithBackoff(async () => {
        const response = await fetchWithTimeout(`${BASE_URL}/posts/${id}`);
        return handleResponse<Post>(response);
      });
      
      cache.set(cacheKey, post);
      return post;
    } catch (error) {
      throw new ApiError(
        error instanceof Error ? error.message : `Failed to fetch post ${id}. Please try again.`
      );
    }
  },

  // Clear cache manually if needed
  clearCache() {
    cache.clear();
  },
};