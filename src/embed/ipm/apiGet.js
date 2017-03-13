import { transform, snakeCase, camelCase, isObject } from 'lodash';

import { transport } from 'service/transport';

const deepRenameKeys = (hash, fn) => (
  transform(hash, (result, value, key) => {
    result[fn(key)] = isObject(value) ? deepRenameKeys(value, fn) : value;
  })
);

const camelizeKeys = (hash) => (
  deepRenameKeys(hash, camelCase)
);

const decamelizeKeys = (hash) => (
  deepRenameKeys(hash, snakeCase)
);

export default function apiGet(path, query = {}, resolve, reject) {
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
}
