import SuccessNotification from 'classicSrc/components/SuccessNotification'
import { Widget, Header, Main, Footer } from 'classicSrc/components/Widget'
import { successDoneButtonClicked } from 'classicSrc/embeds/talk/actions'
import useGetTitle from 'classicSrc/embeds/talk/hooks/useGetTitle'
import TalkSuccessIcon from 'classicSrc/embeds/talk/icons/talk_success.svg'
import useTranslate from 'classicSrc/hooks/useTranslate'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { focusLauncher } from '@zendesk/widget-shared-services'

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
