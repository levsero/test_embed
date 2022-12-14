import { Notification, Title } from 'classicSrc/embeds/support/components/Notifications'
import useTranslate from 'classicSrc/hooks/useTranslate'
import PropTypes from 'prop-types'

const EmailTranscriptSuccess = ({ email }) => {
  const translate = useTranslate()

  return (
    <Notification
      type="success"
      role="alert"
      tabIndex={0}
      ref={(ref) => {
        setTimeout(() => {
          ref?.focus()
        }, 0)
      }}
    >
      <Title
        dangerouslySetInnerHTML={{
          __html: translate('embeddable_framework.chat.emailtranscript.success_message', {
            email: `<strong>${email}</strong>`,
          }),
        }}
      />
    </Notification>
  )
}

EmailTranscriptSuccess.propTypes = {
  email: PropTypes.string,
}

export default EmailTranscriptSuccess
