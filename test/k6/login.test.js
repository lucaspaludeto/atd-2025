import http from 'k6/http';
import { check, sleep } from 'k6';
import { getBaseUrl } from './helpers/getBaseUrl.js';
import { SharedArray } from 'k6/data';

const users = new SharedArray('users', function () {
  return JSON.parse(open('./data/login.test.data.json'))
})


export const options = {
  vus: 3,
  iterations: 3,
  thresholds: {
    http_req_duration: ['p(95)<2000'],
  },
};

export default function() {
  const user = users[__VU - 1];
  // const user = users[(__VU - 1) % users.length];

  const email = user.email;
  const password = user.password;

  console.log(user)

  const res = http.post(
    `${getBaseUrl()}/auth/login`, 
    JSON.stringify({ email, password }),
     {
      headers: { 'Content-Type': 'application/json' },
    });

    console.log(res)

    check(res, {
      'login status 200': r => r.status === 200,
      //'login success': r => r.json('success') === true,
      //'login has token': r => !!r.json('data.token'),
    });

  sleep(1);
}
