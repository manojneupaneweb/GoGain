import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import ProtectedRoute from './ProtectedRoute';

vi.mock('./api', () => ({
  default: { get: vi.fn() },
}));

vi.mock('react-toastify', () => ({
  toast: { error: vi.fn() },
}));

vi.mock('../Component/Loading', () => ({
  default: () => <div>Loading</div>,
}));

import api from './api';

function renderRoute(role) {
  api.get.mockResolvedValue({
    data: { data: { user: { role } } },
  });

  return render(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <div>Admin page</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ProtectedRoute', () => {
  it('shows the page when the role matches', async () => {
    renderRoute('admin');
    expect(await screen.findByText('Admin page')).toBeInTheDocument();
  });

  it('sends other roles home', async () => {
    renderRoute('user');
    expect(await screen.findByText('Home')).toBeInTheDocument();
  });
});
