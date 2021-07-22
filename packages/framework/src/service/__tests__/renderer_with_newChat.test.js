import _ from 'lodash'
import { createStore } from 'redux'
import reducer from 'src/redux/modules/reducer'
import { settings } from 'src/service/settings'
import { renderer } from '../renderer'

jest.mock('src/service/settings')
jest.mock('src/redux/modules/base')

const store = createStore(reducer)
let mockSettings

store.dispatch = jest.fn()

beforeEach(() => {
  mockSettings = {
    contactOptions: { enabled: false },
  }
  settings.get = (value) => _.get(mockSettings, value, null)
})

test('new chat', async () => {
  const configJSON = {
    embeds: {
      chat: {
        embed: 'chat',
        props: {
          zopimId: '2EkTn0An31opxOLXuGgRCy5nPnSNmpe6',
          position: 'br',
          standalone: true,
        },
      },
      launcher: {
        embed: 'launcher',
        props: {},
      },
    },
  }

  await renderer.init({
    config: configJSON,
    reduxStore: store,
  })
  await renderer.run({
    config: configJSON,
    reduxStore: store,
  })

  expect(document.body.innerHTML).toMatchSnapshot()
})
