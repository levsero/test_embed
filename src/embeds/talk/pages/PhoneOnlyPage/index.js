import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'

import { isMobileBrowser } from 'utility/devices'
import { i18n } from 'service/i18n'
import AverageWaitTime from 'src/embeds/talk/components/AverageWaitTime'
import PhoneNumber from 'src/embeds/talk/components/PhoneNumber'
import WidgetHeader from 'src/components/WidgetHeader'
import WidgetContainer from 'src/components/WidgetContainer'
import WidgetMain from 'src/components/WidgetMain'
import WidgetFooter from 'src/components/WidgetFooter'
import ZendeskLogo from 'src/components/ZendeskLogo'
import {
  getAverageWaitTimeString,
  getEmbeddableConfig
} from 'src/redux/modules/talk/talk-selectors'
import { getFormattedPhoneNumber, getTitle } from 'src/embeds/talk/selectors'
import { getHideZendeskLogo } from 'src/redux/modules/selectors'

import { locals as styles } from './styles.scss'
import TalkIcon from 'src/embeds/talk/icons/talk.svg'

const PhoneOnlyPage = ({
  callUsMessage,
  isMobile,
  averageWaitTime,
  phoneNumber,
  formattedPhoneNumber,
  title,
  hideZendeskLogo
}) => {
  return (
    <WidgetContainer>
      <WidgetHeader>{title}</WidgetHeader>
      <WidgetMain>
        <div
          data-testid="talk--phoneOnlyPage"
          className={classNames(styles.container, { [styles.containerMobile]: isMobile })}
        >
          <TalkIcon className={styles.talkIcon} />
          <p className={styles.message}>{callUsMessage}</p>
          {averageWaitTime && <AverageWaitTime message={averageWaitTime} />}
          <div className={styles.phoneNumber}>
            <PhoneNumber phoneNumber={phoneNumber} formattedPhoneNumber={formattedPhoneNumber} />
          </div>
        </div>
      </WidgetMain>
      <WidgetFooter>{hideZendeskLogo ? null : <ZendeskLogo />}</WidgetFooter>
    </WidgetContainer>
  )
}

PhoneOnlyPage.propTypes = {
  averageWaitTime: PropTypes.string,
  isMobile: PropTypes.bool.isRequired,
  formattedPhoneNumber: PropTypes.string.isRequired,
  phoneNumber: PropTypes.string.isRequired,
  callUsMessage: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  hideZendeskLogo: PropTypes.bool.isRequired
}

const mapStateToProps = state => {
  return {
    isMobile: isMobileBrowser(),
    callUsMessage: i18n.t('embeddable_framework.talk.phoneOnly.new_message'),
    averageWaitTime: getAverageWaitTimeString(state),
    phoneNumber: getEmbeddableConfig(state).phoneNumber,
    formattedPhoneNumber: getFormattedPhoneNumber(state),
    title: getTitle(state, 'embeddable_framework.talk.phoneOnly.title'),
    hideZendeskLogo: getHideZendeskLogo(state)
  }
}

const connectedComponent = connect(mapStateToProps)(PhoneOnlyPage)

export { connectedComponent as default, PhoneOnlyPage as Component }
