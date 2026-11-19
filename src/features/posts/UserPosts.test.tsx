import { screen, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { API_BASE_URL } from '../../api/client';
import App from '../../App';
import { server } from '../../test/server';
import { renderWithClient } from '../../test/utils';

// Parte de la App completa y elige a Leanne, como lo haría el usuario.
async function openLeannePosts() {
  const utils = renderWithClient(<App />);
  await utils.user.click(await screen.findByRole('button', { name: /Leanne Graham/ }));
  const list = await screen.findByRole('list', { name: /Publicaciones de Leanne Graham/ });
  return { ...utils, list };
}

describe('Publicaciones de un usuario', () => {
  it('muestra las publicaciones del usuario elegido', async () => {
    const { list } = await openLeannePosts();

    expect(within(list).getAllByRole('listitem')).toHaveLength(2);
    expect(within(list).getByText('Primera publicación')).toBeInTheDocument();
  });

  it('no envía el formulario si faltan el título o el texto', async () => {
    let requestSent = false;
    server.use(
      http.post(`${API_BASE_URL}/posts`, () => {
        requestSent = true;
        return HttpResponse.json({});
      }),
    );
    const { user } = await openLeannePosts();

    await user.click(screen.getByRole('button', { name: /nuevo post/i }));
    await user.click(screen.getByRole('button', { name: 'Publicar' }));

    expect(await screen.findByText('El título es obligatorio')).toBeInTheDocument();
    expect(screen.getByText('El texto es obligatorio')).toBeInTheDocument();
    expect(requestSent).toBe(false);
  });

  it('crea una publicación y la muestra primera en la lista', async () => {
    const { user, list } = await openLeannePosts();

    await user.click(screen.getByRole('button', { name: /nuevo post/i }));
    await user.type(screen.getByLabelText(/Título/), 'Mi publicación');
    await user.type(screen.getByLabelText(/Texto/), 'Contenido de prueba');
    await user.click(screen.getByRole('button', { name: 'Publicar' }));

    expect(await within(list).findByText('Mi publicación')).toBeInTheDocument();
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent('Mi publicación');
  });
});