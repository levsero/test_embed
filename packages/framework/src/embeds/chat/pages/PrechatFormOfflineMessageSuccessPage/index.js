import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import SuccessIcon from 'src/asset/icons/widget-icon_success_contactForm.svg'
import SuccessNotification from 'src/components/SuccessNotification'
import { Widget, Header, Main } from 'src/components/Widget'
import ChatFooter from 'src/embeds/chat/components/Footer'
import useTranslate from 'src/hooks/useTranslate'
import { updateChatScreen } from 'src/redux/modules/chat'
import * as screens from 'src/redux/modules/chat/chat-screen-types'
import { getChatTitle } from 'src/redux/modules/selectors'

// This page is only rendered if the end user selects an offline department in the prechat form
// If the user selects an online department a new chat session will be initiated

const PrechatFormOfflineMessageSuccessPage = ({ title, updateChatScreen }) => {
  const translate = useTranslate()

  return (
    <Widget>
      <Header title={title} />
      <Main>
        <SuccessNotification
          icon={<SuccessIcon />}
          doneText={translate('embeddable_framework.common.button.goBack')}
          onClick={() => updateChatScreen(screens.PRECHAT_SCREEN)}
        />
      </Main>
      <ChatFooter hideButton={true} scrollShadowVisible={false} />
    </Widget>
  )
}

PrechatFormOfflineMessageSuccessPage.propTypes = {
  title: PropTypes.string,
  updateChatScreen: PropTypes.func,
}

const actionCreators = {
  updateChatScreen,
}

const mapStateToProps = (state) => ({
  title: getChatTitle(state),
})

const connectedComponent = connect(
  mapStateToProps,
  actionCreators
)(PrechatFormOfflineMessageSuccessPage)

export { connectedComponent as default, PrechatFormOfflineMessageSuccessPage as Component }
