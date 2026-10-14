import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { readStorage, writeStorage, removeStorage } from '../utils/storage.js';

const AuthContext = createContext(null);

export const DEMO_CREDENTIALS = { email: 'demo@learnly.com', password: 'demo1234' };

const demoUser = {
  id: 'u_demo',
  name: 'Alex Morgan',
  email: DEMO_CREDENTIALS.email,
  password: DEMO_CREDENTIALS.password,
  createdAt: '2026-08-14T09:30:00.000Z',
};

function loadUsers() {
  const stored = readStorage('users', null);
  if (Array.isArray(stored) && stored.length > 0) return stored;
  writeStorage('users', [demoUser]);
  return [demoUser];
}

const normalizeEmail = (email) => email.trim().toLowerCase();

function toPublicUser(user) {
  if (!user) return null;
  const { password, ...publicUser } = user;
  return publicUser;
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(loadUsers);
  const [sessionUserId, setSessionUserId] = useState(() => readStorage('session', null));

  useEffect(() => {
    writeStorage('users', users);
  }, [users]);

  useEffect(() => {
    if (sessionUserId) writeStorage('session', sessionUserId);
    else removeStorage('session');
  }, [sessionUserId]);

  const currentUser = useMemo(
    () => toPublicUser(users.find((user) => user.id === sessionUserId)),
    [users, sessionUserId],
  );

  const register = useCallback(
    ({ name, email, password }) => {
      const normalized = normalizeEmail(email);
      if (users.some((user) => user.email === normalized)) {
        return { ok: false, error: 'An account with this email already exists. Try logging in instead.' };
      }
      const newUser = {
        id: `u_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
        name: name.trim(),
        email: normalized,
        password,
        createdAt: new Date().toISOString(),
      };
      setUsers((previous) => [...previous, newUser]);
      setSessionUserId(newUser.id);
      return { ok: true };
    },
    [users],
  );

  const login = useCallback(
    ({ email, password }) => {
      const match = users.find((user) => user.email === normalizeEmail(email));
      if (!match || match.password !== password) {
        return { ok: false, error: 'Incorrect email or password. Please try again.' };
      }
      setSessionUserId(match.id);
      return { ok: true };
    },
    [users],
  );

  const logout = useCallback(() => setSessionUserId(null), []);

  const value = useMemo(
    () => ({ currentUser, register, login, logout }),
    [currentUser, register, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside an <AuthProvider>.');
  return context;
}
