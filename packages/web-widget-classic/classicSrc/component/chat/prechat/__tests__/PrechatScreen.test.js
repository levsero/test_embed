import { getByTestId } from '@testing-library/react'
import { Component } from 'classicSrc/component/chat/prechat/PrechatScreen'
import { TEST_IDS } from 'classicSrc/constants/shared'
import * as screens from 'classicSrc/redux/modules/chat/chat-screen-types'
import { render } from 'classicSrc/util/testHelpers'

const updateChatScreenSpy = jest.fn()

const renderComponent = (inProps) => {
  const props = {
    title: 'mockTitle',
    screen: screens.PRECHAT_SCREEN,
    prechatFormSettings: {
      form: { name: {}, email: {}, phone: {}, message: {} },
      message: 'hello friend, intro message',
    },
    updateChatScreen: updateChatScreenSpy,
    setDepartment: () => {},
    hasChatHistory: false,
    sendMsg: () => {},
    visitor: {},
    readOnlyState: {},
    setVisitorInfo: () => {},
    handlePrechatFormSubmit: () => {},
    authUrls: {},
    socialLogin: {},
    loginSettings: {},
    initiateSocialLogout: () => {},
    isAuthenticated: false,
    departmentFieldHidden: false,
    openedChatHistory: () => {},
    chatHistoryLabel: 'historyLabel',
    offlineMessage: {
      details: {
        name: 'testName',
        email: 'testEmail@test.com',
        phone: '0400000000',
        message: 'Hello Message',
      },
    },

    ...inProps,
  }

  return render(<Component {...props} />)
}

describe('render', () => {
  describe('when screen is loading screen', () => {
    const renderLoadingScreen = () => renderComponent({ screen: screens.LOADING_SCREEN })

    it('renders title', () => {
      expect(renderLoadingScreen().getByText('mockTitle')).toBeInTheDocument()
    })

    it('renders loading spinner', () => {
      expect(
        getByTestId(renderLoadingScreen().container, TEST_IDS.LOADING_SPINNER)
      ).toBeInTheDocument()
    })
  })

  describe('when screen is offline message screen', () => {
    const renderOfflineScreen = () =>
      renderComponent({ screen: screens.OFFLINE_MESSAGE_SUCCESS_SCREEN })

    it('renders success message', () => {
      expect(
        renderOfflineScreen().getByText('Someone will get back to you soon')
      ).toBeInTheDocument()
    })

    it('renders the title', () => {
      expect(renderOfflineScreen().getByText('Chat with us')).toBeInTheDocument()
    })
  })
})
