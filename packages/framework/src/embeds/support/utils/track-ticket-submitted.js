import _ from 'lodash'
import { beacon } from '@zendesk/widget-shared-services/beacon'
import { getHasContextuallySearched, getSearchTerm } from 'src/embeds/helpCenter/selectors'
import { getAttachmentsForForm } from 'src/embeds/support/selectors'
import { getLocale } from 'src/redux/modules/base/base-selectors'
import { getAttachmentsEnabled, getHelpCenterAvailable } from 'src/redux/modules/selectors'
import hcStats from 'src/service/hcStats'

const trackTicketSubmitted = (apiResponse, formValues, state) => {
  const searchTerm = getSearchTerm(state)
  const locale = getLocale(state)
  const hasContextuallySearched = getHasContextuallySearched(state)
  const attachmentsEnabled = getAttachmentsEnabled(state)
  const attachments = getAttachmentsForForm(state, formValues?.attachments?.ids || [])
  const helpCenterAvailable = getHelpCenterAvailable(state)

  const params = {
    res: apiResponse,
    email: formValues?.email,
    searchTerm: searchTerm,
    searchLocale: locale,
    contextualSearch: hasContextuallySearched,
  }

  if (attachmentsEnabled) {
    _.extend(params, {
      attachmentsCount: attachments.length,
      attachmentTypes: attachments.map((attachment) => attachment.fileType),
    })
  }

  const response = params.res.body.request || params.res.body.suspended_ticket

  const userActionPayload = {
    query: params.searchTerm,
    locale: params.searchLocale,
    ticketId: response.id,
    attachmentsCount: params.attachmentsCount,
    attachmentTypes: params.attachmentTypes,
    contextualSearch: params.contextualSearch,
  }

  beacon.trackUserAction('submitTicket', 'send', {
    label: 'ticketSubmissionForm',
    value: userActionPayload,
  })

  if (helpCenterAvailable) {
    hcStats.ticketSubmitted(response.id, params.searchTerm)
  }
}

export default trackTicketSubmitted
