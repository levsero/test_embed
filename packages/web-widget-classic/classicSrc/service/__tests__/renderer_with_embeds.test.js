import reducer from 'classicSrc/redux/modules/reducer'
import { settings } from 'classicSrc/service/settings'
import _ from 'lodash'
import { createStore } from 'redux'
import { renderer } from '../renderer'

jest.mock('classicSrc/service/settings')
jest.mock('classicSrc/redux/modules/base')

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
