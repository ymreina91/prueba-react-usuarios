export const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`La API respondió con el código: ${response.status}`);
  }
  return response.json() as Promise<T>;
}