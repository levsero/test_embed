import { getHasContextuallySearched, getSearchTerm } from 'classicSrc/embeds/helpCenter/selectors'
import { getAttachmentsForForm } from 'classicSrc/embeds/support/selectors'
import trackTicketSubmitted from 'classicSrc/embeds/support/utils/track-ticket-submitted'
import { getLocale } from 'classicSrc/redux/modules/base/base-selectors'
import { getAttachmentsEnabled, getHelpCenterAvailable } from 'classicSrc/redux/modules/selectors'
import hcStats from 'classicSrc/service/hcStats'
import { beacon } from '@zendesk/widget-shared-services/beacon'

jest.mock('classicSrc/embeds/helpCenter/selectors')
jest.mock('classicSrc/redux/modules/base/base-selectors')
jest.mock('classicSrc/redux/modules/selectors')
jest.mock('classicSrc/embeds/support/selectors')

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
      const trackUserAction = jest.spyOn(beacon, 'trackUserAction').mockImplementation(() => {})
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

      expect(trackUserAction).toHaveBeenCalledWith('submitTicket', 'send', {
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
      const trackUserAction = jest.spyOn(beacon, 'trackUserAction').mockImplementation(() => {})
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

      expect(trackUserAction).toHaveBeenCalledWith('submitTicket', 'send', {
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
