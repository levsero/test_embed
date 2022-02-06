import DynamicForm from 'classicSrc/components/DynamicForm'
import SubmitButton from 'classicSrc/components/DynamicForm/SubmitButton'
import { Header, Widget } from 'classicSrc/components/Widget'
import { Footer } from 'classicSrc/components/Widget'
import { submitPrechatForm } from 'classicSrc/embeds/chat/actions/prechat-form'
import AuthenticatedProfile from 'classicSrc/embeds/chat/components/AuthenticatedProfile'
import GreetingMessage from 'classicSrc/embeds/chat/components/PrechatForm/GreetingMessage'
import PrechatFormControls from 'classicSrc/embeds/chat/components/PrechatForm/PrechatFormControls'
import SocialLogin from 'classicSrc/embeds/chat/components/SocialLogin'
import ViewHistoryButton from 'classicSrc/embeds/chat/components/ViewHistoryButton'
import {
  getAuthUrls,
  getChatVisitor,
  getDepartments,
  getIsAuthenticated,
  getSocialLogin,
  getPreChatFormState,
} from 'classicSrc/embeds/chat/selectors'
import {
  getVisiblePrechatFields,
  getPrechatGreeting,
} from 'classicSrc/embeds/chat/selectors/prechat-form'
import { getReadOnlyState } from 'classicSrc/embeds/support/selectors'
import useTranslate from 'classicSrc/hooks/useTranslate'
import { initiateSocialLogout } from 'classicSrc/redux/modules/chat'
import { getChatTitle, getOfflineFormSettings } from 'classicSrc/redux/modules/selectors'
import { getSettingsChatDepartmentsEnabled } from 'classicSrc/redux/modules/settings/settings-selectors'
import PropTypes from 'prop-types'
import { connect, useSelector } from 'react-redux'
import isFeatureEnabled from '@zendesk/widget-shared-services/feature-flags'
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
