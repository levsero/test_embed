import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { isMobileBrowser } from 'utility/devices'
import { i18n } from 'service/i18n'
import classNames from 'classnames'
import { Icon } from 'component/Icon'
import { ICONS } from 'constants/shared'
import AverageWaitTime from 'src/embeds/talk/components/AverageWaitTime'
import PhoneNumber from 'src/embeds/talk/components/PhoneNumber'
import {
  getAverageWaitTimeString,
  getEmbeddableConfig
} from 'src/redux/modules/talk/talk-selectors'
import { locals as styles } from './styles.scss'
import WidgetHeader from 'src/components/WidgetHeader'
import WidgetContainer from 'src/components/WidgetContainer'
import WidgetMain from 'src/components/WidgetMain'
import WidgetFooter from 'src/components/WidgetFooter'
import ZendeskLogo from 'src/components/ZendeskLogo'
import { getFormattedPhoneNumber, getTitle } from 'src/embeds/talk/selectors'

const PhoneOnlyPage = ({
  isMobile,
  callUsMessage,
  averageWaitTime,
  phoneNumber,
  formattedPhoneNumber,
  title
}) => {
  return (
    <WidgetContainer>
      <WidgetHeader>{title}</WidgetHeader>
      <WidgetMain>
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
      </WidgetMain>
      <WidgetFooter>
        <ZendeskLogo />
      </WidgetFooter>
    </WidgetContainer>
  )
}

PhoneOnlyPage.propTypes = {
  averageWaitTime: PropTypes.string,
  isMobile: PropTypes.bool.isRequired,
  formattedPhoneNumber: PropTypes.string.isRequired,
  phoneNumber: PropTypes.string.isRequired,
  callUsMessage: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
}

const mapStateToProps = state => {
  return {
    isMobile: isMobileBrowser(),
    callUsMessage: i18n.t('embeddable_framework.talk.phoneOnly.new_message'),
    averageWaitTime: getAverageWaitTimeString(state),
    phoneNumber: getEmbeddableConfig(state).phoneNumber,
    formattedPhoneNumber: getFormattedPhoneNumber(state),
    title: getTitle(state, 'embeddable_framework.talk.phoneOnly.title')
  }
}

const connectedComponent = connect(mapStateToProps)(PhoneOnlyPage)

export { connectedComponent as default, PhoneOnlyPage as Component }
