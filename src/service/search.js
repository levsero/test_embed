import { transport } from 'service/transport';

const sender = (url) => (query, doneFn, failFn) => {
  const payload = {
    method: 'get',
    path: url,
    query: query,
    authorization: ``,
    callbacks: {
      done: doneFn,
      fail: failFn
    }
  };

  transport.send(payload);
};

export const search = {
  sender: sender('/api/v2/help_center/search.json'),
  contextualSender: sender('/api/v2/help_center/articles/embeddable_search.json')
};
