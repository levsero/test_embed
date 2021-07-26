import PropTypes from 'prop-types'
import { Button } from './styles'

const TicketFormOption = ({ form, onClick }) => (
  <li>
    <Button onClick={() => onClick(form.id)}>{form.display_name}</Button>
  </li>
)

TicketFormOption.propTypes = {
  form: PropTypes.shape({
    id: PropTypes.number.isRequired,
    display_name: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
}

export default TicketFormOption
