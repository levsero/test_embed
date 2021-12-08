import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { focusLauncher } from '@zendesk/widget-shared-services'
import SuccessNotification from 'src/components/SuccessNotification'
import { Widget, Header, Main, Footer } from 'src/components/Widget'
import { successDoneButtonClicked } from 'src/embeds/talk/actions'
import useGetTitle from 'src/embeds/talk/hooks/useGetTitle'
import TalkSuccessIcon from 'src/embeds/talk/icons/talk_success.svg'
import useTranslate from 'src/hooks/useTranslate'

const SuccessNotificationPage = ({ onClick, history }) => {
  const translate = useTranslate()
  const getTitle = useGetTitle()

  return (
    <Widget>
      <Header
        title={getTitle('embeddable_framework.talk.notify.success.title')}
        showBackButton={false}
      />
      <Main>
        <SuccessNotification
          doneText={translate('embeddable_framework.common.button.goBack')}
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
  onClick: PropTypes.func.isRequired,
  history: PropTypes.shape({
    replace: PropTypes.func,
  }),
}

const actionCreators = {
  onClick: successDoneButtonClicked,
}

export default connect(null, actionCreators)(SuccessNotificationPage)
