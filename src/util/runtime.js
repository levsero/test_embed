import { store } from 'service/persistence';

export const inDebugMode = () => (__DEV__ || store.get('debug') || false);
