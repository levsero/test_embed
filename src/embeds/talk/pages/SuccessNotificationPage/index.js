import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { SuccessNotification } from 'component/shared/SuccessNotification'
import { ICONS } from 'constants/shared'
import { isMobileBrowser } from 'utility/devices'
import { i18n } from 'service/i18n'
import { Button } from '@zendeskgarden/react-buttons'
import { locals as styles } from './styles.scss'
import { getTalkTitle } from 'src/redux/modules/selectors'
import WidgetContainer from 'src/components/WidgetContainer'
import WidgetHeader from 'src/components/WidgetHeader'
import WidgetMain from 'src/components/WidgetMain'
import WidgetFooter from 'src/components/WidgetFooter'
import ZendeskLogo from 'src/components/ZendeskLogo'

const SuccessNotificationPage = ({ title, doneText, onBackClick }) => {
  const isMobile = isMobileBrowser()

  return (
    <WidgetContainer>
      <WidgetHeader>{title}</WidgetHeader>
      <WidgetMain>
        <SuccessNotification icon={ICONS.SUCCESS_TALK} isMobile={isMobile} />
      </WidgetMain>
      <WidgetFooter>
        <div className={styles.footer}>
          <Button primary={true} className={styles.button} onClick={onBackClick}>
            {doneText}
          </Button>
          <ZendeskLogo />
        </div>
      </WidgetFooter>
    </WidgetContainer>
  )
}

SuccessNotificationPage.propTypes = {
  title: PropTypes.string.isRequired,
  doneText: PropTypes.string.isRequired,
  onBackClick: PropTypes.func.isRequired
}
const mapStateToProps = state => ({
  title: getTalkTitle(state),
  doneText: i18n.t('embeddable_framework.common.button.done')
})

export default connect(mapStateToProps)(SuccessNotificationPage)
