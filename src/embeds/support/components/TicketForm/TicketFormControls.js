import useWidgetFormApis from 'embeds/support/hooks/useWidgetFormApis'

const TicketFormControls = ({ formId, fields }) => {
  useWidgetFormApis(formId, fields)

  return null
}

export default TicketFormControls
