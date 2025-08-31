export const API_BASE = (import.meta as any).env.VITE_API_URL ?? '/api/v1';

async function request(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
    ...opts,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw data || { message: res.statusText };
  return data;
}

export async function signIn(email: string, password: string) {
  return request('/auth/sign-in', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function signUp(name: string, email: string, password: string) {
  return request('/auth/sign-up', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
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
