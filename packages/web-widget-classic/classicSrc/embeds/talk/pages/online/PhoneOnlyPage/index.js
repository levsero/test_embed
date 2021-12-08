import { i18n } from 'classicSrc/app/webWidget/services/i18n'
import { Widget, Header, Main, Footer } from 'classicSrc/components/Widget'
import { TEST_IDS } from 'classicSrc/constants/shared'
import AverageWaitTime from 'classicSrc/embeds/talk/components/AverageWaitTime'
import PhoneNumber from 'classicSrc/embeds/talk/components/PhoneNumber'
import useGetTitle from 'classicSrc/embeds/talk/hooks/useGetTitle'
import { getAverageWaitTimeString, getTalkEmbeddableConfig } from 'classicSrc/embeds/talk/selectors'
import getFormattedPhoneNumber from 'classicSrc/embeds/talk/utils/getFormattedPhoneNumber'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Container, TalkIcon, Message, PhoneNumberContainer } from './styles'

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
  callUsMessage: PropTypes.string.isRequired,
}

const mapStateToProps = (state) => {
  return {
    callUsMessage: i18n.t('embeddable_framework.talk.phoneOnly.new_message'),
    averageWaitTime: getAverageWaitTimeString(state),
    phoneNumber: getTalkEmbeddableConfig(state).phoneNumber,
    formattedPhoneNumber: getFormattedPhoneNumber(getTalkEmbeddableConfig(state).phoneNumber),
  }
}

const connectedComponent = connect(mapStateToProps)(PhoneOnlyPage)

export { connectedComponent as default, PhoneOnlyPage as Component }
