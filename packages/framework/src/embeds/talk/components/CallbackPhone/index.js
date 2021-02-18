import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { i18n } from 'src/apps/webWidget/services/i18n'
import PhoneNumber from 'src/embeds/talk/components/PhoneNumber'
import { getPhoneNumber } from 'src/embeds/talk/selectors'

import { DisplayLabel } from './styles'
import getFormattedPhoneNumber from 'embeds/talk/utils/getFormattedPhoneNumber'

const CallbackPhone = ({ phoneNumber, formattedPhoneNumber, phoneLabel }) => {
  if (phoneNumber && formattedPhoneNumber) {
    return (
      <DisplayLabel>
        {`${phoneLabel} `}
        <PhoneNumber phoneNumber={phoneNumber} formattedPhoneNumber={formattedPhoneNumber} />
      </DisplayLabel>
    )
  }

  return null
}

CallbackPhone.propTypes = {
  phoneNumber: PropTypes.string.isRequired,
  formattedPhoneNumber: PropTypes.string.isRequired,
  phoneLabel: PropTypes.string.isRequired,
}

const mapStateToProps = (state) => ({
  phoneNumber: getPhoneNumber(state),
  formattedPhoneNumber: getFormattedPhoneNumber(getPhoneNumber(state)),
  phoneLabel: i18n.t('embeddable_framework.talk.form.phoneDisplay'),
})

const connectedComponent = connect(mapStateToProps)(CallbackPhone)

export { connectedComponent as default, CallbackPhone as Component }
