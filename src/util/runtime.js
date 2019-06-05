import { store } from 'service/persistence';

export const debug = (__DEV__ || store.get('debug') || false);
