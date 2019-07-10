import { render, fireEvent } from 'react-testing-library'
import React from 'react'
import createStore from 'src/redux/createStore'
import { Provider } from 'react-redux'
import { HelpCenterMobile } from '../HelpCenterMobile'

const renderComponent = props => {
  const store = createStore()
  const defaultProps = {
    buttonLabel: '',
    chatAvailable: false,
    children: <div />,
    handleNextClick: noop,
    handleOnChangeValue: noop,
    onSearchFieldFocus: noop,
    search: noop,
    callbackEnabled: false,
    isContextualSearchPending: false,
    chatOfflineAvailable: false,
    contextualHelpEnabled: false,
    searchPlaceholder: '',
    title: '',
    contextualHelpRequestNeeded: false
  }

  const mergedProps = { ...defaultProps, ...props }

  return render(
    <Provider store={store}>
      <HelpCenterMobile {...mergedProps} />
    </Provider>
  )
}

jest.useFakeTimers()

test('renders the expected components', () => {
  const { container } = renderComponent({
    searchPlaceholder: 'How can we help?',
    title: 'hello'
  })

  expect(container).toMatchSnapshot()
})

describe('render', () => {
  it('renders button with loading animation', () => {
    const { container } = renderComponent({
      showNextButton: true,
      articleViewActive: true,
      buttonLoading: true
    })

    expect(container.querySelector('footer')).toMatchSnapshot()
  })

  it('renders expected next button', () => {
    const { container } = renderComponent({
      showNextButton: true,
      articleViewActive: true,
      buttonLabel: 'hello world'
    })

    expect(container.querySelector('footer')).toMatchSnapshot()
  })

  describe('show channelChoice options', () => {
    it('show channel choice when channelChoice is true', () => {
      const { queryByText } = renderComponent({ channelChoice: true })

      expect(queryByText('Leave a message')).toBeInTheDocument()
    })

    it('hide channel choice when channelChoice is false', () => {
      const { queryByText } = renderComponent({ channelChoice: false })

      expect(queryByText('Leave a message')).not.toBeInTheDocument()
    })
  })

  describe('hide zendesk logo', () => {
    it('hides the zendesk logo when hasSearched is true', () => {
      const { queryByTestId } = renderComponent({ hasSearched: true })

      expect(queryByTestId('Icon--zendesk')).not.toBeInTheDocument()
    })

    it('hide the zendesk logo when hideZendeskLogo is true', () => {
      const { queryByTestId } = renderComponent({ hideZendeskLogo: true })

      expect(queryByTestId('Icon--zendesk')).not.toBeInTheDocument()
    })
  })

  describe('shows zendesk logo', () => {
    it('show the zendesk logo when hasSearched is false', () => {
      const { queryByTestId } = renderComponent({ hasSearched: false })

      expect(queryByTestId('Icon--zendesk')).toBeInTheDocument()
    })

    it('shows the zendesk logo when hideZendeskLogo is false', () => {
      const { queryByTestId } = renderComponent({ hideZendeskLogo: false })

      expect(queryByTestId('Icon--zendesk')).toBeInTheDocument()
    })
  })

  describe('footer content', () => {
    it('renders footer buttons when showNextButton and articleViewActive is true', () => {
      const { queryByText } = renderComponent({
        showNextButton: true,
        buttonLabel: 'Leave us a message',
        articleViewActive: true
      })

      expect(queryByText('Leave us a message')).toBeInTheDocument()
    })

    it('does not render footer buttons when showNextButton is false', () => {
      const { queryByText } = renderComponent({
        showNextButton: false
      })

      expect(queryByText('Leave us a message')).not.toBeInTheDocument()
    })
  })

  describe('child content', () => {
    test('child content is not rendered initially', () => {
      const { queryByText } = renderComponent({
        children: <div>Hello World</div>
      })

      expect(queryByText('Hello World')).not.toBeInTheDocument()
    })

    test('child content is rendered when articleViewActive and isContextualSearchPending are true', () => {
      const { queryByText } = renderComponent({
        children: <div>Hello World</div>,
        articleViewActive: true,
        isContextualSearchPending: true
      })

      expect(queryByText('Hello World')).toBeInTheDocument()
    })

    test('loading bar is rendered when articleViewActive is false and search input is clicked', () => {
      const { getByPlaceholderText, container } = renderComponent({
        children: <div>Hello World</div>,
        articleViewActive: false,
        isContextualSearchPending: true,
        searchPlaceholder: 'How can we help?'
      })

      fireEvent.click(getByPlaceholderText('How can we help?'))
      expect(container.querySelector('.loadingBarContent')).toBeInTheDocument()
    })

    test('child content is rendered when isContextualSearchPending is false and articleViewActive is true', () => {
      const { queryByText } = renderComponent({
        children: <div>Hello World</div>,
        articleViewActive: true,
        isContextualSearchPending: false
      })

      expect(queryByText('Hello World')).toBeInTheDocument()
    })
  })
})

describe('search box clicked', () => {
  it('changes screen when search box is clicked', () => {
    const { queryByText, getByPlaceholderText } = renderComponent({
      searchPlaceholder: 'How can we help?'
    })

    expect(queryByText('Do you have a specific question?')).toBeInTheDocument()

    fireEvent.click(getByPlaceholderText('How can we help?'))

    expect(queryByText('Do you have a specific question?')).not.toBeInTheDocument()
  })

  it('changes screen back to inital view when user clicks outside the search box ', () => {
    const { queryByText, getByPlaceholderText } = renderComponent({
      searchPlaceholder: 'How can we help?'
    })

    fireEvent.click(getByPlaceholderText('How can we help?'))
    fireEvent.blur(getByPlaceholderText('How can we help?'))

    expect(queryByText('Do you have a specific question?')).not.toBeInTheDocument()
    jest.runAllTimers()
    expect(queryByText('Do you have a specific question?')).toBeInTheDocument()
  })

  it('hides the footer', () => {
    const { queryByText, getByPlaceholderText } = renderComponent({
      showNextButton: true,
      hasSearched: true,
      contextualHelpRequestNeeded: true,
      buttonLabel: 'Leave us a message',
      searchPlaceholder: 'How can we help?'
    })

    expect(queryByText('Leave us a message')).toBeInTheDocument()

    fireEvent.focus(getByPlaceholderText('How can we help?'))

    expect(queryByText('Leave us a message')).not.toBeInTheDocument()
  })

  it('shows the footer after focus is lost from search input', () => {
    const { queryByText, getByPlaceholderText } = renderComponent({
      showNextButton: true,
      hasSearched: true,
      contextualHelpRequestNeeded: true,
      buttonLabel: 'Leave us a message',
      searchPlaceholder: 'How can we help?'
    })

    fireEvent.focus(getByPlaceholderText('How can we help?'))
    fireEvent.blur(getByPlaceholderText('How can we help?'))
    jest.runAllTimers()
    expect(queryByText('Leave us a message')).toBeInTheDocument()
  })
})
