import { frameMarginFromPage, launcherSize, marginBetweenFrames } from 'messengerSrc/constants'
import { render } from 'messengerSrc/utils/testHelpers'
import Messenger from '../'

jest.mock('messengerSrc/features/messageLog/hooks/useFetchMessages.js', () => () => ({
  fetchHistoryOnScrollTop: jest.fn(),
  isFetchingHistory: false,
  errorFetchingHistory: false,
  retryFetchMessages: jest.fn(),
}))

describe('Messenger', () => {
  const renderComponent = () => render(<Messenger />)

  it('renders an iframe', () => {
    const { getByTitle } = renderComponent()

    expect(getByTitle('Messaging window')).toBeInTheDocument()
  })

  it('is positioned in the bottom right of the screen above the launcher', () => {
    const { getByTitle } = renderComponent()

    expect(getByTitle('Messaging window').parentNode).toHaveStyle(`
      bottom: ${launcherSize + frameMarginFromPage + marginBetweenFrames}px;
      right: ${frameMarginFromPage}px;
    `)
  })
})
