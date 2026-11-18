import type { User } from '../../api/types';

// Quita tildes y pasa a minúsculas: "jose" encuentra a "José".
function normalizeString(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

export function filterUsersByName(users: User[], searchTerm: string): User[] {
  const normalizedSearchTerm = normalizeString(searchTerm);

  if (!normalizedSearchTerm) {
    return users;
  }

  return users.filter(user => {
    return normalizeString(user.name).includes(normalizedSearchTerm);
  });
}

