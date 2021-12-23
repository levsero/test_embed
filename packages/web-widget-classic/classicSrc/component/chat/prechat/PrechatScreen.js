import { LoadingSpinner } from 'classicSrc/component/loading/LoadingSpinner'
import { Widget, Header, Main, Footer } from 'classicSrc/components/Widget'
import { submitPrechatForm } from 'classicSrc/embeds/chat/actions/prechat-form'
import PrechatForm from 'classicSrc/embeds/chat/components/PrechatForm'
import PrechatFormOfflineMessageSuccessPage from 'classicSrc/embeds/chat/pages/PrechatFormOfflineMessageSuccessPage'
import {
  getDepartments,
  getChatScreen,
  getPreChatFormState,
  getOfflineMessage,
  getChatVisitor,
} from 'classicSrc/embeds/chat/selectors'
import {
  updateChatScreen,
  handlePreChatFormChange,
  initiateSocialLogout,
  openedChatHistory,
} from 'classicSrc/redux/modules/chat'
import * as screens from 'classicSrc/redux/modules/chat/chat-screen-types'
import { getChatTitle } from 'classicSrc/redux/modules/selectors'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { connect } from 'react-redux'
import { locals as styles } from './PrechatScreen.scss'

const mapStateToProps = (state) => {
  const preChatFormState = getPreChatFormState(state)
  const selectedDepartment = preChatFormState.department
    ? getDepartments(state)[preChatFormState.department]
    : undefined

  return {
    selectedDepartment,
    screen: getChatScreen(state),
    offlineMessage: getOfflineMessage(state),
    chatVisitor: getChatVisitor(state),
    title: getChatTitle(state),
  }
}

class PrechatScreen extends Component {
  static propTypes = {
    screen: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    selectedDepartment: PropTypes.shape({
      id: PropTypes.number,
      status: PropTypes.string,
    }),
    isPreview: PropTypes.bool,
  }

  static defaultProps = {
    hideZendeskLogo: false,
    sendOfflineMessage: () => {},
    preChatFormSettings: {},
    loginSettings: {},
    settingsDepartmentsEnabled: [],
  }

  renderLoadingSpinner() {
    return (
      <Widget>
        <Header title={this.props.title} />
        <Main>
          <LoadingSpinner className={styles.loadingSpinner} />
        </Main>
        <Footer />
      </Widget>
    )
  }

  render = () => {
    switch (this.props.screen) {
      case screens.PRECHAT_SCREEN:
        return <PrechatForm isPreview={this.props.isPreview} />
      case screens.LOADING_SCREEN:
        return this.renderLoadingSpinner()
      case screens.OFFLINE_MESSAGE_SUCCESS_SCREEN:
        return <PrechatFormOfflineMessageSuccessPage />
    }

    return null
  }
}

const actionCreators = {
  updateChatScreen,
  handlePreChatFormChange,
  initiateSocialLogout,
  openedChatHistory,
  submitPrechatForm,
}

const connectedComponent = connect(mapStateToProps, actionCreators, null, { forwardRef: true })(
  PrechatScreen
)

export { connectedComponent as default, PrechatScreen as Component }
