const baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

type RequestOptions = {
  method: string;
  headers?: Record<string, string>;
  body?: string;
};

async function handleResponse(response: Response) {
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    const error = await response.json();
    throw new Error(error.detail || 'API request failed');
  }
  return response.json();
}

async function fetchWithAuth(endpoint: string, options: RequestOptions = { method: 'GET' }) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${baseURL}${endpoint}`, {
    ...options,
    headers,
  });

  return handleResponse(response);
}

export const api = {
  get: <T>(endpoint: string): Promise<T> => 
    fetchWithAuth(endpoint),

  post: <T>(endpoint: string, data?: unknown): Promise<T> => 
    fetchWithAuth(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data: unknown): Promise<T> => 
    fetchWithAuth(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: <T>(endpoint: string): Promise<T> => 
    fetchWithAuth(endpoint, {
      method: 'DELETE',
    }),
};
