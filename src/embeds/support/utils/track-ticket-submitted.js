import { beacon } from 'service/beacon'

const trackTicketSubmitted = params => {
  const response = params.res.body.request || params.res.body.suspended_ticket

  const userActionPayload = {
    query: params.searchTerm,
    locale: params.searchLocale,
    ticketId: response.id,
    attachmentsCount: params.attachmentsCount,
    attachmentTypes: params.attachmentTypes,
    contextualSearch: params.contextualSearch
  }

  beacon.trackUserAction('submitTicket', 'send', {
    label: 'ticketSubmissionForm',
    value: userActionPayload
  })
}

export default trackTicketSubmitted
