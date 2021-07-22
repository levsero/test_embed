import { render } from 'src/util/testHelpers'
import { Component as SearchPage } from '../index'

jest.mock('src/embeds/helpCenter/components/NotificationPopup', () => {
  return () => <div>NotificationPopup</div>
})

const renderComponent = (inProps) => {
  const props = {
    title: 'pageTitle',
    isMobile: false,
    isContextualSearchPending: false,
    hideZendeskLogo: false,
    showNextButton: true,
    articles: [],
    ...inProps,
  }

  return render(<SearchPage {...props} />)
}

describe('render', () => {
  describe('when not isContextualSearchPending', () => {
    it('matches snapshot, renders NoResults', () => {
      expect(renderComponent().container).toMatchSnapshot()
    })
  })

  describe('when isContextualSearchPending', () => {
    it('matches snapshot, renders LoadingBarContent', () => {
      const result = renderComponent({ isContextualSearchPending: true })
      expect(result.container).toMatchSnapshot()
    })
  })

  it('renders button', () => {
    expect(renderComponent().getByText('Leave us a message')).toBeInTheDocument()
  })

  it('renders page title', () => {
    expect(renderComponent().getByText('pageTitle')).toBeInTheDocument()
  })

  describe('no results', () => {
    it('focuses on search field', () => {
      const { getByPlaceholderText } = renderComponent({ articles: [] })
      expect(document.activeElement).toEqual(getByPlaceholderText('How can we help?'))
    })
  })

  it('renders the notifcation popup on desktop', () => {
    const { getByText } = renderComponent()
    expect(getByText('NotificationPopup')).toBeInTheDocument()
  })

  it('does not render the notifcation popup on mobile', () => {
    const { queryByText } = renderComponent({ isMobile: true })
    expect(queryByText('NotificationPopup')).toBeNull()
  })
})
