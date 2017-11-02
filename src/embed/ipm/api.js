import { transform, snakeCase, camelCase, isObject, noop } from 'lodash';

import { http } from 'service/transport';

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

function get(path, query = {}, resolve = noop, reject = noop) {
  http.get({
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

function post(path, params = {}, resolve = noop, reject = noop) {
  http.send({
    method: 'post',
    path,
    params: decamelizeKeys(params),
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

export const api = {
  get,
  post
};
