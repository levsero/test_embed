import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import PrechatFormOfflineMessageSuccessPage from 'src/embeds/chat/pages/PrechatFormOfflineMessageSuccessPage'
import { LoadingSpinner } from 'component/loading/LoadingSpinner'
import { Widget, Header, Main, Footer } from 'src/components/Widget'
import * as screens from 'src/redux/modules/chat/chat-screen-types'
import {
  updateChatScreen,
  handlePreChatFormChange,
  resetCurrentMessage,
  initiateSocialLogout,
  openedChatHistory,
} from 'src/redux/modules/chat'
import {
  getDepartments,
  getChatScreen,
  getPreChatFormState,
  getOfflineMessage,
  getChatVisitor,
} from 'src/redux/modules/chat/chat-selectors'
import { getChatTitle } from 'src/redux/modules/selectors'
import { getSettingsChatDepartmentsEmpty } from 'src/redux/modules/settings/settings-selectors'
import { locals as styles } from './PrechatScreen.scss'
import { submitPrechatForm } from 'embeds/chat/actions/prechat-form'
import PrechatForm from 'src/embeds/chat/components/PrechatForm'

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
    departmentFieldHidden: getSettingsChatDepartmentsEmpty(state),
  }
}

class PrechatScreen extends Component {
  static propTypes = {
    screen: PropTypes.string.isRequired,
    resetCurrentMessage: PropTypes.func,
    title: PropTypes.string.isRequired,
    departmentFieldHidden: PropTypes.bool.isRequired,
    selectedDepartment: PropTypes.shape({
      id: PropTypes.number,
      status: PropTypes.string,
    }),
    submitPrechatForm: PropTypes.func,
    isPreview: PropTypes.bool,
  }

  static defaultProps = {
    hideZendeskLogo: false,
    sendOfflineMessage: () => {},
    resetCurrentMessage: () => {},
    preChatFormSettings: {},
    loginSettings: {},
    departmentFieldHidden: false,
    settingsDepartmentsEnabled: [],
  }

  onPrechatFormComplete = (values) => {
    this.props.submitPrechatForm({
      values,
      isDepartmentFieldVisible: !this.props.departmentFieldHidden,
    })

    this.props.resetCurrentMessage()
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
  resetCurrentMessage,
  handlePreChatFormChange,
  initiateSocialLogout,
  openedChatHistory,
  submitPrechatForm,
}

const connectedComponent = connect(mapStateToProps, actionCreators, null, { forwardRef: true })(
  PrechatScreen
)

export { connectedComponent as default, PrechatScreen as Component }
