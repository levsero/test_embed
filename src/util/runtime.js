import { store } from 'src/framework/services/persistence'

export const inDebugMode = () => __DEV__ || store.get('debug') || false
