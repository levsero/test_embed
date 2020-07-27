import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { i18n } from 'service/i18n'
import AverageWaitTime from 'src/embeds/talk/components/AverageWaitTime'
import PhoneNumber from 'src/embeds/talk/components/PhoneNumber'
import { Widget, Header, Main, Footer } from 'src/components/Widget'
import {
  getAverageWaitTimeString,
  getEmbeddableConfig
} from 'src/redux/modules/talk/talk-selectors'
import { Container, TalkIcon, Message, PhoneNumberContainer } from './styles'
import { TEST_IDS } from 'src/constants/shared'
import getFormattedPhoneNumber from 'embeds/talk/utils/getFormattedPhoneNumber'
import useGetTitle from 'src/embeds/talk/hooks/useGetTitle'

const PhoneOnlyPage = ({ callUsMessage, averageWaitTime, phoneNumber, formattedPhoneNumber }) => {
  const getTitle = useGetTitle()

  return (
    <Widget>
      <Header title={getTitle('embeddable_framework.talk.phoneOnly.title')} />
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
  callUsMessage: PropTypes.string.isRequired
}

const mapStateToProps = state => {
  return {
    callUsMessage: i18n.t('embeddable_framework.talk.phoneOnly.new_message'),
    averageWaitTime: getAverageWaitTimeString(state),
    phoneNumber: getEmbeddableConfig(state).phoneNumber,
    formattedPhoneNumber: getFormattedPhoneNumber(getEmbeddableConfig(state).phoneNumber)
  }
}

const connectedComponent = connect(mapStateToProps)(PhoneOnlyPage)

export { connectedComponent as default, PhoneOnlyPage as Component }
