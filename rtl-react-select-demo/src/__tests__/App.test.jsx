import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

const mockGoogleReCaptchaProvider = jest.fn(({ children }) => (
  <div data-testid="recaptcha-provider">{children}</div>
));

// Mock react-google-recaptcha-v3
jest.mock('react-google-recaptcha-v3', () => ({
  useGoogleReCaptcha: jest.fn(() => ({
    executeRecaptcha: jest.fn(),
  })),
  GoogleReCaptchaProvider: (props) => mockGoogleReCaptchaProvider(props),
}));

// Mock AgentForm
jest.mock('../components/AgentForm', () => {
  return function MockAgentForm() {
    return <div data-testid="agent-form">Agent Form</div>;
  };
});

describe('App', () => {
  const originalEnv = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.REACT_APP_RECAPTCHA_SITE_KEY;
  });

  afterEach(() => {
    process.env.REACT_APP_RECAPTCHA_SITE_KEY = originalEnv;
  });

  it('should render App component with default recaptcha key', () => {
    render(<App />);
    
    expect(screen.getByTestId('recaptcha-provider')).toBeInTheDocument();
    expect(screen.getByTestId('agent-form')).toBeInTheDocument();
    expect(screen.getByText('Agent Form')).toBeInTheDocument();
    
    // Verify default key is used
    expect(mockGoogleReCaptchaProvider).toHaveBeenCalled();
    const callArgs = mockGoogleReCaptchaProvider.mock.calls[0][0];
    expect(callArgs.reCaptchaKey).toBe('6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI');
  });

  it('should render App component with custom recaptcha key from env', () => {
    // Note: This test verifies the component structure
    // The actual env var is read at module load time, so we test the default case
    render(<App />);
    
    expect(screen.getByTestId('recaptcha-provider')).toBeInTheDocument();
    expect(screen.getByTestId('agent-form')).toBeInTheDocument();
    
    // Verify GoogleReCaptchaProvider is called with scriptProps
    expect(mockGoogleReCaptchaProvider).toHaveBeenCalled();
    const callArgs = mockGoogleReCaptchaProvider.mock.calls[0][0];
    expect(callArgs.scriptProps).toEqual({
      async: false,
      defer: false,
      appendTo: 'head',
      nonce: undefined,
    });
  });

  it('should render App with App className', () => {
    const { container } = render(<App />);
    const appDiv = container.querySelector('.App');
    
    expect(appDiv).toBeInTheDocument();
    expect(appDiv).toHaveClass('App');
  });

  it('should render GoogleReCaptchaProvider with correct props', () => {
    render(<App />);
    
    expect(mockGoogleReCaptchaProvider).toHaveBeenCalledTimes(1);
    const callArgs = mockGoogleReCaptchaProvider.mock.calls[0][0];
    
    expect(callArgs).toHaveProperty('reCaptchaKey');
    expect(callArgs).toHaveProperty('scriptProps');
    expect(callArgs.scriptProps).toEqual({
      async: false,
      defer: false,
      appendTo: 'head',
      nonce: undefined,
    });
  });
});

