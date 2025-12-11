import http from 'k6/http';
import { check } from 'k6';

export function loginUser(user, baseUrl) {
  const loginRes = http.post(`${baseUrl}/auth/login`, JSON.stringify({
    email: user.email,
    password: user.password,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  check(loginRes, {
    'login status 200': r => r.status === 200,
    'login success': r => r.json('success') === true,
    'login has token': r => !!r.json('data.token'),
  });
  return loginRes.json('data.token');
}
