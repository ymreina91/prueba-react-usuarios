import { screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { API_BASE_URL } from '../../api/client';
import { server } from '../../test/server';
import { renderWithClient } from '../../test/utils';
import { UserList } from './UserList';

function renderUserList() {
  return renderWithClient(<UserList selectedUserId={null} onSelectUser={() => {}} />);
}

describe('UserList', () => {
  it('muestra los usuarios y los filtra por nombre', async () => {
    const { user } = renderUserList();

    expect(await screen.findByRole('button', { name: /Leanne Graham/ })).toBeInTheDocument();

    await user.type(screen.getByLabelText(/Buscar por nombre/), 'jose');

    expect(screen.getByRole('button', { name: /José Martínez/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Leanne Graham/ })).not.toBeInTheDocument();
  });

  it('muestra un error si la API falla y permite reintentar', async () => {
    server.use(
      http.get(`${API_BASE_URL}/users`, () => new HttpResponse(null, { status: 500 }), { once: true }),
    );
    const { user } = renderUserList();

    expect(await screen.findByText('Error al cargar usuarios.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /reintentar/i }));

    expect(await screen.findByRole('button', { name: /Leanne Graham/ })).toBeInTheDocument();
  });
});