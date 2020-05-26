import { isIE } from 'utility/devices'

if (__DEV__ && !isIE()) {
  require('react-hot-loader')
}
