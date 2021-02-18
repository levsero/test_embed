import { renderer } from '../renderer'
import _ from 'lodash'
import { settings } from 'service/settings'
import { createStore } from 'redux'
import reducer from 'src/redux/modules/reducer'

jest.mock('service/settings')
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

test('renders expected embeds from config', async () => {
  const configJSON = {
    embeds: {
      helpCenterForm: {
        embed: 'helpCenter',
        props: {},
      },
      launcher: {
        embed: 'launcher',
        props: {
          position: 'right',
        },
      },
      ticketSubmissionForm: {
        embed: 'submitTicket',
      },
      chat: {
        embed: 'chat',
        props: {
          zopimId: '2EkTn0An31opxOLXuGgRCy5nPnSNmpe6',
          position: 'br',
        },
      },
    },
  }

  await renderer.run({
    config: configJSON,
    reduxStore: store,
  })

  expect(document.body.innerHTML).toMatchSnapshot()
})
