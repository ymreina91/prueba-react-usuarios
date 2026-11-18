import { useQuery } from '@tanstack/react-query';
import { getPostsByUser } from '../../api/posts';

export const postsKey = (userId: number) => ['posts', userId] as const; // Clave única para la consulta de publicaciones del usuario

export function useUserPosts(userId: number) {
  return useQuery({
    queryKey: postsKey(userId), // Clave única para la consulta de publicaciones del usuario
    queryFn: () => getPostsByUser(userId), // Función que obtiene las publicaciones del usuario
    enabled: !!userId, // Solo se ejecuta si userId es un valor válido (no null o undefined)
  });
}