import { TEST_IDS } from 'classicSrc/constants/shared'
import TicketFormOption from 'classicSrc/embeds/support/components/TicketFormOption'
import PropTypes from 'prop-types'

const TicketFormList = ({ ticketForms, handleFormOptionClick }) => {
  if (ticketForms.length <= 0) return null

  return (
    <ul data-testid={TEST_IDS.TICKET_FORM_LIST}>
      {ticketForms.map((form) => (
        <TicketFormOption key={form.id} form={form} onClick={handleFormOptionClick} />
      ))}
    </ul>
  )
}

TicketFormList.propTypes = {
  ticketForms: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
    })
  ).isRequired,
  handleFormOptionClick: PropTypes.func.isRequired,
}

export default TicketFormList
