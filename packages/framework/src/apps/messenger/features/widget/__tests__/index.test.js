import {
  frameMarginFromPage,
  launcherSize,
  marginBetweenFrames,
} from 'src/apps/messenger/constants'
import { render } from 'src/apps/messenger/utils/testHelpers'
import Messenger from '../'

jest.mock('src/apps/messenger/features/messageLog/hooks/useFetchMessages.js', () => () => ({
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

    expect(getByTitle('Messaging window')).toHaveStyle(`
      bottom: ${launcherSize + frameMarginFromPage + marginBetweenFrames};
      right: ${frameMarginFromPage};
    `)
  })
})
