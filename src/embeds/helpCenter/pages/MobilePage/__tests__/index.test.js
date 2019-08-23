import { render } from '@testing-library/react'
import React from 'react'
import createStore from 'src/redux/createStore'
import { Provider } from 'react-redux'
import * as utility from 'utility/devices'
import MobilePage from '../index'

const renderComponent = props => {
  const store = createStore()
  const defaultProps = {
    buttonLabel: '',
    chatAvailable: false,
    children: <div />,
    onNextClick: noop,
    handleNextClick: noop,
    handleOnChangeValue: noop,
    onSearchFieldFocus: noop,
    search: noop,
    hasSearched: false,
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
      <MobilePage {...mergedProps} />
    </Provider>
  )
}

jest.useFakeTimers()

beforeEach(() => {
  jest.spyOn(utility, 'isMobileBrowser').mockReturnValue(true)
})

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

  describe('footer content', () => {
    it('renders footer buttons when showNextButton and articleViewActive is true', () => {
      const { queryByText } = renderComponent({
        showNextButton: true,
        buttonLabel: 'Leave us a message',
        articleViewActive: true
      })

      expect(queryByText('Leave us a message')).toBeInTheDocument()
    })

    it('renders footer buttons when showNextButton and hasSearched is true', () => {
      const { queryByText } = renderComponent({
        articleViewActive: true,
        showNextButton: true,
        buttonLabel: 'Leave us a message',
        hasSearched: true
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
