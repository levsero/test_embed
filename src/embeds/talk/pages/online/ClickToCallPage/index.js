import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import useTranslate from 'src/hooks/useTranslate'
import { Widget, Header, Main, Footer } from 'src/components/Widget'

import ClickToCallIntro from 'src/embeds/talk/components/ClickToCallIntro'
import ClickToCallInProgress from 'src/embeds/talk/components/ClickToCallInProgress'
import {
  getSnapcallCallStatus,
  getSnapcallCallDuration,
  getSnapcallPreviousCall
} from 'src/embeds/talk/selectors'
import useSnapcallCallStartingEvent from 'src/embeds/talk/hooks/useSnapcallCallStartingEvent'
import useSnapcallCallEndedEvent from 'src/embeds/talk/hooks/useSnapcallCallEndedEvent'
import useSnapcallUpdateTime from 'src/embeds/talk/hooks/useSnapcallUpdateTime'
import useInitSnapcall from 'src/embeds/talk/hooks/useInitSnapcall'
import { getAverageWaitTimeString } from 'src/redux/modules/talk/talk-selectors'

const ClickToCallPage = ({ callStatus, callDuration, previousCall, averageWaitTime }) => {
  useInitSnapcall()
  useSnapcallCallStartingEvent()
  useSnapcallCallEndedEvent()
  useSnapcallUpdateTime()
  const translate = useTranslate()

  return (
    <Widget>
      <Header title={translate('embeddable_framework.talk.clickToCall.header.title')} />
      <Main>
        {callStatus === 'active' ? (
          <ClickToCallInProgress callDuration={callDuration} />
        ) : (
          <ClickToCallIntro
            previousCall={previousCall}
            callDuration={callDuration}
            averageWaitTime={averageWaitTime}
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
  previousCall: PropTypes.bool,
  averageWaitTime: PropTypes.string
}

const mapStateToProps = state => ({
  callStatus: getSnapcallCallStatus(state),
  callDuration: getSnapcallCallDuration(state),
  previousCall: getSnapcallPreviousCall(state),
  averageWaitTime: getAverageWaitTimeString(state)
})

const connectedComponent = connect(mapStateToProps)(ClickToCallPage)

export { connectedComponent as default, ClickToCallPage as Component }
