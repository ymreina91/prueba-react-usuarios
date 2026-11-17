import {request} from './client';
import {NewPost, Post} from './types';

export function getPostsByUser(userId: number): Promise<Post[]> {
  return request<Post[]>(`/users/${userId}/posts`);
}

export function createPost(newPost: NewPost): Promise<Post> {
  return request<Post>('/posts', {
    method: 'POST',
    body: JSON.stringify(post),
  });
}