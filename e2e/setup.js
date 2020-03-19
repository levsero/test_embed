import toAppearInOrder from './extensions/to-appear-in-order'
import toHaveFocus from './extensions/to-have-focus'
import { toBeVisible, toBeHidden } from './extensions/visibility'

const TIMEOUT = process.env.HEADLESS == 'false' ? 60000 * 10 : 30000

jest.setTimeout(TIMEOUT)
page.setDefaultTimeout(20000)

expect.extend({
  toBeVisible,
  toBeHidden,
  toHaveFocus,
  toAppearInOrder
})

process.on('unhandledRejection', function(err, promise) {
  console.error('Unhandled rejection (promise: ', promise, ', reason: ', err, ').') // eslint-disable-line no-console
})
