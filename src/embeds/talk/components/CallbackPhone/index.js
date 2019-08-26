import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { i18n } from 'src/service/i18n'
import PhoneNumber from 'src/embeds/talk/components/PhoneNumber'
import { getPhoneNumber, getFormattedPhoneNumber } from 'src/embeds/talk/selectors'
import { getCapability } from 'src/redux/modules/talk/talk-selectors'
import { CALLBACK_AND_PHONE } from 'src/redux/modules/talk/talk-capability-types'

import { locals as styles } from './styles.scss'

const CallbackPhone = ({ capability, phoneNumber, formattedPhoneNumber, phoneLabel }) => {
  if (capability !== CALLBACK_AND_PHONE) {
    return null
  }
  return (
    <div className={styles.phoneDisplayLabel}>
      {`${phoneLabel} `}
      <PhoneNumber phoneNumber={phoneNumber} formattedPhoneNumber={formattedPhoneNumber} />
    </div>
  )
}

CallbackPhone.propTypes = {
  phoneNumber: PropTypes.string.isRequired,
  formattedPhoneNumber: PropTypes.string.isRequired,
  phoneLabel: PropTypes.string.isRequired,
  capability: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  phoneNumber: getPhoneNumber(state),
  formattedPhoneNumber: getFormattedPhoneNumber(state),
  phoneLabel: i18n.t('embeddable_framework.talk.form.phoneDisplay'),
  capability: getCapability(state)
})

const connectedComponent = connect(mapStateToProps)(CallbackPhone)

export { connectedComponent as default, CallbackPhone as Component }
