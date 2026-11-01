import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import Cart from './Cart';

vi.mock('../../utils/api', () => ({
  default: {
    get: vi.fn().mockResolvedValue({
      data: {
        data: {
          items: [
            {
              id: 'c1',
              name: 'Whey Protein',
              price: 2500,
              quantity: 2,
              image: '',
            },
          ],
          subtotal: 5000,
          shipping: 0,
          total: 5000,
        },
      },
    }),
  },
}));

vi.mock('../../utils/payment', () => ({
  initiateEsewaPayment: vi.fn(),
  initiateKhaltiPayment: vi.fn(),
}));

vi.mock('react-toastify', () => ({
  toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() },
  ToastContainer: () => null,
}));

vi.mock('../../utils/CartContext', () => ({
  useCart: () => ({
    cartItems: [
      { id: 'c1', name: 'Whey Protein', price: 2500, quantity: 2, image: '' },
    ],
    setCartItems: vi.fn(),
    setCartCount: vi.fn(),
  }),
}));

describe('Cart', () => {
  it('shows the catalog line from the server', async () => {
    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>,
    );

    expect(await screen.findByText('Whey Protein')).toBeInTheDocument();
  });
});
