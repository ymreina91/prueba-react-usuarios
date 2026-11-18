import {  useQuery } from '@tanstack/react-query';
import { getUsers } from '../../api/users';
import type { User } from '../../api/types';

export function useUsers() {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: getUsers,
    staleTime: 1000 * 60 * 5, // 5 minutos sin volver a pedir la lista
  });
}