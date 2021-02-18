import trackTicketSubmitted from 'embeds/support/utils/track-ticket-submitted'
import { beacon } from 'service/beacon'
import { getHasContextuallySearched, getSearchTerm } from 'embeds/helpCenter/selectors'
import { getLocale } from 'src/redux/modules/base/base-selectors'
import { getAttachmentsEnabled, getHelpCenterAvailable } from 'src/redux/modules/selectors'
import { getAttachmentsForForm } from 'embeds/support/selectors'
import hcStats from 'service/hcStats'

jest.mock('embeds/helpCenter/selectors')
jest.mock('src/redux/modules/base/base-selectors')
jest.mock('src/redux/modules/selectors')
jest.mock('embeds/support/selectors')

jest.mock('service/beacon', () => ({
  beacon: {
    trackUserAction: jest.fn(),
  },
}))

beforeEach(() => {
  jest.spyOn(hcStats, 'ticketSubmitted')
})

describe('trackTicketSubmitted', () => {
  const getResponse = (responseParam = 'request') => ({
    // searchTerm: 'search term',
    // searchLocale: 'en-US',
    body: {
      [responseParam]: {
        id: 'response id',
        attachmentsCount: 5,
        attachmentTypes: 'attachment types',
        contextualSearch: true,
      },
    },
  })

  describe('hcStats', () => {
    beforeEach(() => {
      const attachments = [
        { id: 1, fileType: 'png' },
        { id: 2, fileType: 'jpg' },
        { id: 3, fileType: 'pdf' },
      ]

      getSearchTerm.mockReturnValueOnce('search term')
      getLocale.mockReturnValueOnce('locale')
      getAttachmentsForForm.mockReturnValueOnce(attachments)
      getHasContextuallySearched.mockReturnValueOnce(true)
      getAttachmentsEnabled.mockReturnValueOnce(true)
    })

    describe('help center is available', () => {
      it('tracks ticket submitted in hcStats', () => {
        const response = getResponse('request')
        const formValues = {
          attachments: {
            ids: [1, 2, 3],
          },
        }
        getHelpCenterAvailable.mockReturnValueOnce(true)

        trackTicketSubmitted(response, formValues, {})
        expect(hcStats.ticketSubmitted).toHaveBeenCalledWith('response id', 'search term')
      })
    })

    describe('help center is not available', () => {
      it('does not track ticket submitted in hcStats', () => {
        const response = getResponse('request')
        const formValues = {
          attachments: {
            ids: [1, 2, 3],
          },
        }
        getHelpCenterAvailable.mockReturnValueOnce(false)

        trackTicketSubmitted(response, formValues, {})
        expect(hcStats.ticketSubmitted).not.toHaveBeenCalled()
      })
    })
  })

  describe('when "request" exists in response body', () => {
    it('tracks a "submitTicket" user action', () => {
      const response = getResponse('request')
      const formValues = {
        attachments: {
          ids: [1, 2, 3],
        },
      }
      const attachments = [
        { id: 1, fileType: 'png' },
        { id: 2, fileType: 'jpg' },
        { id: 3, fileType: 'pdf' },
      ]

      getSearchTerm.mockReturnValueOnce('search term')
      getLocale.mockReturnValueOnce('locale')
      getAttachmentsForForm.mockReturnValueOnce(attachments)
      getHasContextuallySearched.mockReturnValueOnce(true)
      getAttachmentsEnabled.mockReturnValueOnce(true)

      trackTicketSubmitted(response, formValues, {})

      expect(beacon.trackUserAction).toHaveBeenCalledWith('submitTicket', 'send', {
        label: 'ticketSubmissionForm',
        value: {
          query: 'search term',
          locale: 'locale',
          ticketId: response.body.request.id,
          attachmentsCount: 3,
          attachmentTypes: ['png', 'jpg', 'pdf'],
          contextualSearch: true,
        },
      })
    })
  })

  describe('when "suspended_ticket" exists in response body', () => {
    it('tracks a "submitTicket" user action', () => {
      const response = getResponse('suspended_ticket')
      const formValues = {
        attachments: {
          ids: [1, 2, 3],
        },
      }
      const attachments = [
        { id: 1, fileType: 'png' },
        { id: 2, fileType: 'jpg' },
        { id: 3, fileType: 'pdf' },
      ]

      getSearchTerm.mockReturnValueOnce('search term')
      getLocale.mockReturnValueOnce('locale')
      getAttachmentsForForm.mockReturnValueOnce(attachments)
      getHasContextuallySearched.mockReturnValueOnce(true)
      getAttachmentsEnabled.mockReturnValueOnce(true)

      trackTicketSubmitted(response, formValues, {})

      expect(beacon.trackUserAction).toHaveBeenCalledWith('submitTicket', 'send', {
        label: 'ticketSubmissionForm',
        value: {
          query: 'search term',
          locale: 'locale',
          ticketId: response.body.suspended_ticket.id,
          attachmentsCount: 3,
          attachmentTypes: ['png', 'jpg', 'pdf'],
          contextualSearch: true,
        },
      })
    })
  })
})
