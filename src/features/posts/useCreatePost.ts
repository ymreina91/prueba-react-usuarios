import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost } from '../../api/posts';
import type { NewPost, Post } from '../../api/types';
import { postsKey } from './usePosts';

export function withUniqueId(created: Post, existing: Post[]): Post {
    const maxId = existing.reduce((max, post) => Math.max(max, post.id), 0);
    return  created.id > maxId ? created : { ...created, id: maxId + 1 };
}

export function useCreatePost(userId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newPost: Omit<NewPost, 'userId'>) => createPost({...newPost, userId}),
    onSuccess: (created) => {
        // La API no guarda nada: si invalidáramos la consulta, volvería la lista
        // sin la publicación nueva. Por eso la agregamos directamente a la caché.
        queryClient.setQueryData<Post[]>(postsKey(userId), (current = []) => [ 
            withUniqueId(created, current),
            ...current,
        ]);
    }
  });
}