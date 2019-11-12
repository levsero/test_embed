import React from 'react'
import PropTypes from 'prop-types'

import { Button } from '@zendeskgarden/react-buttons'
import { ListItem } from './styles'

const TicketFormOption = ({ form, onClick }) => (
  <ListItem>
    <Button link={true} onClick={() => onClick(form.id)}>
      {form.display_name}
    </Button>
  </ListItem>
)

TicketFormOption.propTypes = {
  form: PropTypes.shape({
    id: PropTypes.number.isRequired,
    display_name: PropTypes.string.isRequired
  }).isRequired,
  onClick: PropTypes.func.isRequired
}

export default TicketFormOption
