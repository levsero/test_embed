import { FORM_ERROR } from 'final-form'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { Form as ReactFinalForm } from 'react-final-form'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@zendeskgarden/react-buttons'
import { Footer, FooterItem, Header } from '@zendeskgarden/react-modals'
import SubmitButton from 'src/components/DynamicForm/SubmitButton'
import { EMAIL_PATTERN } from 'src/constants/shared'
import { sendEmailTranscript } from 'src/embeds/chat/actions/email-transcript'
import EmailTranscriptFormValues from 'src/embeds/chat/components/EmailTranscriptModal/EmailTranscriptFormValues'
import { Form } from 'src/embeds/chat/components/EmailTranscriptModal/styles'
import { getVisitorEmail } from 'src/embeds/chat/selectors'
import { Alert, Title } from 'src/embeds/support/components/Notifications'
import useTranslate from 'src/hooks/useTranslate'
import { StyledBody } from './styles'

const validate = (values) => {
  if (!EMAIL_PATTERN.test(values.email)) {
    return {
      email: 'not valid',
    }
  }

  return undefined
}

const EmailTranscriptForm = ({ onClose, onSuccess }) => {
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
          [FORM_ERROR]: 'submit failed',
        })
      })
  }

  return (
    <ReactFinalForm
      onSubmit={onSubmit}
      validate={(values) => {
        if (!hasSubmitted) {
          return undefined
        }

        return validate(values)
      }}
      initialValues={{
        email: initialEmail,
      }}
    >
      {({ handleSubmit, submitError, submitting }) => (
        <Form onSubmit={handleSubmit}>
          <Header>{translate('embeddable_framework.chat.emailtranscript.title')}</Header>
          <StyledBody>
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
          </StyledBody>
          <Footer>
            <FooterItem>
              <Button isBasic={true} onClick={onClose}>
                {translate('embeddable_framework.common.button.cancel')}
              </Button>
            </FooterItem>
            <FooterItem>
              <SubmitButton
                label={translate('embeddable_framework.common.button.send')}
                submitting={submitting}
              />
            </FooterItem>
          </Footer>
        </Form>
      )}
    </ReactFinalForm>
  )
}

EmailTranscriptForm.propTypes = {
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
}

export default EmailTranscriptForm
