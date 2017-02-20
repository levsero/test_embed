import { camelizeKeys, decamelizeKeys } from 'humps';

import { transport } from 'service/transport';

export default function apiGet(path, query = {}) {
  return new Promise((resolve, reject) => {
    transport.get({
      method: 'get',
      path,
      query: decamelizeKeys(query),
      callbacks: {
        done({ body }) {
          resolve(camelizeKeys(body));
        },
        fail(error) {
          reject(error);
        }
      }
    });
  });
}
