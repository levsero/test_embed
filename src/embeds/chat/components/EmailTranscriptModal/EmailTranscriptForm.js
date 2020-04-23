import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Body, Footer, FooterItem, Header } from 'embeds/webWidget/components/Modal'
import { Alert, Title } from 'embeds/support/components/Notifications'
import { Button } from '@zendeskgarden/react-buttons'
import { Dots } from '@zendeskgarden/react-loaders'
import { Form } from 'embeds/chat/components/EmailTranscriptModal/styles'
import useTranslate from 'src/hooks/useTranslate'
import { Form as ReactFinalForm } from 'react-final-form'
import { sendEmailTranscript } from 'embeds/chat/actions/email-transcript'
import { FORM_ERROR } from 'final-form'
import { useDispatch, useSelector } from 'react-redux'
import { getVisitorEmail } from 'embeds/chat/selectors'
import { EMAIL_PATTERN } from 'constants/shared'
import { withTheme } from 'styled-components'
import EmailTranscriptFormValues from 'embeds/chat/components/EmailTranscriptModal/EmailTranscriptFormValues'

const validate = values => {
  if (!EMAIL_PATTERN.test(values.email)) {
    return {
      email: 'not valid'
    }
  }

  return undefined
}

const EmailTranscriptForm = ({ theme, onClose, onSuccess }) => {
  const translate = useTranslate()
  const dispatch = useDispatch()
  const initialEmail = useSelector(getVisitorEmail)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  function onSubmit(values, _form, callback) {
    setHasSubmitted(true)

    const errors = validate(values)

    if (errors) {
      callback(errors)
      return
    }

    Promise.resolve(dispatch(sendEmailTranscript(values.email)))
      .then(() => {
        callback()
        onSuccess(values.email)
      })
      .catch(() => {
        callback({
          [FORM_ERROR]: 'submit failed'
        })
      })
  }

  return (
    <ReactFinalForm
      onSubmit={onSubmit}
      validate={values => {
        if (!hasSubmitted) {
          return undefined
        }

        return validate(values)
      }}
      initialValues={{
        email: initialEmail
      }}
    >
      {({ handleSubmit, submitError, submitting }) => (
        <Form onSubmit={handleSubmit}>
          <Header>{translate('embeddable_framework.chat.emailtranscript.title')}</Header>
          <Body>
            <EmailTranscriptFormValues
              onSubmit={handleSubmit}
              onClose={onClose}
              showErrors={hasSubmitted}
              submitError={submitError}
              isSubmitting={submitting}
            />

            {submitError && hasSubmitted && (
              <Alert type="error" role="alert">
                <Title>
                  {translate('embeddable_framework.chat.emailtranscript.failure_message')}
                </Title>
              </Alert>
            )}
          </Body>
          <Footer>
            <FooterItem>
              <Button basic={true} onClick={onClose}>
                {translate('embeddable_framework.common.button.cancel')}
              </Button>
            </FooterItem>
            <FooterItem>
              <Button primary={true} type="submit">
                {submitting ? (
                  <Dots size={`${20 / theme.fontSize}rem`} color={theme.buttonTextColorStr} />
                ) : (
                  translate('embeddable_framework.common.button.send')
                )}
              </Button>
            </FooterItem>
          </Footer>
        </Form>
      )}
    </ReactFinalForm>
  )
}

EmailTranscriptForm.propTypes = {
  theme: PropTypes.shape({
    fontSize: PropTypes.number,
    buttonTextColorStr: PropTypes.string
  }),
  onClose: PropTypes.func,
  onSuccess: PropTypes.func
}

export default withTheme(EmailTranscriptForm)
