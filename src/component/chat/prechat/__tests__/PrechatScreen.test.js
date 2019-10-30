import { fireEvent, getByTestId } from '@testing-library/react'
import React from 'react'

import { render } from 'src/util/testHelpers'
import { Component } from 'src/component/chat/prechat/PrechatScreen'
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

  return render(<Component {...props} />)
}

describe('render', () => {
  describe('when screen is prechat screen', () => {
    describe('renders Prechat Form', () => {
      it('renders title', () => {
        expect(renderComponent().getByText('mockTitle')).toBeInTheDocument()
      })

      it('renders intro message', () => {
        expect(renderComponent().getByText('hello friend, intro message')).toBeInTheDocument()
      })

      it('renders message field', () => {
        expect(renderComponent().getByText('Message')).toBeInTheDocument()
      })

      it('renders email field', () => {
        expect(renderComponent().getByText('Email')).toBeInTheDocument()
      })

      it('renders name field', () => {
        expect(renderComponent().getByText('Name')).toBeInTheDocument()
      })
    })

    describe('submits the prechat form', () => {
      it('validates the fields', () => {
        const form = {
          name: { name: 'name', required: true },
          email: { name: 'email', required: true },
          phone: {
            name: 'phone',
            label: 'Phone Number',
            required: true,
            hidden: false
          },
          message: { name: 'message', label: 'Message', required: true },
          department: {
            name: 'department',
            label: 'Choose Department',
            required: true
          },
          departments: [{ name: 'dept', id: 1234, isDefault: false }]
        }
        const { getByText, queryByText } = renderComponent({ prechatFormSettings: { form } })
        fireEvent.click(getByText('Start chat'))
        expect(queryByText('Please enter a valid name.')).toBeInTheDocument()
        expect(queryByText('Please enter a valid email address.')).toBeInTheDocument()
        expect(queryByText('Please select a department.')).toBeInTheDocument()
        expect(queryByText('Please enter a valid phone number.')).toBeInTheDocument()
        expect(queryByText('Please enter a valid message.')).toBeInTheDocument()
      })
    })
  })

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
    const renderOfflineScreen = () => renderComponent({ screen: screens.OFFLINE_MESSAGE_SCREEN })

    it('renders success message', () => {
      expect(
        renderOfflineScreen().getByText(
          "Thanks for the message! We'll get back to you as soon as we can."
        )
      ).toBeInTheDocument()
    })

    it('renders name field', () => {
      expect(renderOfflineScreen().getByText('testName')).toBeInTheDocument()
    })

    it('renders email field', () => {
      expect(renderOfflineScreen().getByText('testEmail@test.com')).toBeInTheDocument()
    })

    it('renders phone field', () => {
      expect(renderOfflineScreen().getByText('0400000000')).toBeInTheDocument()
    })

    it('renders message field', () => {
      expect(renderOfflineScreen().getByText('Hello Message')).toBeInTheDocument()
    })

    it('renders Send Another button', () => {
      expect(renderOfflineScreen().getByText('Send Another')).toBeInTheDocument()
    })

    it('renders the title', () => {
      expect(renderOfflineScreen().getByText('mockTitle')).toBeInTheDocument()
    })

    it('when send another button is pressed, call updateChatScreen', () => {
      const result = renderOfflineScreen()
      expect(updateChatScreenSpy).not.toHaveBeenCalled()
      fireEvent.click(result.getByText('Send Another'))
      expect(updateChatScreenSpy).toHaveBeenCalledWith(screens.PRECHAT_SCREEN)
    })
  })
})
