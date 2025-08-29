import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '../context/AppContext';
import { LoginPage } from '../pages/LoginPage';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const LoginPageWithProviders = () => (
  <BrowserRouter>
    <AppProvider>
      <LoginPage />
    </AppProvider>
  </BrowserRouter>
);

describe('LoginPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    localStorage.clear();
  });

  it('renders login form correctly', () => {
    render(<LoginPageWithProviders />);
    
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows error for empty phone number', async () => {
    render(<LoginPageWithProviders />);
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Phone number is required')).toBeInTheDocument();
    });
  });

  it('shows error for invalid phone format', async () => {
    render(<LoginPageWithProviders />);
    
    const phoneInput = screen.getByLabelText(/phone number/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid phone number/i)).toBeInTheDocument();
    });
  });

  it('accepts valid phone number format', async () => {
    render(<LoginPageWithProviders />);
    
    const phoneInput = screen.getByLabelText(/phone number/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(phoneInput, { target: { value: '+254712345678' } });
    fireEvent.click(submitButton);

    // Should show loading state
    await waitFor(() => {
      expect(screen.getByText(/signing in/i)).toBeInTheDocument();
    });

    // Should navigate after successful login
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/main');
    }, { timeout: 2000 });
  });

  it('validates +254 format correctly', () => {
    render(<LoginPageWithProviders />);
    
    const phoneInput = screen.getByLabelText(/phone number/i);
    
    // Test various formats
    const validNumbers = ['+254712345678', '+254723456789'];
    const invalidNumbers = ['+255712345678', '254712345678', '+25471234567'];

    validNumbers.forEach(number => {
      fireEvent.change(phoneInput, { target: { value: number } });
      expect(phoneInput).toHaveValue(number);
    });
  });
});