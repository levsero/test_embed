import trackTicketSubmitted from 'embeds/support/utils/track-ticket-submitted'
import { beacon } from 'service/beacon'

jest.mock('service/beacon', () => ({
  beacon: {
    trackUserAction: jest.fn()
  }
}))

describe('trackTicketSubmitted', () => {
  const getParams = (responseParam = 'request') => ({
    searchTerm: 'search term',
    searchLocale: 'en-US',
    res: {
      body: {
        [responseParam]: {
          id: 'response id',
          email: 'trackTicketSubmitted@example.com',
          attachmentsCount: 5,
          attachmentTypes: 'attachment types',
          contextualSearch: true
        }
      }
    }
  })

  describe('when "request" exists in response body', () => {
    it('tracks a "submitTicket" user action', () => {
      const params = getParams('request')
      trackTicketSubmitted(params)

      expect(beacon.trackUserAction).toHaveBeenCalledWith('submitTicket', 'send', {
        label: 'ticketSubmissionForm',
        value: {
          query: params.searchTerm,
          locale: params.searchLocale,
          ticketId: params.res.body.request.id,
          email: params.email,
          attachmentsCount: params.attachmentsCount,
          attachmentTypes: params.attachmentTypes,
          contextualSearch: params.contextualSearch
        }
      })
    })
  })

  describe('when "suspended_ticket" exists in response body', () => {
    it('tracks a "submitTicket" user action', () => {
      const params = getParams('suspended_ticket')
      trackTicketSubmitted(params)

      expect(beacon.trackUserAction).toHaveBeenCalledWith('submitTicket', 'send', {
        label: 'ticketSubmissionForm',
        value: {
          query: params.searchTerm,
          locale: params.searchLocale,
          ticketId: params.res.body.suspended_ticket.id,
          email: params.email,
          attachmentsCount: params.attachmentsCount,
          attachmentTypes: params.attachmentTypes,
          contextualSearch: params.contextualSearch
        }
      })
    })
  })
})
