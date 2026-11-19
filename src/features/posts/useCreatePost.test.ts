import { describe, expect, it } from 'vitest';
import type { Post } from '../../api/types';
import { withUniqueId } from './useCreatePost';

const post = (id: number): Post => ({ id, userId: 1, title: 't', body: 'b' });

describe('withUniqueId', () => {
  it('mantiene el id de la API si no está en uso', () => {
    expect(withUniqueId(post(101), [post(1)]).id).toBe(101);
  });

  it('asigna un id nuevo si la API repite uno existente', () => {
    expect(withUniqueId(post(101), [post(101), post(1)]).id).toBe(102);
  });
});