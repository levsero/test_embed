import { lazy, Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { PrechatForm } from 'component/chat/prechat/PrechatForm'
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
  getLoginSettings,
  getOfflineMessage,
  getAuthUrls,
  getSocialLogin,
  getChatVisitor,
  getIsAuthenticated,
  getReadOnlyState,
} from 'src/redux/modules/chat/chat-selectors'
import {
  getChatTitle,
  getPrechatFormSettings,
  getPrechatFormFields,
  getChatHistoryLabel,
  getDefaultSelectedDepartment,
} from 'src/redux/modules/selectors'
import {
  getSettingsChatDepartmentsEmpty,
  getSettingsChatDepartmentsEnabled,
} from 'src/redux/modules/settings/settings-selectors'
import { locals as styles } from './PrechatScreen.scss'
import { getHasChatHistory } from 'src/redux/modules/chat/chat-history-selectors'
import isFeatureEnabled from 'embeds/webWidget/selectors/feature-flags'
import SuspensePage from 'components/Widget/SuspensePage'
import { submitPrechatForm } from 'embeds/chat/actions/prechat-form'

const NewPrechatForm = lazy(() =>
  import(/* webpackChunkName: 'lazy/prechat-form' */ 'embeds/chat/components/PrechatForm')
)

const mapStateToProps = (state) => {
  const prechatForm = getPrechatFormSettings(state)
  const prechatFormFields = getPrechatFormFields(state)
  const preChatFormState = getPreChatFormState(state)
  const selectedDepartment = preChatFormState.department
    ? getDepartments(state)[preChatFormState.department]
    : undefined

  return {
    selectedDepartment,
    prechatFormSettings: { ...prechatForm, form: prechatFormFields },
    settingsDepartmentsEnabled: getSettingsChatDepartmentsEnabled(state),
    screen: getChatScreen(state),
    loginSettings: getLoginSettings(state),
    offlineMessage: getOfflineMessage(state),
    authUrls: getAuthUrls(state),
    visitor: getChatVisitor(state),
    socialLogin: getSocialLogin(state),
    chatVisitor: getChatVisitor(state),
    readOnlyState: getReadOnlyState(state),
    preChatFormState,
    isAuthenticated: getIsAuthenticated(state),
    title: getChatTitle(state),
    departmentFieldHidden: getSettingsChatDepartmentsEmpty(state),
    hasChatHistory: getHasChatHistory(state),
    chatHistoryLabel: getChatHistoryLabel(state),
    defaultDepartment: getDefaultSelectedDepartment(state),
    isNewPrechatFormEnabled: isFeatureEnabled(state, 'web_widget_prechat_form_v2'),
  }
}

class PrechatScreen extends Component {
  static propTypes = {
    hideZendeskLogo: PropTypes.bool,
    hasChatHistory: PropTypes.bool.isRequired,
    screen: PropTypes.string.isRequired,
    visitor: PropTypes.object.isRequired,
    readOnlyState: PropTypes.object.isRequired,
    preChatFormState: PropTypes.object,
    handlePreChatFormChange: PropTypes.func,
    resetCurrentMessage: PropTypes.func,
    prechatFormSettings: PropTypes.object.isRequired,
    settingsDepartmentsEnabled: PropTypes.array,
    authUrls: PropTypes.object.isRequired,
    socialLogin: PropTypes.object.isRequired,
    loginSettings: PropTypes.object.isRequired,
    initiateSocialLogout: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    fullscreen: PropTypes.bool,
    departmentFieldHidden: PropTypes.bool.isRequired,
    openedChatHistory: PropTypes.func.isRequired,
    chatHistoryLabel: PropTypes.string.isRequired,
    defaultDepartment: PropTypes.object,
    selectedDepartment: PropTypes.shape({
      id: PropTypes.number,
      status: PropTypes.string,
    }),
    isNewPrechatFormEnabled: PropTypes.bool,
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

  renderPreChatForm() {
    const { form, message, settingsDepartmentsEnabled } = this.props.prechatFormSettings

    return (
      <PrechatForm
        title={this.props.title}
        authUrls={this.props.authUrls}
        socialLogin={this.props.socialLogin}
        chatVisitor={this.props.visitor}
        initiateSocialLogout={this.props.initiateSocialLogout}
        hasChatHistory={this.props.hasChatHistory}
        form={form}
        settingsDepartmentsEnabled={settingsDepartmentsEnabled}
        readOnlyState={this.props.readOnlyState}
        formState={this.props.preChatFormState}
        selectedDepartment={this.props.selectedDepartment}
        onPrechatFormChange={this.props.handlePreChatFormChange}
        loginEnabled={this.props.loginSettings.enabled}
        phoneEnabled={this.props.loginSettings.phoneEnabled}
        greetingMessage={message}
        isAuthenticated={this.props.isAuthenticated}
        visitor={this.props.visitor}
        onFormCompleted={this.onPrechatFormComplete}
        fullscreen={this.props.fullscreen}
        hideZendeskLogo={this.props.hideZendeskLogo}
        openedChatHistory={this.props.openedChatHistory}
        chatHistoryLabel={this.props.chatHistoryLabel}
        defaultDepartment={this.props.defaultDepartment}
      />
    )
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
        if (this.props.isNewPrechatFormEnabled) {
          return (
            <SuspensePage>
              <NewPrechatForm isPreview={this.props.isPreview} />
            </SuspensePage>
          )
        }
        return this.renderPreChatForm()
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
