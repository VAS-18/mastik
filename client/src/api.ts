import axios from 'axios';

const envBase = (import.meta as any).env.VITE_API_URL;
const defaultDevBase = 'http://localhost:3000/api/v1';
export const API_BASE = envBase ?? (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? defaultDevBase : '/api/v1');

if (!envBase && typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  // Informative during dev so you know where requests are going
  // eslint-disable-next-line no-console
  console.warn(`VITE_API_URL not set — using default backend ${defaultDevBase}. Set VITE_API_URL in client/.env to change this.`);
}

async function request(path: string, opts: any = {}) {
  try {
    const url = `${API_BASE}${path}`;
    const method = opts.method || 'GET';
    const headers = opts.headers || { 'Content-Type': 'application/json' };
    const data = opts.body ? JSON.parse(opts.body) : undefined;
    const res = await axios({ url, method, headers, data });
    return res.data;
  } catch (err: any) {
    if (err.response) {
      const { status, data } = err.response;
      const message = data && typeof data === 'object' && data.message ? data.message : (typeof data === 'string' ? data : err.message);
      throw { message, status, raw: data };
    }
    throw { message: err.message, status: null, raw: null };
  }
}

export async function signIn(email: string, password: string) {
  const data = await request('/auth/sign-in', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (data && (data as any).Refresh_token && !(data as any).token) {
    (data as any).token = (data as any).Refresh_token;
  }
  return data;
}

export async function signUp(name: string, email: string, password: string) {
  return request('/auth/sign-up', {
    method: 'POST',
    body: JSON.stringify({ username: name, email, password }),
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
    body: JSON.stringify({ url }),
  });
}

export async function addContent(token: string, payload: any) {
  return request('/user/add', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function deleteContent(token: string, payload: any) {
  return request('/user/delete', {
    method: 'POST',
    headers: {Authorization: `Bearer ${token}`},
    body: JSON.stringify(payload)
  })
}
