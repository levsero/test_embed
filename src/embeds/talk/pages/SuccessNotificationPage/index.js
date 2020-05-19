import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { focusLauncher } from 'utility/globals'
import { i18n } from 'service/i18n'
import { Widget, Header, Main, Footer } from 'src/components/Widget'
import SuccessNotification from 'components/SuccessNotification'
import { successDoneButtonClicked } from 'src/redux/modules/talk'
import { getTitle } from 'src/embeds/talk/selectors'
import TalkSuccessIcon from 'src/embeds/talk/icons/talk_success.svg'

const SuccessNotificationPage = ({ title, doneText, onClick, history }) => {
  return (
    <Widget>
      <Header title={title} showBackButton={false} />
      <Main>
        <SuccessNotification
          doneText={doneText}
          icon={<TalkSuccessIcon />}
          onClick={() => {
            onClick()
            focusLauncher()
            history.replace('/')
          }}
        />
      </Main>
      <Footer />
    </Widget>
  )
}

SuccessNotificationPage.propTypes = {
  title: PropTypes.string.isRequired,
  doneText: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  history: PropTypes.shape({
    replace: PropTypes.func
  })
}

const mapStateToProps = state => ({
  title: getTitle(state, 'embeddable_framework.talk.notify.success.title'),
  doneText: i18n.t('embeddable_framework.common.button.goBack')
})

const actionCreators = {
  onClick: successDoneButtonClicked
}

export default connect(
  mapStateToProps,
  actionCreators
)(SuccessNotificationPage)
