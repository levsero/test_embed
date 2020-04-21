import React, { useState } from 'react'
import { connect } from 'react-redux'
import { FORM_ERROR } from 'final-form'
import PropTypes from 'prop-types'
import { Form as ReactFinalForm } from 'react-final-form'

import useTranslate from 'src/hooks/useTranslate'
import UserProfile from 'src/embeds/chat/components/ContactDetails/Profile'

import {
  getIsAuthenticated,
  getAuthUrls,
  getChatVisitor,
  getSocialLogin
} from 'src/redux/modules/chat/chat-selectors'
import { getEditContactDetails } from 'embeds/chat/selectors'
import { updateContactDetailsVisibility, editContactDetailsSubmitted } from 'src/redux/modules/chat'
import { Alert, Title } from 'src/components/Alert'
import { Header } from 'embeds/webWidget/components/Modal'
import validate from 'src/embeds/chat/utils/validateContactDetails'
import { getDefaultFormFields } from 'src/redux/modules/selectors'
import { initiateSocialLogout } from 'src/redux/modules/chat'
import FormFooter from 'src/embeds/chat/components/ContactDetails/Footer'

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
  visitor
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
      editContactDetailsSubmitted({ display_name: values.display_name, email: values.email })
    )
      .then(() => {
        setShowErrors(false)
        callback()
        onSuccess()
      })
      .catch(() =>
        callback({
          [FORM_ERROR]: 'embeddable_framework.chat.options.editContactDetailsSubmission.error'
        })
      )
  }

  return (
    <ReactFinalForm
      validate={values => {
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
          onSubmit={e => {
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
      required: PropTypes.bool
    }),
    email: PropTypes.shape({
      required: PropTypes.bool
    })
  }),
  socialLogin: PropTypes.object.isRequired,
  updateContactDetailsVisibility: PropTypes.func,
  visitor: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  authUrls: getAuthUrls(state),
  contactDetails: getEditContactDetails(state),
  isAuthenticated: getIsAuthenticated(state),
  requiredFormData: getDefaultFormFields(state),
  socialLogin: getSocialLogin(state),
  visitor: getChatVisitor(state)
})

const actionCreators = {
  updateContactDetailsVisibility,
  editContactDetailsSubmitted,
  initiateSocialLogout
}

const connectedComponent = connect(
  mapStateToProps,
  actionCreators
)(ChatContactDetailsModalForm)

export { connectedComponent as default, ChatContactDetailsModalForm as Component }
