/* eslint-disable @typescript-eslint/no-explicit-any */

export function log(...args: any[]) {
  console.log('🍥', ...args);
}

export function error(...args: any[]) {
  console.error('🍥', ...args);
}
