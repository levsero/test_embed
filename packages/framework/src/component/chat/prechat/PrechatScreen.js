import PropTypes from 'prop-types'
import { Component } from 'react'
import { connect } from 'react-redux'
import { LoadingSpinner } from 'component/loading/LoadingSpinner'
import { submitPrechatForm } from 'embeds/chat/actions/prechat-form'
import { Widget, Header, Main, Footer } from 'src/components/Widget'
import PrechatForm from 'src/embeds/chat/components/PrechatForm'
import PrechatFormOfflineMessageSuccessPage from 'src/embeds/chat/pages/PrechatFormOfflineMessageSuccessPage'
import {
  updateChatScreen,
  handlePreChatFormChange,
  initiateSocialLogout,
  openedChatHistory,
} from 'src/redux/modules/chat'
import * as screens from 'src/redux/modules/chat/chat-screen-types'
import {
  getDepartments,
  getChatScreen,
  getPreChatFormState,
  getOfflineMessage,
  getChatVisitor,
} from 'src/redux/modules/chat/chat-selectors'
import { getChatTitle } from 'src/redux/modules/selectors'
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
