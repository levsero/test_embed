import { store } from 'src/persistence'

export default () => __DEV__ || store.get('debug') || false
