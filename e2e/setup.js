import toAppearInOrder from './extensions/to-appear-in-order'
import toHaveFocus from './extensions/to-have-focus'
import { toBeVisible, toBeHidden } from './extensions/visibility'
import { toMatchImageSnapshot } from 'jest-image-snapshot'
import { headless } from './env'

const TIMEOUT = !headless ? 60000 * 10 : 30000

jest.setTimeout(TIMEOUT)
page.setDefaultTimeout(20000)

expect.extend({
  toBeVisible,
  toBeHidden,
  toHaveFocus,
  toAppearInOrder,
  toMatchImageSnapshot
})

process.on('unhandledRejection', function(err, promise) {
  console.error('Unhandled rejection (promise: ', promise, ', reason: ', err, ').') // eslint-disable-line no-console
})
