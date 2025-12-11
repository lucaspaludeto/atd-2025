import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Trend } from 'k6/metrics';
import faker from 'k6/x/faker';
import { getBaseUrl } from './helpers/getBaseUrl.js';
import { randomEmail } from './helpers/randomEmail.js';
import { loginUser } from './helpers/loginUser.js';

const postCheckoutDurationTrend = new Trend('post_checkout_duration');

export let options = {
//   vus: 1,
//   duration: '15s',
  thresholds: {
    http_req_duration: ['p(95)<2000'],
  },
  stages: [
    { duration: '3s', target: 10 },
    { duration: '15s', target: 10 },
    { duration: '5s', target: 0 },
  ],
};

const BASE_URL = getBaseUrl();

export default function () {
  let user = {
    email: randomEmail(),
    password: faker.internet.password(),
    name: faker.person.firstName(),
  };

  let token = '';

  group('Register User', () => {
    const res = http.post(`${BASE_URL}/auth/register`, JSON.stringify(user), {
      headers: { 'Content-Type': 'application/json' },
    });
    check(res, {
      'register status 200/201': r => r.status === 200 || r.status === 201,
      'register success': r => r.json('success') === true,
    });
  });

  group('Login User', () => {
    token = loginUser(user, BASE_URL);
  });

  group('Checkout', () => {
    const checkoutRes = http.post(`${BASE_URL}/checkout`, JSON.stringify({
      items: [{ productId: 1, quantity: 1 }],
      paymentMethod: 'cash',
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    check(checkoutRes, {
      'checkout status 200': r => r.status === 200,
      'checkout success': r => r.json('success') === true,
    });
    postCheckoutDurationTrend.add(checkoutRes.timings.duration);
  });

  sleep(1);
}
