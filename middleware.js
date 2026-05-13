export default function middleware(request) {
  const basicAuth = request.headers.get('authorization');

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [, pwd] = atob(authValue).split(':');
    if (pwd === 'Elovate2026!') {
      return;
    }
  }

  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Elovate Vendor Benchmark"',
    },
  });
}

export const config = {
  matcher: '/(.*)',
};
