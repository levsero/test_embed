import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { focusLauncher } from 'utility/globals'
import { i18n } from 'service/i18n'
import { Widget, Main, Footer } from 'src/components/Widget'
import WidgetHeader from 'src/components/WidgetHeader'
import ZendeskLogo from 'src/components/ZendeskLogo'
import SuccessNotification from 'src/embeds/talk/components/SuccessNotification'
import { successDoneButtonClicked } from 'src/redux/modules/talk'
import { getTitle } from 'src/embeds/talk/selectors'
import { getHideZendeskLogo } from 'src/redux/modules/selectors'
import { Button, FooterView } from './styles'

const SuccessNotificationPage = ({ title, doneText, onDone, history, hideZendeskLogo }) => {
  return (
    <Widget>
      <WidgetHeader>{title}</WidgetHeader>
      <Main>
        <SuccessNotification />
      </Main>
      <Footer>
        <FooterView>
          <Button
            primary={true}
            onClick={() => {
              onDone()
              focusLauncher()
              history.replace('/')
            }}
          >
            {doneText}
          </Button>
          {!hideZendeskLogo && <ZendeskLogo />}
        </FooterView>
      </Footer>
    </Widget>
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
