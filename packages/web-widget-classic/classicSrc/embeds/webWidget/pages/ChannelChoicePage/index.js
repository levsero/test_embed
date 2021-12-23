import ChannelChoiceMenu from 'classicSrc/component/channelChoice/ChannelChoiceMenu'
import { Widget, Header, Main, Footer } from 'classicSrc/components/Widget'
import { TEST_IDS } from 'classicSrc/constants/shared'
import { isCallbackEnabled } from 'classicSrc/embeds/talk/selectors'
import useTranslate from 'classicSrc/hooks/useTranslate'
import { onChannelChoiceNextClick } from 'classicSrc/redux/modules/base'
import {
  getChatAvailable,
  getChatOfflineAvailable,
  getChatEnabled,
  getTalkOnline,
  getSubmitTicketAvailable,
} from 'classicSrc/redux/modules/selectors'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { isMobileBrowser } from '@zendesk/widget-shared-services'

const ChannelChoicePage = ({
  isMobile,
  submitTicketAvailable,
  chatEnabled,
  callbackEnabled,
  talkOnline,
  onChannelChoiceNextClick,
  chatOfflineAvailable,
  chatAvailable,
}) => {
  const translate = useTranslate()

  return (
    <Widget>
      <Header title={translate('embeddable_framework.helpCenter.form.title.help')} />
      <Main>
        <div data-testid={TEST_IDS.CC_CONTAINER}>
          <ChannelChoiceMenu
            isMobile={isMobile}
            submitTicketAvailable={submitTicketAvailable}
            chatEnabled={chatEnabled}
            callbackEnabled={callbackEnabled}
            talkOnline={talkOnline}
            onNextClick={onChannelChoiceNextClick}
            chatOfflineAvailable={chatOfflineAvailable}
            chatAvailable={chatAvailable}
          />
        </div>
      </Main>
      <Footer />
    </Widget>
  )
}

ChannelChoicePage.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  submitTicketAvailable: PropTypes.bool.isRequired,
  chatEnabled: PropTypes.bool.isRequired,
  callbackEnabled: PropTypes.bool.isRequired,
  talkOnline: PropTypes.bool.isRequired,
  onChannelChoiceNextClick: PropTypes.func.isRequired,
  chatOfflineAvailable: PropTypes.bool.isRequired,
  chatAvailable: PropTypes.bool.isRequired,
}

const mapStateToProps = (state) => ({
  isMobile: isMobileBrowser(),
  submitTicketAvailable: getSubmitTicketAvailable(state),
  chatEnabled: getChatEnabled(state),
  callbackEnabled: isCallbackEnabled(state),
  talkOnline: getTalkOnline(state),
  chatOfflineAvailable: getChatOfflineAvailable(state),
  chatAvailable: getChatAvailable(state),
})

const mapDispatchToProps = {
  onChannelChoiceNextClick,
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(ChannelChoicePage)

export { connectedComponent as default, ChannelChoicePage as Component }
