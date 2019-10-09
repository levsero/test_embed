import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { focusLauncher } from 'utility/globals'
import { i18n } from 'service/i18n'
import { Button } from '@zendeskgarden/react-buttons'
import { Widget, Header, Main, Footer } from 'src/components/Widget'
import SuccessNotification from 'src/embeds/talk/components/SuccessNotification'
import { successDoneButtonClicked } from 'src/redux/modules/talk'
import { getTitle } from 'src/embeds/talk/selectors'

const SuccessNotificationPage = ({ title, doneText, onDone, history }) => {
  return (
    <Widget>
      <Header title={title} />
      <Main>
        <SuccessNotification />
      </Main>
      <Footer>
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
