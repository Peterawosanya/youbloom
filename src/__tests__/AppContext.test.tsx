import { renderHook, act } from '@testing-library/react';
import { AppProvider, useAppContext } from '../context/AppContext';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as any;

describe('AppContext', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  it('provides initial state correctly', () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: AppProvider,
    });

    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.phone).toBe(null);
    expect(result.current.users).toEqual([]);
    expect(result.current.posts).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('handles login correctly', () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: AppProvider,
    });

    act(() => {
      result.current.login('+254712345678');
    });

    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.phone).toBe('+254712345678');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('userPhone', '+254712345678');
  });

  it('handles logout correctly', () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: AppProvider,
    });

    // First login
    act(() => {
      result.current.login('+254712345678');
    });

    // Then logout
    act(() => {
      result.current.logout();
    });

    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.phone).toBe(null);
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('userPhone');
  });

  it('restores login state from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('+254712345678');

    const { result } = renderHook(() => useAppContext(), {
      wrapper: AppProvider,
    });

    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.phone).toBe('+254712345678');
  });

  it('handles users data correctly', () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: AppProvider,
    });

    const mockUsers = [
      { id: 1, name: 'Test User', email: 'test@example.com' }
    ] as any;

    act(() => {
      result.current.setUsers(mockUsers);
    });

    expect(result.current.users).toEqual(mockUsers);
  });

  it('handles loading state correctly', () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: AppProvider,
    });

    act(() => {
      result.current.setLoading(true);
    });

    expect(result.current.loading).toBe(true);

    act(() => {
      result.current.setLoading(false);
    });

    expect(result.current.loading).toBe(false);
  });

  it('handles error state correctly', () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: AppProvider,
    });

    const errorMessage = 'Test error';

    act(() => {
      result.current.setError(errorMessage);
    });

    expect(result.current.error).toBe(errorMessage);

    act(() => {
      result.current.setError(null);
    });

    expect(result.current.error).toBe(null);
  });
});