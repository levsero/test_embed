import AverageWaitTime from 'src/embeds/talk/components/AverageWaitTime/styles.scss'
import TalkNotificationStyles from 'embeds/talk/components/ErrorNotification/styles.scss'
import TalkOfflinePageStyles from 'embeds/talk/pages/OfflinePage/styles.scss'
import TalkPhoneNumberStyles from 'embeds/talk/components/PhoneNumber/styles.scss'
import TalkPhoneOnlyPageStyles from 'embeds/talk/pages/PhoneOnlyPage/styles.scss'
import TalkCallbackFormStyles from 'embeds/talk/components/CallbackForm/styles.scss'
import SuccessNotificationStyles from 'embeds/talk/pages/SuccessNotificationPage/styles.scss'

const styles = `
  ${TalkNotificationStyles}
  ${TalkOfflinePageStyles}
  ${TalkPhoneNumberStyles}
  ${AverageWaitTime}
  ${TalkPhoneOnlyPageStyles}
  ${TalkCallbackFormStyles}
  ${SuccessNotificationStyles}
`

export default styles
