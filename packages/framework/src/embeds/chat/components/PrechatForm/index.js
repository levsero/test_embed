import PropTypes from 'prop-types'
import { connect, useSelector } from 'react-redux'
import DynamicForm from 'components/DynamicForm'
import { Header, Widget } from 'components/Widget'
import { submitPrechatForm } from 'embeds/chat/actions/prechat-form'
import AuthenticatedProfile from 'embeds/chat/components/AuthenticatedProfile'
import GreetingMessage from 'embeds/chat/components/PrechatForm/GreetingMessage'
import PrechatFormControls from 'embeds/chat/components/PrechatForm/PrechatFormControls'
import SocialLogin from 'embeds/chat/components/SocialLogin'
import ViewHistoryButton from 'embeds/chat/components/ViewHistoryButton'
import { getVisiblePrechatFields, getPrechatGreeting } from 'embeds/chat/selectors/prechat-form'
import { getReadOnlyState } from 'embeds/support/selectors'
import isFeatureEnabled from 'embeds/webWidget/selectors/feature-flags'
import SubmitButton from 'src/components/DynamicForm/SubmitButton'
import { Footer } from 'src/components/Widget'
import useTranslate from 'src/hooks/useTranslate'
import { initiateSocialLogout } from 'src/redux/modules/chat'
import {
  getAuthUrls,
  getChatVisitor,
  getDepartments,
  getIsAuthenticated,
  getSocialLogin,
  getPreChatFormState,
} from 'src/redux/modules/chat/chat-selectors'
import { getChatTitle, getOfflineFormSettings } from 'src/redux/modules/selectors'
import { getSettingsChatDepartmentsEnabled } from 'src/redux/modules/settings/settings-selectors'
import validate from './validate'

const PrechatForm = ({
  title,
  getVisibleFields,
  isAuthenticated,
  onSubmit,
  greetingMessage,
  visitor,
  socialLogin,
  authUrls,
  initiateSocialLogout,
  readOnlyValues,
  isOfflineFormEnabled,
  departments,
  isPreview,
  initialValues,
}) => {
  const isVisibleDepartmentsFeatureEnabled = useSelector((state) =>
    isFeatureEnabled(state, 'web_widget_prechat_form_visible_departments')
  )
  const translate = useTranslate()

  const isDepartmentFieldVisible = (options = {}) => {
    return getVisibleFields(options).some((field) => field.id === 'department')
  }

  const isDepartmentOffline = (fields, departmentId) => {
    if (isVisibleDepartmentsFeatureEnabled) {
      const isAnyDepartmentVisibleToEndUsers = fields.some((field) => field.id === 'department')

      const isSelectedDepartmentVisibleToEndUsers = Boolean(
        fields
          .find((field) => field.id === 'department')
          ?.options.some((option) => option.value === departmentId)
      )

      // If the selected department isn't available in the list of options that is visible to the end user, exclude it
      const isSelectedDepartmentValid =
        !isAnyDepartmentVisibleToEndUsers ||
        (isAnyDepartmentVisibleToEndUsers && isSelectedDepartmentVisibleToEndUsers)

      return isSelectedDepartmentValid && departments[departmentId]?.status === 'offline'
    }

    return departments[departmentId]?.status === 'offline'
  }

  const includeHiddenDepartmentFieldValue = (valuesToSubmit, allValues = {}) => {
    const hiddenFieldValues = {}
    if (allValues.department) hiddenFieldValues.department = allValues.department
    return {
      ...hiddenFieldValues,
      ...valuesToSubmit,
    }
  }

  return (
    <Widget>
      <Header title={title} />

      <DynamicForm
        formId={'prechat-form'}
        onSubmit={(valuesToSubmit, allValues) =>
          onSubmit({
            values: includeHiddenDepartmentFieldValue(valuesToSubmit, allValues),
            isDepartmentFieldVisible: isDepartmentFieldVisible(valuesToSubmit),
          }).then(() => {
            return { success: true }
          })
        }
        initialValues={{ message: initialValues?.message }}
        getFields={getVisibleFields}
        controls={<PrechatFormControls />}
        isPreview={isPreview}
        validate={(values) =>
          validate({
            values,
            isAuthenticated,
            fields: getVisibleFields(values),
            isOfflineFormEnabled,
            isVisibleDepartmentsFeatureEnabled,
          })
        }
        footer={({ isSubmitting, formValues, fields }) => (
          <Footer>
            <SubmitButton
              submitting={isSubmitting}
              label={
                isDepartmentOffline(fields, formValues?.department)
                  ? translate('embeddable_framework.chat.preChat.offline.button.sendMessage')
                  : translate('embeddable_framework.chat.preChat.online.button.startChat')
              }
            />
          </Footer>
        )}
        extraFieldOptions={{
          socialLogin: () => <SocialLogin authUrls={authUrls} />,
        }}
        readOnlyValues={readOnlyValues}
      >
        <ViewHistoryButton />

        {greetingMessage && <GreetingMessage message={greetingMessage} />}

        {Boolean(isAuthenticated || socialLogin?.authenticated) && (
          <AuthenticatedProfile
            visitor={visitor}
            socialLogin={socialLogin}
            initiateSocialLogout={initiateSocialLogout}
          />
        )}
      </DynamicForm>
    </Widget>
  )
}

PrechatForm.propTypes = {
  title: PropTypes.string,
  onSubmit: PropTypes.func,
  getVisibleFields: PropTypes.func,
  isAuthenticated: PropTypes.bool,
  greetingMessage: PropTypes.string,
  visitor: AuthenticatedProfile.propTypes.visitor,
  socialLogin: AuthenticatedProfile.propTypes.socialLogin,
  authUrls: SocialLogin.propTypes.authUrls,
  initiateSocialLogout: AuthenticatedProfile.propTypes.initiateSocialLogout,
  readOnlyValues: PropTypes.objectOf(PropTypes.bool),
  isOfflineFormEnabled: PropTypes.bool,
  isPreview: PropTypes.bool,
  departments: PropTypes.objectOf(
    PropTypes.shape({
      status: PropTypes.string,
    })
  ),
  initialValues: PropTypes.shape({
    message: PropTypes.string,
  }),
}

const mapStateToProps = (state) => ({
  title: getChatTitle(state),
  customerDefinedDepartmentsEnabled: getSettingsChatDepartmentsEnabled(state),
  getVisibleFields: (options) => getVisiblePrechatFields(state, options),
  isAuthenticated: getIsAuthenticated(state),
  greetingMessage: getPrechatGreeting(state),
  visitor: getChatVisitor(state),
  socialLogin: getSocialLogin(state),
  authUrls: getAuthUrls(state),
  readOnlyValues: getReadOnlyState(state),
  isOfflineFormEnabled: getOfflineFormSettings(state).enabled,
  departments: getDepartments(state),
  initialValues: getPreChatFormState(state),
})

export default connect(mapStateToProps, { initiateSocialLogout, onSubmit: submitPrechatForm })(
  PrechatForm
)

export const Component = PrechatForm
