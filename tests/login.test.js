import http from 'k6/http';

import { sleep, check } from 'k6';

export const options = {
  
  stages: [
    { duration: '5s', target: 10 },
    { duration: '20s', target: 10 },
    { duration: '5s', target: 0 }    
  ],

  thresholds: {
    http_req_duration: ['p(90)<3000', 'max<5000'],
    http_req_failed: ['rate<0.01']
  }
};


export default function () {
    const url = 'http://localhost:3000/login';
    const payload = JSON.stringify({
        username: 'cloe.alberto',
        senha: '101010',
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.post(url, payload, params);
    
    check(res, {
        'status is 200': (r) => r.status === 200,
        'response body contains token': (r) => r.body.includes('token'),
        "validate if token is string": (r) => typeof(r.json().token) === 'string',
    });
    
    sleep(1);
    

}

