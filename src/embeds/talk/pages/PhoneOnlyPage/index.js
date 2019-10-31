import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { isMobileBrowser } from 'utility/devices'
import { i18n } from 'service/i18n'
import AverageWaitTime from 'src/embeds/talk/components/AverageWaitTime'
import PhoneNumber from 'src/embeds/talk/components/PhoneNumber'
import { Widget, Header, Main, Footer } from 'src/components/Widget'
import {
  getAverageWaitTimeString,
  getEmbeddableConfig
} from 'src/redux/modules/talk/talk-selectors'
import { getFormattedPhoneNumber, getTitle } from 'src/embeds/talk/selectors'
import { Container, TalkIcon, Message, PhoneNumberContainer } from './styles'
import { TEST_IDS } from 'src/constants/shared'

const PhoneOnlyPage = ({
  callUsMessage,
  averageWaitTime,
  phoneNumber,
  formattedPhoneNumber,
  title
}) => {
  return (
    <Widget>
      <Header title={title} />
      <Main>
        <Container data-testid={TEST_IDS.TALK_PHONE_ONLY_PAGE}>
          <TalkIcon />
          <Message>{callUsMessage}</Message>
          {averageWaitTime && <AverageWaitTime>{averageWaitTime}</AverageWaitTime>}
          <PhoneNumberContainer>
            <PhoneNumber phoneNumber={phoneNumber} formattedPhoneNumber={formattedPhoneNumber} />
          </PhoneNumberContainer>
        </Container>
      </Main>
      <Footer />
    </Widget>
  )
}

PhoneOnlyPage.propTypes = {
  averageWaitTime: PropTypes.string,
  formattedPhoneNumber: PropTypes.string.isRequired,
  phoneNumber: PropTypes.string.isRequired,
  callUsMessage: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
}

const mapStateToProps = state => {
  return {
    isMobile: isMobileBrowser(),
    callUsMessage: i18n.t('embeddable_framework.talk.phoneOnly.new_message'),
    averageWaitTime: getAverageWaitTimeString(state),
    phoneNumber: getEmbeddableConfig(state).phoneNumber,
    formattedPhoneNumber: getFormattedPhoneNumber(state),
    title: getTitle(state, 'embeddable_framework.talk.phoneOnly.title')
  }
}

const connectedComponent = connect(mapStateToProps)(PhoneOnlyPage)

export { connectedComponent as default, PhoneOnlyPage as Component }
