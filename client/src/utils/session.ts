const SESSION_STORAGE_KEY = 'ayrovi_session_id';
let volatileSessionId = '';

const createSessionId = (): string => {
  const randomPart = globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);
  return `ayrovi-${Date.now()}-${randomPart}`;
};

export const getSessionId = (): string => {
  try {
    const existing = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (existing) return existing;

    const sessionId = createSessionId();
    window.localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    return sessionId;
  } catch {
    if (!volatileSessionId) volatileSessionId = createSessionId();
    return volatileSessionId;
  }
};
