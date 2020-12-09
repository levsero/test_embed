import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import useTranslate from 'src/hooks/useTranslate'
import { Widget, Header, Main, Footer } from 'src/components/Widget'

import ClickToCallIntro from 'src/embeds/talk/components/ClickToCallIntro'
import ClickToCallInProgress from 'src/embeds/talk/components/ClickToCallInProgress'
import { getSnapcallCallStatus, getSnapcallCallDuration } from 'src/embeds/talk/selectors'
import useSnapcallCallStartingEvent from 'src/embeds/talk/hooks/useSnapcallCallStartingEvent'
import useSnapcallCallEndedEvent from 'src/embeds/talk/hooks/useSnapcallCallEndedEvent'
import useSnapcallCallDisconnectedEvent from 'src/embeds/talk/hooks/useSnapcallCallDisconnectedEvent'
import useSnapcallUpdateTime from 'src/embeds/talk/hooks/useSnapcallUpdateTime'
import useSnapcallMediaRequestEvent from 'src/embeds/talk/hooks/useSnapcallMediaRequestEvent'
import useInitSnapcall from 'src/embeds/talk/hooks/useInitSnapcall'
import { getAverageWaitTimeString } from 'src/redux/modules/talk/talk-selectors'

const ClickToCallPage = ({ callStatus, callDuration, averageWaitTime }) => {
  useInitSnapcall()
  useSnapcallCallStartingEvent()
  useSnapcallCallEndedEvent()
  useSnapcallCallDisconnectedEvent()
  useSnapcallUpdateTime()
  useSnapcallMediaRequestEvent()
  const translate = useTranslate()

  return (
    <Widget>
      <Header title={translate('embeddable_framework.talk.clickToCall.header.title')} />
      <Main>
        {callStatus === 'active' ? (
          <ClickToCallInProgress callDuration={callDuration} />
        ) : (
          <ClickToCallIntro
            callDuration={callDuration}
            averageWaitTime={averageWaitTime}
            callStatus={callStatus}
          />
        )}
      </Main>
      <Footer />
    </Widget>
  )
}

ClickToCallPage.propTypes = {
  callStatus: PropTypes.string,
  callDuration: PropTypes.string,
  averageWaitTime: PropTypes.string
}

const mapStateToProps = state => ({
  callStatus: getSnapcallCallStatus(state),
  callDuration: getSnapcallCallDuration(state),
  averageWaitTime: getAverageWaitTimeString(state)
})

const connectedComponent = connect(mapStateToProps)(ClickToCallPage)

export { connectedComponent as default, ClickToCallPage as Component }
