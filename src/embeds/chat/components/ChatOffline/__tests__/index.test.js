import { render } from 'utility/testHelpers'
import React from 'react'
import { OFFLINE_FORM_SCREENS } from 'src/constants/chat'

import { Component as ChatOffline } from '../'

jest.mock('src/embeds/chat/pages/OfflineFormPage', () => () => <div>ChatOfflineForm</div>)

jest.mock('src/embeds/chat/pages/OperatingHoursPage', () => () => <div>OperatingHoursPage</div>)

const renderComponent = inProps => {
  const props = {
    formSettings: { enabled: false },
    offlineMessage: { screen: OFFLINE_FORM_SCREENS.MAIN },
    ...inProps
  }
  return render(<ChatOffline {...props} />)
}

describe('render', () => {
  describe('when screen is the OPERATING_HOURS screen', () => {
    it('renders the operating hours screen', () => {
      const { getByText } = renderComponent({
        offlineMessage: { screen: OFFLINE_FORM_SCREENS.OPERATING_HOURS }
      })

      expect(getByText('OperatingHoursPage')).toBeInTheDocument()
    })
  })

  describe('when formSettings are not enabled', () => {
    describe('renders chatOfflineScreen', () => {
      it('renders title', () => {
        expect(renderComponent().getByText('Chat with us')).toBeInTheDocument()
      })

      it('renders apology', () => {
        expect(
          renderComponent().getByText('Sorry, we are not online at the moment')
        ).toBeInTheDocument()
      })

      it('renders close button', () => {
        expect(renderComponent().getByText('Close')).toBeInTheDocument()
      })
    })
  })

  describe('when form settings are enabled', () => {
    it('renders chatOfflineForm', () => {
      const { getByText } = renderComponent({ formSettings: { enabled: true } })

      expect(getByText('ChatOfflineForm')).toBeInTheDocument()
    })
  })

  describe('when form settings are disabled', () => {
    it('renders NoAgentsPage', () => {
      const { getByText } = renderComponent({ formSettings: { enabled: false } })

      expect(getByText('Sorry, we are not online at the moment')).toBeInTheDocument()
    })
  })
})
