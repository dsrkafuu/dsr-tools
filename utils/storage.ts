const STORAGE_PREFIX = 'DSRTOOLS_V5_';

export function setLS(key: string, value: unknown) {
  try {
    localStorage.setItem(
      STORAGE_PREFIX + key.toUpperCase(),
      JSON.stringify(value)
    );
  } catch {
    return;
  }
}

export function getLS(key: string): unknown {
  try {
    const res = localStorage.getItem(STORAGE_PREFIX + key.toUpperCase());
    if (res === null) {
      return null;
    }
    return JSON.parse(res);
  } catch {
    return null;
  }
}
