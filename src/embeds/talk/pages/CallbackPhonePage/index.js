import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { i18n } from 'src/service/i18n'
import CallbackForm from 'src/embeds/talk/components/CallbackForm'
import PhoneNumber from 'src/embeds/talk/components/PhoneNumber'
import { locals as styles } from './styles.scss'
import { getPhoneNumber, getFormattedPhoneNumber } from 'src/embeds/talk/selectors'

const CallbackPhonePage = ({ phoneNumber, formattedPhoneNumber, phoneLabel }) => (
  <div>
    <div className={styles.phoneDisplayLabel}>
      {`${phoneLabel} `}
      <PhoneNumber phoneNumber={phoneNumber} formattedPhoneNumber={formattedPhoneNumber} />
    </div>
    <CallbackForm />
  </div>
)

CallbackPhonePage.propTypes = {
  phoneNumber: PropTypes.string.isRequired,
  formattedPhoneNumber: PropTypes.string.isRequired,
  phoneLabel: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  phoneNumber: getPhoneNumber(state),
  formattedPhoneNumber: getFormattedPhoneNumber(state),
  phoneLabel: i18n.t('embeddable_framework.talk.form.phoneDisplay')
})

const connectedComponent = connect(mapStateToProps)(CallbackPhonePage)

export { connectedComponent as default, CallbackPhonePage as Component }
