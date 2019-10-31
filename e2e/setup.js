import 'expect-puppeteer'
import toAppearInOrder from './extensions/to-appear-in-order'
import toHaveFocus from './extensions/to-have-focus'
import { toBeVisible, toBeHidden } from './extensions/visibility'

jest.setTimeout(30000)
page.setDefaultTimeout(30000)

expect.extend({
  toBeVisible,
  toBeHidden,
  toHaveFocus,
  toAppearInOrder
})

process.on('unhandledRejection', function(err, promise) {
  console.error('Unhandled rejection (promise: ', promise, ', reason: ', err, ').') // eslint-disable-line no-console
})
