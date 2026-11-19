import { http, HttpResponse } from 'msw';
import { API_BASE_URL } from '../api/client';
import type { NewPost, Post, User } from '../api/types';

export const users: User[] = [
  { id: 1, name: 'Leanne Graham', username: 'Bret', email: 'leanne@example.com' },
  { id: 2, name: 'Ervin Howell', username: 'Antonette', email: 'ervin@example.com' },
  { id: 3, name: 'José Martínez', username: 'jose', email: 'jose@example.com' },
];

export const postsByUser: Record<number, Post[]> = {
  1: [
    { id: 1, userId: 1, title: 'Primera publicación', body: 'Texto uno' },
    { id: 2, userId: 1, title: 'Segunda publicación', body: 'Texto dos' },
  ],
};

export const handlers = [
  http.get(`${API_BASE_URL}/users`, () => HttpResponse.json(users)),

  http.get(`${API_BASE_URL}/users/:id/posts`, ({ params }) =>
    HttpResponse.json(postsByUser[Number(params.id)] ?? []),
  ),

  http.post(`${API_BASE_URL}/posts`, async ({ request }) => {
    const body = (await request.json()) as NewPost;
    return HttpResponse.json({ ...body, id: 101 }, { status: 201 });
  }),
];