import { request } from './client';
import { User } from './types';

esport function getUsers(): Promise<User[]> {
  return request<User[]>('/users');
}