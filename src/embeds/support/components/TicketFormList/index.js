import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { TEST_IDS } from 'src/constants/shared'
import TicketFormOption from 'src/embeds/support/components/TicketFormOption'

const TicketFormList = ({ ticketForms, handleFormOptionClick = () => {} }) => {
  if (ticketForms.length <= 0) return null

  return (
    <ul data-testid={TEST_IDS.TICKET_FORM_LIST}>
      {ticketForms.map(form => (
        <Link key={form.id} to={`/support/ticketForm/${form.id}`}>
          <TicketFormOption key={form.id} form={form} onClick={handleFormOptionClick} />
        </Link>
      ))}
    </ul>
  )
}

TicketFormList.propTypes = {
  ticketForms: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired
    })
  ).isRequired,
  handleFormOptionClick: PropTypes.func
}

export default TicketFormList
