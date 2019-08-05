import { render } from '@testing-library/react'
import React from 'react'

import {
  CALLBACK_SCREEN,
  PHONE_US_SCREEN,
  SUCCESS_NOTIFICATION_SCREEN
} from 'src/redux/modules/talk/talk-screen-types'
import { handleTalkVendorLoaded, updateTalkEmbeddableConfig } from 'src/redux/modules/talk'
import { Component as Talk } from '../Talk'
import { Provider } from 'react-redux'
import createStore from 'src/redux/createStore'
import * as reselectors from 'src/embeds/talk/selectors/reselectors'
import { updateEmbeddableConfig } from 'src/redux/modules/base/base-actions'

jest.mock('src/embeds/talk/selectors/reselectors')
jest.spyOn(reselectors, 'getPhoneNumber').mockReturnValue('12345678')
jest.spyOn(reselectors, 'getFormattedPhoneNumber').mockReturnValue('12345678')

const renderComponent = (overrideProps = {}, talkCapability = '0') => {
  const libphonenumber = {
    parse: num => num,
    format: num => num,
    isValidNumber: () => true
  }

  const defaultProps = {
    embeddableConfig: {
      phoneNumber: '12345678',
      supportedCountries: ['US']
    },
    formState: {},
    screen: PHONE_US_SCREEN,
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
  store.dispatch(
    updateTalkEmbeddableConfig({
      supportedCountries: 'US',
      capability: talkCapability
    })
  )
  store.dispatch(updateEmbeddableConfig({ hideZendeskLogo: overrideProps.hideZendeskLogo }))

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
        const { queryByText } = renderComponent({ hideZendeskLogo: false })

        expect(queryByText('widget-icon_zendesk.svg')).toBeInTheDocument()
      })
    })

    describe('with logo disabled', () => {
      it('does not render the zendesk logo', () => {
        const { queryByText } = renderComponent({
          agentAvailability: false,
          isMobile: true,
          hideZendeskLogo: true
        })

        expect(queryByText('widget-icon_zendesk.svg')).not.toBeInTheDocument()
      })
    })

    describe('on mobile', () => {
      it('does not render the zendesk logo', () => {
        const { queryByText } = renderComponent({
          agentAvailability: false,
          hideZendeskLogo: true
        })

        expect(queryByText('widget-icon_zendesk.svg')).not.toBeInTheDocument()
      })
    })
  })

  describe('when no agents are available', () => {
    it('renders the offline screen', () => {
      const { getByTestId } = renderComponent({ agentAvailability: false })

      expect(getByTestId('talk--offlinePage')).toBeInTheDocument()
    })
  })

  describe('callback only screen', () => {
    it('displays a callback form', () => {
      const { queryByTestId } = renderComponent({
        screen: CALLBACK_SCREEN
      })

      expect(queryByTestId('talk--callbackForm')).toBeInTheDocument()
    })
  })

  it('renders the phone only page when screen is PHONE_US_SCREEN', () => {
    const phoneOnlyCapability = '0'
    const { queryByTestId } = renderComponent(
      {
        screen: PHONE_US_SCREEN
      },
      phoneOnlyCapability
    )

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
      const callBackAndPhoneCapability = '2'
      const { queryByText, getByLabelText } = renderComponent(
        {
          screen: CALLBACK_SCREEN
        },
        callBackAndPhoneCapability
      )

      expect(queryByText("Enter your phone number and we'll call you back.")).toBeInTheDocument()
      expect(queryByText('Our phone number:')).toBeInTheDocument()
      expect(queryByText('12345678')).toBeInTheDocument()
      expect(getByLabelText('Phone Number')).toBeInTheDocument()
      expect(getByLabelText('Name (optional)')).toBeInTheDocument()
      expect(getByLabelText('How can we help? (optional)')).toBeInTheDocument()
    })
  })
})
