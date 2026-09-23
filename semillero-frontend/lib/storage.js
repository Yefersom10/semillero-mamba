
export const storage = {
  get: (key) => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
  },
  set: (key, value) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
  },
  remove: (key) => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },
  getToken: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },
  setToken: (token) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('token', token);
  },
  getUser: () => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  setUser: (user) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('user', JSON.stringify(user));
  },
  clear: () => {
    if (typeof window === 'undefined') return;
    localStorage.clear();
  },
};