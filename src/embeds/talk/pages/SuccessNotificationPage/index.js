import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { focusLauncher } from 'utility/globals'
import { i18n } from 'service/i18n'
import { Button } from '@zendeskgarden/react-buttons'
import WidgetContainer from 'src/components/WidgetContainer'
import WidgetHeader from 'src/components/WidgetHeader'
import WidgetMain from 'src/components/WidgetMain'
import WidgetFooter from 'src/components/WidgetFooter'
import ZendeskLogo from 'src/components/ZendeskLogo'
import SuccessNotificationMessage from 'src/embeds/talk/components/SuccessNotificationMessage'
import { successDoneButtonClicked } from 'src/redux/modules/talk'
import { getTitle } from 'src/embeds/talk/selectors'
import { getHideZendeskLogo } from 'src/redux/modules/selectors'

import { locals as styles } from './styles.scss'

const SuccessNotificationPage = ({ title, doneText, onDone, history, hideZendeskLogo }) => {
  return (
    <WidgetContainer>
      <WidgetHeader>{title}</WidgetHeader>
      <WidgetMain>
        <SuccessNotificationMessage />
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
          {hideZendeskLogo ? null : <ZendeskLogo />}
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
  }),
  hideZendeskLogo: PropTypes.bool.isRequired
}
const mapStateToProps = state => ({
  title: getTitle(state, 'embeddable_framework.talk.notify.success.title'),
  doneText: i18n.t('embeddable_framework.common.button.done'),
  hideZendeskLogo: getHideZendeskLogo(state)
})

const actionCreators = {
  onDone: successDoneButtonClicked
}

export default connect(
  mapStateToProps,
  actionCreators
)(SuccessNotificationPage)
