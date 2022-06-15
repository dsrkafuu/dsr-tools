const PREFIX = 'dsr-tools';

export function getLS<T>(key: string): T | null {
  try {
    const data = localStorage.getItem(`${PREFIX}__${key}`);
    if (data) {
      const parsed = JSON.parse(data);
      return parsed as T;
    }
    return null;
  } catch {
    return null;
  }
}

export function setLS<T>(key: string, data: T): void {
  try {
    localStorage.setItem(`${PREFIX}__${key}`, JSON.stringify(data));
  } catch {
    return;
  }
}

export function removeLS(key: string): void {
  try {
    localStorage.removeItem(`${PREFIX}__${key}`);
  } catch {
    return;
  }
}
