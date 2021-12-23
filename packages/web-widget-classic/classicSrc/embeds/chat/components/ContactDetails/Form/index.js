import { Alert, Title } from 'classicSrc/components/Alert'
import FormFooter from 'classicSrc/embeds/chat/components/ContactDetails/Footer'
import UserProfile from 'classicSrc/embeds/chat/components/ContactDetails/Profile'
import { getEditContactDetails } from 'classicSrc/embeds/chat/selectors'
import {
  getIsAuthenticated,
  getAuthUrls,
  getChatVisitor,
  getSocialLogin,
} from 'classicSrc/embeds/chat/selectors'
import validate from 'classicSrc/embeds/chat/utils/validateContactDetails'
import useTranslate from 'classicSrc/hooks/useTranslate'
import {
  updateContactDetailsVisibility,
  editContactDetailsSubmitted,
} from 'classicSrc/redux/modules/chat'
import { initiateSocialLogout } from 'classicSrc/redux/modules/chat'
import { getDefaultFormFields } from 'classicSrc/redux/modules/selectors'
import { FORM_ERROR } from 'final-form'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { Form as ReactFinalForm } from 'react-final-form'
import { connect } from 'react-redux'
import { Header } from '@zendeskgarden/react-modals'
import { Form, Body } from './styles'

const ChatContactDetailsModalForm = ({
  authUrls,
  contactDetails,
  editContactDetailsSubmitted,
  initiateSocialLogout,
  isAuthenticated,
  onSuccess,
  requiredFormData,
  socialLogin,
  updateContactDetailsVisibility,
  visitor,
}) => {
  const [showErrors, setShowErrors] = useState(false)
  const translate = useTranslate()

  const onSubmit = (values, _form, callback) => {
    const errors = validate(values, requiredFormData)

    if (errors) {
      setShowErrors(true)
      callback(errors)
      return
    }

    Promise.resolve(
      editContactDetailsSubmitted({
        display_name: values.display_name ?? '',
        email: values.email ?? '',
      })
    )
      .then(() => {
        setShowErrors(false)
        callback()
        onSuccess()
      })
      .catch(() =>
        callback({
          [FORM_ERROR]: 'embeddable_framework.chat.options.editContactDetailsSubmission.error',
        })
      )
  }

  return (
    <ReactFinalForm
      validate={(values) => {
        if (!showErrors) {
          return
        }
        return validate(values, requiredFormData)
      }}
      onSubmit={onSubmit}
      initialValues={contactDetails}
      render={({ handleSubmit, submitting, submitError }) => (
        <Form
          noValidate={true}
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
        >
          <Header>{translate('embeddable_framework.chat.options.editContactDetails')}</Header>
          <Body>
            {
              <UserProfile
                authUrls={authUrls}
                initiateSocialLogout={initiateSocialLogout}
                isAuthenticated={isAuthenticated}
                requiredFormData={requiredFormData}
                socialLogin={socialLogin}
                visitor={visitor}
              />
            }
            {submitError && (
              <Alert type="error" role="alert">
                <Title>{translate(submitError)}</Title>
              </Alert>
            )}
          </Body>
          <FormFooter
            isAuthenticated={isAuthenticated}
            updateContactDetailsVisibility={updateContactDetailsVisibility}
            submitting={submitting}
          />
        </Form>
      )}
    />
  )
}

ChatContactDetailsModalForm.propTypes = {
  authUrls: PropTypes.object.isRequired,
  contactDetails: PropTypes.object.isRequired,
  editContactDetailsSubmitted: PropTypes.func.isRequired,
  initiateSocialLogout: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  onSuccess: PropTypes.func.isRequired,
  requiredFormData: PropTypes.shape({
    name: PropTypes.shape({
      required: PropTypes.bool,
    }),
    email: PropTypes.shape({
      required: PropTypes.bool,
    }),
  }),
  socialLogin: PropTypes.object.isRequired,
  updateContactDetailsVisibility: PropTypes.func,
  visitor: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  authUrls: getAuthUrls(state),
  contactDetails: getEditContactDetails(state),
  isAuthenticated: getIsAuthenticated(state),
  requiredFormData: getDefaultFormFields(state),
  socialLogin: getSocialLogin(state),
  visitor: getChatVisitor(state),
})

const actionCreators = {
  updateContactDetailsVisibility,
  editContactDetailsSubmitted,
  initiateSocialLogout,
}

const connectedComponent = connect(mapStateToProps, actionCreators)(ChatContactDetailsModalForm)

export { connectedComponent as default, ChatContactDetailsModalForm as Component }
