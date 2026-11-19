import { describe, expect, it } from 'vitest';
import { users } from '../../test/handlers';
import { filterUsersByName } from './filterUsers';

describe('filterUsersByName', () => {
  it('devuelve todos los usuarios si la búsqueda está vacía', () => {
    expect(filterUsersByName(users, '   ')).toHaveLength(3);
  });

  it('busca sin distinguir mayúsculas ni tildes', () => {
    expect(filterUsersByName(users, 'MARTINEZ').map((u) => u.id)).toEqual([3]);
  });
});