import reducer from 'src/redux/modules/chat/reducer'

jest.mock('src/util/nullZChat')

jest.mock('src/redux/modules/chat/reducer/chat-last-read-timestamp', () => {
  return jest.fn().mockImplementation(() => {
    return 1564104859456
  })
})

const reduceWithLoggingOut = (prevState) => {
  return reducer(prevState, { type: 'widget/chat/CHAT_USER_LOGGING_OUT' })
}

describe('chat root reducer', () => {
  it('has the expected sub states', () => {
    const state = reducer({}, { type: '' })

    expect(state).toMatchSnapshot()
  })
})

describe('when a CHAT_USER_LOGGING_OUT action is dispatched', () => {
  const prevState = {
    vendor: 'yoloVendorLibrary',
    isLoggingOut: true,
    screen: 'MOST_GREATEST_CHAT_SCREEN',
    accountSettings: {
      login: 'YAS',
    },
  }

  it('retains the vendor sub state', () => {
    const state = reduceWithLoggingOut(prevState)

    expect(state.vendor).toEqual('yoloVendorLibrary')
  })

  it('retains the isLoggingOut sub state', () => {
    const state = reduceWithLoggingOut(prevState)

    expect(state.isLoggingOut).toEqual(true)
  })

  it('retains the screen sub state', () => {
    const state = reduceWithLoggingOut(prevState)

    expect(state.screen).toEqual('MOST_GREATEST_CHAT_SCREEN')
  })

  it('retains the accountSettings sub state', () => {
    const state = reduceWithLoggingOut(prevState)

    expect(state.accountSettings.login).toEqual('YAS')
  })
})
