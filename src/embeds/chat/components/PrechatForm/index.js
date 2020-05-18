import React from 'react'
import PropTypes from 'prop-types'
import { Header, Widget } from 'components/Widget'
import { getChatTitle, getOfflineFormSettings } from 'src/redux/modules/selectors'
import { connect } from 'react-redux'
import GreetingMessage from 'embeds/chat/components/PrechatForm/GreetingMessage'
import validate from './validate'
import { getSettingsChatDepartmentsEnabled } from 'src/redux/modules/settings/settings-selectors'
import {
  getDefaultSelectedDepartment,
  getPrechatFields,
  getPrechatGreeting
} from 'embeds/chat/selectors/prechat-form'
import {
  getAuthUrls,
  getChatVisitor,
  getDepartments,
  getIsAuthenticated,
  getSocialLogin
} from 'src/redux/modules/chat/chat-selectors'
import DynamicForm from 'components/DynamicForm'
import AuthenticatedProfile from 'embeds/chat/components/AuthenticatedProfile'
import { initiateSocialLogout } from 'src/redux/modules/chat'
import ViewHistoryButton from 'embeds/chat/components/ViewHistoryButton'
import SocialLogin from 'embeds/chat/components/SocialLogin'
import PrechatFormControls from 'embeds/chat/components/PrechatForm/PrechatFormControls'
import { submitPrechatForm } from 'embeds/chat/actions/prechat-form'
import { getReadOnlyState } from 'embeds/support/selectors'
import useTranslate from 'src/hooks/useTranslate'
import SubmitButton from 'embeds/chat/components/SubmitButton'
import { Footer } from 'src/components/Widget'

const PrechatForm = ({
  title,
  getFields,
  isAuthenticated,
  onSubmit,
  greetingMessage,
  visitor,
  socialLogin,
  authUrls,
  initiateSocialLogout,
  readOnlyValues,
  isOfflineFormEnabled,
  defaultDepartment,
  departments,
  isPreview
}) => {
  const translate = useTranslate()
  const isDepartmentOffline = departmentId => {
    return departments[departmentId]?.status === 'offline'
  }

  return (
    <Widget>
      <Header title={title} />

      <DynamicForm
        formId={'prechat-form'}
        onSubmit={values =>
          onSubmit({
            values,
            isDepartmentFieldVisible: getFields(values).some(field => field.id === 'department')
          })
        }
        initialValues={{
          department: defaultDepartment
        }}
        getFields={getFields}
        isPreview={isPreview}
        validate={values =>
          validate({ values, isAuthenticated, fields: getFields(values), isOfflineFormEnabled })
        }
        footer={({ isSubmitting, formValues }) => (
          <Footer>
            <SubmitButton
              submitting={isSubmitting}
              label={
                isDepartmentOffline(formValues.department)
                  ? translate('embeddable_framework.chat.preChat.offline.button.sendMessage')
                  : translate('embeddable_framework.chat.preChat.online.button.startChat')
              }
            />
          </Footer>
        )}
        extraFieldOptions={{
          socialLogin: () => <SocialLogin authUrls={authUrls} />
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

        <PrechatFormControls />
      </DynamicForm>
    </Widget>
  )
}

PrechatForm.propTypes = {
  title: PropTypes.string,
  onSubmit: PropTypes.func,
  getFields: PropTypes.func,
  isAuthenticated: PropTypes.bool,
  greetingMessage: PropTypes.string,
  visitor: AuthenticatedProfile.propTypes.visitor,
  socialLogin: AuthenticatedProfile.propTypes.socialLogin,
  authUrls: SocialLogin.propTypes.authUrls,
  initiateSocialLogout: AuthenticatedProfile.propTypes.initiateSocialLogout,
  readOnlyValues: PropTypes.objectOf(PropTypes.bool),
  isOfflineFormEnabled: PropTypes.bool,
  isPreview: PropTypes.bool,
  defaultDepartment: PropTypes.any,
  departments: PropTypes.objectOf(
    PropTypes.shape({
      status: PropTypes.string
    })
  )
}

const mapStateToProps = state => ({
  title: getChatTitle(state),
  customerDefinedDepartmentsEnabled: getSettingsChatDepartmentsEnabled(state),
  getFields: options => getPrechatFields(state, options),
  isAuthenticated: getIsAuthenticated(state),
  greetingMessage: getPrechatGreeting(state),
  visitor: getChatVisitor(state),
  socialLogin: getSocialLogin(state),
  authUrls: getAuthUrls(state),
  readOnlyValues: getReadOnlyState(state),
  isOfflineFormEnabled: getOfflineFormSettings(state).enabled,
  defaultDepartment: getDefaultSelectedDepartment(state)?.id,
  departments: getDepartments(state)
})

export default connect(
  mapStateToProps,
  { initiateSocialLogout, onSubmit: submitPrechatForm }
)(PrechatForm)

export const Component = PrechatForm
