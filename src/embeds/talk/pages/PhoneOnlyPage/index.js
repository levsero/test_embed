import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { isMobileBrowser } from 'utility/devices'
import { i18n } from 'service/i18n'
import classNames from 'classnames'
import { Icon } from 'component/Icon'
import { ICONS } from 'constants/shared'
import AverageWaitTime from 'component/talk/AverageWaitTime'
import { getAverageWaitTimeString } from 'src/redux/modules/talk/talk-selectors'
import { getPhoneNumber, getFormattedPhoneNumber } from 'src/embeds/talk/selectors'
import PhoneNumber from 'src/embeds/talk/components/PhoneNumber'
import { locals as styles } from './styles.scss'

const PhoneOnlyPage = ({
  isMobile,
  callUsMessage,
  averageWaitTime,
  phoneNumber,
  formattedPhoneNumber
}) => {
  return (
    <div
      data-testid="talk--phoneOnlyPage"
      className={classNames(styles.container, { [styles.containerMobile]: isMobile })}
    >
      <Icon type={ICONS.TALK} className={styles.icon} isMobile={isMobile} />
      <p className={styles.message}>{callUsMessage}</p>
      {averageWaitTime && <AverageWaitTime message={averageWaitTime} />}
      <div className={styles.phoneNumber}>
        <PhoneNumber phoneNumber={phoneNumber} formattedPhoneNumber={formattedPhoneNumber} />
      </div>
    </div>
  )
}

PhoneOnlyPage.propTypes = {
  averageWaitTime: PropTypes.string,
  isMobile: PropTypes.bool.isRequired,
  formattedPhoneNumber: PropTypes.string.isRequired,
  phoneNumber: PropTypes.string.isRequired,
  callUsMessage: PropTypes.string.isRequired
}

const mapStateToProps = state => {
  return {
    isMobile: isMobileBrowser(),
    callUsMessage: i18n.t('embeddable_framework.talk.phoneOnly.new_message'),
    averageWaitTime: getAverageWaitTimeString(state),
    phoneNumber: getPhoneNumber(state),
    formattedPhoneNumber: getFormattedPhoneNumber(state)
  }
}

const connectedComponent = connect(mapStateToProps)(PhoneOnlyPage)

export { connectedComponent as default, PhoneOnlyPage as Component }
