import useWidgetFormApis from 'classicSrc/embeds/support/hooks/useWidgetFormApis'

const TicketFormControls = ({ formId, fields }) => {
  useWidgetFormApis(formId, fields)

  return null
}

export default TicketFormControls
