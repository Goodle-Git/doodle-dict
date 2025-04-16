import { authService } from "@/services";

const baseURL = import.meta.env.VITE_BACKEND_URL || '';

type RequestOptions = {
  method: string;
  headers?: Record<string, string>;
  body?: string;
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    if (response.status === 401) {
      const lastRefreshAttempt = localStorage.getItem('lastRefreshAttempt');
      const now = Date.now();
      
      if (!lastRefreshAttempt || now - parseInt(lastRefreshAttempt) > 5 * 60 * 1000) {
        try {
          localStorage.setItem('lastRefreshAttempt', now.toString());
          await authService.verifyToken();
          
          // Extract the relative path from the full URL
          const relativeUrl = new URL(response.url).pathname;
          
          // Retry the original request with the same method and body
          return fetchWithAuth(relativeUrl, {
            method: response.type === 'basic' ? 'GET' : 'POST', // Default to GET for basic requests
            body: response.bodyUsed ? undefined : await response.clone().text()
          });
        } catch {
          // If verification fails, clear auth and redirect
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('lastVerified');
          localStorage.removeItem('lastRefreshAttempt');
          window.location.href = '/login';
        }
      } else {
        // If we've recently tried to refresh, just logout
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    const error = await response.json();
    throw new Error(error.detail || 'API request failed');
  }
  return response.json();
}

async function fetchWithAuth<T>(endpoint: string, options: RequestOptions = { method: 'GET' }): Promise<T> {
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

  return handleResponse<T>(response);
}

export const api = {
  get: <T>(endpoint: string): Promise<T> => 
    fetchWithAuth<T>(endpoint),

  post: <T>(endpoint: string, data?: unknown): Promise<T> => 
    fetchWithAuth<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data: unknown): Promise<T> => 
    fetchWithAuth<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: <T>(endpoint: string): Promise<T> => 
    fetchWithAuth<T>(endpoint, {
      method: 'DELETE',
    }),
};
