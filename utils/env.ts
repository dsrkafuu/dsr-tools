export function isSSR() {
  return typeof window === 'undefined';
}

export function isCSR() {
  return typeof window !== 'undefined';
}

export function isMobile() {
  return isCSR() && window.innerWidth <= 767;
}

export function isPC() {
  return isCSR() && window.innerWidth > 767;
}
