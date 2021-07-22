import PropTypes from 'prop-types'
import LoadingButton from 'embeds/talk/components/LoadingButton'
import useTranslate from 'src/hooks/useTranslate'
import { Container, Heading, Message, SectionContainer } from './styles'

const NetworkError = ({ onClick, isLoading = false }) => {
  const translate = useTranslate()

  return (
    <Container>
      <SectionContainer>
        <Heading>{translate('embeddable_framework.talk.embeddedVoice.networkError.title')}</Heading>
        <Message>
          {translate('embeddable_framework.talk.embeddedVoice.networkError.message')}
        </Message>
      </SectionContainer>
      <SectionContainer>
        <LoadingButton
          onClick={onClick}
          isLoading={isLoading}
          isPrimary={true}
          label={translate('embeddable_framework.talk.embeddedVoice.button.tryAgain')}
        />
      </SectionContainer>
    </Container>
  )
}

NetworkError.propTypes = {
  onClick: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
}

export default NetworkError
