import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Login from './Login';

vi.mock('../utils/api', () => ({
  default: {
    post: vi.fn(),
  },
}));

vi.mock('react-toastify', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

import api from '../utils/api';

describe('Login', () => {
  it('submits email and password', async () => {
    const onSuccess = vi.fn();
    api.post.mockResolvedValue({ data: { success: true } });
    const user = userEvent.setup();

    render(
      <Login
        onClose={() => {}}
        onSuccess={onSuccess}
        onSwitchToSignup={() => {}}
      />,
    );

    await user.type(
      screen.getByPlaceholderText(/email/i),
      'member@gogain.test',
    );
    await user.type(screen.getByPlaceholderText(/password/i), 'password');
    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(api.post).toHaveBeenCalledWith('/api/v1/user/login', {
      email: 'member@gogain.test',
      password: 'password',
    });
    expect(onSuccess).toHaveBeenCalled();
  });
});
