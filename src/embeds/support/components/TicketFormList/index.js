import React from 'react'
import PropTypes from 'prop-types'

import TicketFormOption from 'src/embeds/support/components/TicketFormOption'

const TicketFormList = ({ ticketForms, handleFormOptionClick }) => {
  if (ticketForms.length <= 0) return null

  return (
    <ul>
      {ticketForms.map(form => (
        <TicketFormOption key={form.id} form={form} onClick={handleFormOptionClick} />
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
  handleFormOptionClick: PropTypes.func.isRequired
}

export default TicketFormList
