import React from 'react'
import PropTypes from 'prop-types'
import { PhoneLink } from './styles'

const PhoneNumber = ({ phoneNumber, formattedPhoneNumber }) => {
  return (
    <PhoneLink href={`tel:${phoneNumber}`} target="_blank">
      {formattedPhoneNumber}
    </PhoneLink>
  )
}

PhoneNumber.propTypes = {
  phoneNumber: PropTypes.string.isRequired,
  formattedPhoneNumber: PropTypes.string.isRequired
}

export default PhoneNumber
