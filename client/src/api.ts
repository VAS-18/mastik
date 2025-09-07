import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

// Base URL config
const envBase = (import.meta as any).env.VITE_API_URL;
const defaultDevBase = 'http://localhost:3000/api/v1';
export const API_BASE =
  envBase ??
  (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? defaultDevBase
    : '/api/v1');

if (!envBase && typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  console.warn(
    `VITE_API_URL not set — using default backend ${defaultDevBase}. Set VITE_API_URL in client/.env`
  );
}

// Typed options for request
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: Record<string, any>;
}

// Central request function
async function request(path: string, opts: RequestOptions = {}) {
  try {
    const url = `${API_BASE}${path}`;
    const config: AxiosRequestConfig = {
      url,
      method: opts.method || 'GET',
      headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
      data: opts.body,
    };

    const res = await axios(config);
    return res.data;
  } catch (err: any) {
    if (err.response) {
      const { status, data } = err.response;
      const message =
        data && typeof data === 'object' && data.message
          ? data.message
          : typeof data === 'string'
          ? data
          : err.message;
      throw { message, status, raw: data };
    }
    throw { message: err.message, status: null, raw: null };
  }
}

// API methods

export async function signIn(email: string, password: string) {
  const data = await request('/auth/sign-in', {
    method: 'POST',
    body: { email, password },
  });

  if (data.Refresh_token && !data.token) {
    data.token = data.Refresh_token;
  }

  return data;
}

export async function signUp(name: string, email: string, password: string) {
  return request('/auth/sign-up', {
    method: 'POST',
    body: { username: name, email, password },
  });
}

export async function getMe(token: string) {
  return request('/user/get-me', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getAll(token: string) {
  return request('/user/get-all', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getLinkMetadata(url: string) {
  return request('/metadata', {
    method: 'POST',
    body: { url },
  });
}

export async function addContent(token: string, payload: Record<string, any>) {
  return request('/user/add', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: payload,
  });
}

export async function deleteContent(token: string, payload: Record<string, any>) {
  return request('/user/delete', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: payload,
  });
}

export async function searchContent(token: string, query: string) {
  return request('/user/search', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: { query },
  });
}
