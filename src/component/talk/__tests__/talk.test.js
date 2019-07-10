import { render } from '@testing-library/react'
import React from 'react'

import {
  CALLBACK_ONLY_SCREEN,
  PHONE_ONLY_SCREEN,
  CALLBACK_AND_PHONE_SCREEN,
  SUCCESS_NOTIFICATION_SCREEN
} from 'src/redux/modules/talk/talk-screen-types'

import { Component as Talk } from '../Talk'
import { Provider } from 'react-redux'
import createStore from 'src/redux/createStore'
import { locals as styles } from './Talk.scss'
import { handleTalkVendorLoaded } from 'src/redux/modules/talk'

const renderComponent = (overrideProps = {}) => {
  const libphonenumber = {
    parse: num => num,
    format: num => num,
    isValidNumber: () => true
  }

  const defaultProps = {
    getFrameContentDocument: () => document,
    embeddableConfig: {
      phoneNumber: '12345678',
      supportedCountries: ['US']
    },
    formattedPhoneNumber: '12345678',
    formState: {},
    screen: PHONE_ONLY_SCREEN,
    callback: { error: {} },
    averageWaitTime: 'Average wait time: 1 minute',
    agentAvailability: true,
    isMobile: false,
    libphonenumber,
    title: 'Talk',
    nickname: '',
    updateTalkCallbackForm: () => {},
    submitTalkCallbackForm: () => {},
    serviceUrl: '',
    descriptionlabelText: 'How can we help? (optional)',
    namelabelText: 'Name (optional)'
  }
  const props = { ...defaultProps, ...overrideProps }

  const store = createStore()
  store.dispatch(handleTalkVendorLoaded({ libphonenumber }))

  return render(
    <Provider store={store}>
      <Talk {...props} />
    </Provider>
  )
}

describe('talk', () => {
  describe('rendering the zendesk logo', () => {
    describe('with the logo enabled', () => {
      it('renders the zendesk logo', () => {
        const { queryByText } = renderComponent({ agentAvailability: false })

        expect(queryByText('zendesk')).toBeInTheDocument()
      })
    })

    describe('with logo disabled', () => {
      it('does not render the zendesk logo', () => {
        const { queryByText } = renderComponent({
          agentAvailability: false,
          isMobile: true
        })

        expect(queryByText('zendesk')).not.toBeInTheDocument()
      })
    })

    describe('on mobile', () => {
      it('does not render the zendesk logo', () => {
        const { queryByText } = renderComponent({
          agentAvailability: false,
          hideZendeskLogo: true
        })

        expect(queryByText('zendesk')).not.toBeInTheDocument()
      })
    })
  })

  describe('when no agents are available', () => {
    it('renders the offline screen', () => {
      const { getByTestId } = renderComponent({ agentAvailability: false })

      expect(getByTestId('talk--offlinePage')).toBeInTheDocument()
    })

    it('styles the scroll container to take up the full height of the widget', () => {
      const { getByTestId } = renderComponent({ agentAvailability: false })

      expect(getByTestId('scrollcontainer').querySelector('div').className).toContain(
        styles.scrollContainerFullHeight
      )
    })
  })

  describe('callback only screen', () => {
    it('displays a callback form', () => {
      const { queryByText, getByLabelText } = renderComponent({
        screen: CALLBACK_ONLY_SCREEN
      })

      expect(queryByText("Enter your phone number and we'll call you back.")).toBeInTheDocument()
      expect(getByLabelText('Phone Number')).toBeInTheDocument()
      expect(getByLabelText('Name (optional)')).toBeInTheDocument()
      expect(getByLabelText('How can we help? (optional)')).toBeInTheDocument()
    })

    describe('when the fields have values', () => {
      it('renders error messages', () => {
        const { queryByDisplayValue, queryByText } = renderComponent({
          screen: CALLBACK_ONLY_SCREEN,
          formState: {
            name: 'taipan',
            description: 'no one is quite sure'
          }
        })

        expect(queryByDisplayValue('taipan')).toBeInTheDocument()
        expect(queryByText('no one is quite sure')).toBeInTheDocument()
      })
    })

    describe('with a callback error', () => {
      describe('already enqueued error', () => {
        it('renders the error message', () => {
          const { queryByText } = renderComponent({
            screen: CALLBACK_ONLY_SCREEN,
            callback: { error: { message: 'phone_number_already_in_queue' } }
          })

          expect(
            queryByText("You've already submitted a request. We'll get back to you soon.")
          ).toBeInTheDocument()
        })
      })

      describe('with a generic error', () => {
        it('renders the error message', () => {
          const { queryByText } = renderComponent({
            screen: CALLBACK_ONLY_SCREEN,
            callback: { error: { message: 'fooBar' } }
          })

          expect(queryByText('There was an error processing your request. Please try again later.'))
        })
      })
    })
  })

  it('renders the phone only page when screen is PHONE_ONLY_SCREEN', () => {
    const { queryByTestId } = renderComponent({
      screen: PHONE_ONLY_SCREEN
    })

    expect(queryByTestId('talk--phoneOnlyPage')).toBeInTheDocument()
  })

  describe('success notification screen', () => {
    it('displays a phone number and a callback form', () => {
      const { queryByText } = renderComponent({
        screen: SUCCESS_NOTIFICATION_SCREEN
      })

      expect(queryByText('Thanks for reaching out.')).toBeInTheDocument()
      expect(queryByText("We'll get back to you soon.")).toBeInTheDocument()
      expect(queryByText('Done')).toBeInTheDocument()
    })
  })

  describe('callback and phone screen', () => {
    it('displays a phone number and a callback form', () => {
      const { queryByText, getByLabelText } = renderComponent({
        screen: CALLBACK_AND_PHONE_SCREEN
      })

      expect(queryByText("Enter your phone number and we'll call you back.")).toBeInTheDocument()
      expect(queryByText('Our phone number:')).toBeInTheDocument()
      expect(queryByText('12345678')).toBeInTheDocument()
      expect(getByLabelText('Phone Number')).toBeInTheDocument()
      expect(getByLabelText('Name (optional)')).toBeInTheDocument()
      expect(getByLabelText('How can we help? (optional)')).toBeInTheDocument()
    })
  })
})
