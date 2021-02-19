import PropTypes from 'prop-types'
import { PhoneLink } from './styles'
import { TEST_IDS } from 'src/constants/shared'

const PhoneNumber = ({ phoneNumber, formattedPhoneNumber }) => (
  <PhoneLink href={`tel:${phoneNumber}`} target="_blank" data-testid={TEST_IDS.TALK_PHONE_NUMBER}>
    {formattedPhoneNumber}
  </PhoneLink>
)

PhoneNumber.propTypes = {
  phoneNumber: PropTypes.string.isRequired,
  formattedPhoneNumber: PropTypes.string.isRequired,
}

export default PhoneNumber
