import _ from 'lodash'
import { render, fireEvent } from 'react-testing-library'
import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from 'src/redux/modules/reducer'
import Navigation, { Navigation as NonConnectedNavigation } from '../Navigation'
import * as selectors from 'src/redux/modules/selectors/chat-linked-selectors'
import * as chatUtil from 'src/util/chat'

jest.mock('src/util/chat')

const renderComponent = props => {
  const store = createStore(reducer)
  const defaultProps = {
    isMobile: false,
    popoutButtonVisible: true,
    handleOnCloseFocusChange: jest.fn()
  }
  const actualProps = _.merge({}, defaultProps, props)

  return render(
    <Provider store={store}>
      <Navigation {...actualProps} />
    </Provider>
  )
}

const renderPureComponent = props => {
  const defaultProps = {
    isMobile: false,
    popoutButtonVisible: true,
    standaloneMobileNotificationVisible: false,
    handleCloseButtonClicked: noop,
    handlePopoutButtonClicked: noop,
    zChat: { getMachineId: () => 'machine id' },
    isChatPreview: false,
    chatPopoutSettings: {},
    locale: 'en-US',
    handleOnCloseFocusChange: noop
  }
  const actualProps = _.merge({}, defaultProps, props)

  return render(<NonConnectedNavigation {...actualProps} />)
}

describe('rendering', () => {
  describe('with default props', () => {
    const { container } = renderPureComponent()

    it('renders correctly', () => {
      expect(container).toMatchSnapshot()
    })
  })
})

describe('actions', () => {
  describe('clicking popout', () => {
    const mockHandlePopoutButtonClicked = jest.fn()

    beforeEach(() => {
      jest.spyOn(chatUtil, 'createChatPopoutWindow')
    })

    describe('when not preview', () => {
      beforeEach(() => {
        const container = renderPureComponent({
          handlePopoutButtonClicked: mockHandlePopoutButtonClicked
        }).container

        fireEvent.click(container.querySelector('.popoutDesktop'))
      })

      it('calls createChatPopoutWindow', () => {
        expect(chatUtil.createChatPopoutWindow).toHaveBeenCalledWith({}, 'machine id', 'en-US')
      })

      it('calls handlePopoutButtonClicked', () => {
        expect(mockHandlePopoutButtonClicked).toHaveBeenCalled()
      })
    })

    describe('clicking popout', () => {
      describe('when it is preview', () => {
        it('does not call createChatPopoutWindow', () => {
          jest.spyOn(chatUtil, 'createChatPopoutWindow')

          const { container } = renderPureComponent({ isChatPreview: true })

          fireEvent.click(container.querySelector('.popoutDesktop'))

          expect(chatUtil.createChatPopoutWindow).not.toHaveBeenCalled()
        })

        it('does not call handlePopoutButtonClicked', () => {
          expect(mockHandlePopoutButtonClicked).not.toHaveBeenCalled()
        })
      })
    })
  })
})

describe('menu button', () => {
  beforeEach(() => {
    jest.spyOn(selectors, 'getShowMenu').mockReturnValue(true)
  })

  afterEach(() => {
    selectors.getShowMenu.mockRestore()
  })

  it('can be shown', () => {
    const { container } = renderComponent({ isMobile: true })

    expect(container.querySelector('button[aria-label=Menu]')).toBeInTheDocument()
  })

  it('can be hidden', () => {
    const { container } = renderComponent({ isMobile: false })

    expect(container.querySelector('button[aria-label=Menu]')).not.toBeInTheDocument()
  })
})

test('can hide the close button', () => {
  const { container } = renderComponent({ hideNavigationButtons: true })

  expect(container.querySelector('button[aria-label=Close]')).not.toBeInTheDocument()
})

test('renders the close button by default', () => {
  const { container } = renderComponent()

  expect(container.querySelector('button[aria-label=Close]')).toBeInTheDocument()
})

describe('popout button', () => {
  afterEach(() => {
    selectors.getIsPopoutButtonVisible.mockRestore()
  })

  it('can be shown', () => {
    jest.spyOn(selectors, 'getIsPopoutButtonVisible').mockReturnValue(true)

    const { container } = renderComponent()

    expect(container.querySelector('button[aria-label=Popout]')).toBeInTheDocument()
  })

  it('can be hidden', () => {
    jest.spyOn(selectors, 'getIsPopoutButtonVisible').mockImplementation(jest.fn(() => false))

    const { container } = renderComponent({ hideNavigationButtons: true })

    expect(container.querySelector('button[aria-label=Popout]')).not.toBeInTheDocument()
  })
})
