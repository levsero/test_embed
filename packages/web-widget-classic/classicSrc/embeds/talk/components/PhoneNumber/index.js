import { TEST_IDS } from 'classicSrc/constants/shared'
import PropTypes from 'prop-types'
import { PhoneLink } from './styles'

const PhoneNumber = ({ phoneNumber, formattedPhoneNumber }) => (
  <PhoneLink
    href={`tel:${phoneNumber}`}
    target="_blank"
    data-testid={TEST_IDS.TALK_PHONE_NUMBER}
    dir="ltr"
  >
    {formattedPhoneNumber}
  </PhoneLink>
)

PhoneNumber.propTypes = {
  phoneNumber: PropTypes.string.isRequired,
  formattedPhoneNumber: PropTypes.string.isRequired,
}

export default PhoneNumber
