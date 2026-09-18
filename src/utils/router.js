// Shared client-side routing helpers for De Lux Crib
// Pure path-based routing (no external router library)

export function getCurrentPage() {
  const path = window.location.pathname.toLowerCase();
  if (path === '/admin' || path.startsWith('/admin/')) return 'admin';
  if (path === '/suites') return 'suites';
  if (path === '/events') return 'events';
  return 'home';
}

export function navigate(path) {
  window.history.pushState({}, '', path);
  // pushState doesn't fire popstate, so notify listeners manually
  window.dispatchEvent(new Event('__nav__'));
}
