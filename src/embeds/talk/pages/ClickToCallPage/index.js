import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import useTranslate from 'src/hooks/useTranslate'
import { Widget, Header, Main, Footer } from 'src/components/Widget'

import ClickToCallIntro from 'src/embeds/talk/components/ClickToCallIntro'
import ClickToCallInProgress from 'src/embeds/talk/components/ClickToCallInProgress'
import { getSnapcallCallStatus } from 'src/embeds/talk/selectors'
import useSnapcallCallStartingEvent from 'src/embeds/talk/hooks/useSnapcallCallStartingEvent'
import useSnapcallCallEndedEvent from 'src/embeds/talk/hooks/useSnapcallCallEndedEvent'
import useInitSnapcall from 'src/embeds/talk/hooks/useInitSnapcall'

const ClickToCallPage = ({ callStatus }) => {
  useInitSnapcall()
  useSnapcallCallStartingEvent()
  useSnapcallCallEndedEvent()

  const translate = useTranslate()

  return (
    <Widget>
      <Header title={translate('embeddable_framework.talk.clickToCall.header.title')} />
      <Main>{callStatus === 'active' ? <ClickToCallInProgress /> : <ClickToCallIntro />}</Main>
      <Footer />
    </Widget>
  )
}

ClickToCallPage.propTypes = {
  callStatus: PropTypes.string
}

const mapStateToProps = state => ({
  callStatus: getSnapcallCallStatus(state)
})

const connectedComponent = connect(mapStateToProps)(ClickToCallPage)

export { connectedComponent as default, ClickToCallPage as Component }
