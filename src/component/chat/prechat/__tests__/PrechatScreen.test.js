import { render, fireEvent, getByTestId } from '@testing-library/react'
import createStore from 'src/redux/createStore'
import { Provider } from 'react-redux'
import React from 'react'

import { Component as PrechatScreen } from 'src/component/chat/prechat/PrechatScreen'
import * as screens from 'src/redux/modules/chat/chat-screen-types'
import { TEST_IDS } from 'src/constants/shared'

const updateChatScreenSpy = jest.fn()

const renderComponent = inProps => {
  const props = {
    title: 'mockTitle',
    screen: screens.PRECHAT_SCREEN,
    prechatFormSettings: {
      form: { name: {}, email: {}, phone: {}, message: {} },
      message: 'hello friend, intro message'
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
        message: 'Hello Message'
      }
    },

    ...inProps
  }

  return render(
    <Provider store={createStore()}>
      <PrechatScreen {...props} />
    </Provider>
  )
}

describe('render', () => {
  let result

  describe('when screen is prechat screen', () => {
    beforeEach(() => {
      result = renderComponent()
    })

    describe('renders Prechat Form', () => {
      it('renders title', () => {
        expect(result.getByText('mockTitle')).toBeInTheDocument()
      })
      it('renders intro message', () => {
        expect(result.getByText('hello friend, intro message')).toBeInTheDocument()
      })

      it('renders message field', () => {
        expect(result.getByText('Message')).toBeInTheDocument()
      })

      it('renders email field', () => {
        expect(result.getByText('Email')).toBeInTheDocument()
      })

      it('renders name field', () => {
        expect(result.getByText('Name')).toBeInTheDocument()
      })
    })
  })

  describe('when screen is loading screen', () => {
    beforeEach(() => {
      result = renderComponent({ screen: screens.LOADING_SCREEN })
    })

    it('renders title', () => {
      expect(result.getByText('mockTitle')).toBeInTheDocument()
    })

    it('renders loading spinner', () => {
      expect(getByTestId(result.container, TEST_IDS.LOADING_SPINNER)).toBeInTheDocument()
    })
  })

  describe('when screen is offline message screen', () => {
    beforeEach(() => {
      result = renderComponent({ screen: screens.OFFLINE_MESSAGE_SCREEN })
    })

    it('renders success message', () => {
      expect(
        result.getByText("Thanks for the message! We'll get back to you as soon as we can.")
      ).toBeInTheDocument()
    })

    it('renders name field', () => {
      expect(result.getByText('testName')).toBeInTheDocument()
    })

    it('renders email field', () => {
      expect(result.getByText('testEmail@test.com')).toBeInTheDocument()
    })

    it('renders phone field', () => {
      expect(result.getByText('0400000000')).toBeInTheDocument()
    })

    it('renders message field', () => {
      expect(result.getByText('Hello Message')).toBeInTheDocument()
    })

    it('renders Send Another button', () => {
      expect(result.getByText('Send Another')).toBeInTheDocument()
    })

    it('when send another button is pressed, call updateChatScreen', () => {
      expect(updateChatScreenSpy).not.toHaveBeenCalled()

      fireEvent.click(result.getByText('Send Another'))

      expect(updateChatScreenSpy).toHaveBeenCalledWith(screens.PRECHAT_SCREEN)
    })
  })
})
