import React from 'react'
import PropTypes from 'prop-types'
import ChannelChoiceMenu from 'component/channelChoice/ChannelChoiceMenu'
import { TEST_IDS } from 'src/constants/shared'
import { Widget, Header, Main, Footer } from 'components/Widget'
import useTranslation from 'src/hooks/useTranslation'

const ChannelChoiceContainer = ({
  talkOnline = false,
  submitTicketAvailable = true,
  chatEnabled = false,
  isMobile = false,
  chatAvailable,
  formTitleKey,
  handleNextClick,
  callbackEnabled,
  chatOfflineAvailable
}) => {
  const title = useTranslation(`embeddable_framework.helpCenter.form.title.${formTitleKey}`)

  return (
    <Widget>
      <Header title={title} />
      <Main>
        <div data-testid={TEST_IDS.CC_CONTAINER}>
          <ChannelChoiceMenu
            isMobile={isMobile}
            submitTicketAvailable={submitTicketAvailable}
            chatEnabled={chatEnabled}
            callbackEnabled={callbackEnabled}
            talkOnline={talkOnline}
            onNextClick={handleNextClick}
            chatOfflineAvailable={chatOfflineAvailable}
            chatAvailable={chatAvailable}
          />
        </div>
      </Main>
      <Footer />
    </Widget>
  )
}

ChannelChoiceContainer.propTypes = {
  isMobile: PropTypes.bool,
  chatAvailable: PropTypes.bool.isRequired,
  formTitleKey: PropTypes.string.isRequired,
  handleNextClick: PropTypes.func.isRequired,
  callbackEnabled: PropTypes.bool.isRequired,
  talkOnline: PropTypes.bool.isRequired,
  submitTicketAvailable: PropTypes.bool,
  chatEnabled: PropTypes.bool,
  chatOfflineAvailable: PropTypes.bool
}

export default ChannelChoiceContainer
