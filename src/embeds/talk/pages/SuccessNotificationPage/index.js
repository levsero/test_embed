import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { SuccessNotification } from 'component/shared/SuccessNotification'
import { ICONS } from 'constants/shared'
import { isMobileBrowser } from 'utility/devices'
import { i18n } from 'service/i18n'
import { Button } from '@zendeskgarden/react-buttons'
import { locals as styles } from './styles.scss'
import WidgetContainer from 'src/components/WidgetContainer'
import WidgetHeader from 'src/components/WidgetHeader'
import WidgetMain from 'src/components/WidgetMain'
import WidgetFooter from 'src/components/WidgetFooter'
import ZendeskLogo from 'src/components/ZendeskLogo'
import { successDoneButtonClicked } from 'src/redux/modules/talk'
import { focusLauncher } from 'utility/globals'
import { getTitle } from 'src/embeds/talk/selectors'

const SuccessNotificationPage = ({ title, doneText, onDone, history }) => {
  const isMobile = isMobileBrowser()

  return (
    <WidgetContainer>
      <WidgetHeader>{title}</WidgetHeader>
      <WidgetMain>
        <SuccessNotification icon={ICONS.SUCCESS_TALK} isMobile={isMobile} />
      </WidgetMain>
      <WidgetFooter>
        <div className={styles.footer}>
          <Button
            primary={true}
            className={styles.button}
            onClick={() => {
              onDone()
              focusLauncher()
              history.replace('/')
            }}
          >
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
  onDone: PropTypes.func.isRequired,
  history: PropTypes.shape({
    replace: PropTypes.func
  })
}
const mapStateToProps = state => ({
  title: getTitle(state, 'embeddable_framework.talk.notify.success.title'),
  doneText: i18n.t('embeddable_framework.common.button.done')
})

const actionCreators = {
  onDone: successDoneButtonClicked
}

export default connect(
  mapStateToProps,
  actionCreators
)(SuccessNotificationPage)
