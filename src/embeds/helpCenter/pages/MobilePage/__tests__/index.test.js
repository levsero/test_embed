import { render } from '@testing-library/react'
import React from 'react'
import createStore from 'src/redux/createStore'
import { Provider } from 'react-redux'
import MobilePage from '../index'
import * as devices from 'utility/devices'

import * as selectors from 'src/redux/modules/selectors/selectors'

const renderComponent = props => {
  const store = createStore()
  const defaultProps = {
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
  jest.spyOn(selectors, 'getHelpCenterButtonLabel').mockReturnValue('click me')
  jest.spyOn(devices, 'isMobileBrowser').mockReturnValue(true)
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
    jest.spyOn(selectors, 'getChatConnectionConnecting').mockReturnValue(true)
    const { container } = renderComponent({
      showNextButton: true,
      articleViewActive: true
    })

    expect(container.querySelector('footer')).toMatchSnapshot()
  })

  it('renders expected next button', () => {
    const { container } = renderComponent({
      showNextButton: true,
      articleViewActive: true
    })

    expect(container.querySelector('footer')).toMatchSnapshot()
  })

  describe('footer content', () => {
    it('renders footer buttons when showNextButton and articleViewActive is true', () => {
      const { queryByText } = renderComponent({
        showNextButton: true,
        articleViewActive: true
      })

      expect(queryByText('click me')).toBeInTheDocument()
    })

    it('renders footer buttons when showNextButton and hasSearched is true', () => {
      const { queryByText } = renderComponent({
        articleViewActive: true,
        showNextButton: true,
        hasSearched: true
      })

      expect(queryByText('click me')).toBeInTheDocument()
    })

    it('does not render footer buttons when showNextButton is false', () => {
      const { queryByText } = renderComponent({
        showNextButton: false
      })

      expect(queryByText('click me')).not.toBeInTheDocument()
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
