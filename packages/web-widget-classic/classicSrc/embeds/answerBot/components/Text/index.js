import { TEST_IDS } from 'classicSrc/constants/shared'
import PropTypes from 'prop-types'
import { Container, Bubble } from './styles'

const Text = (props) => {
  const { isVisitor, message } = props

  return (
    <Container isVisitor={isVisitor}>
      <Bubble
        isVisitor={isVisitor}
        message={message}
        data-testid={isVisitor ? TEST_IDS.CHAT_MSG_USER : TEST_IDS.CHAT_MSG_ANSWER_BOT}
      />
    </Container>
  )
}

Text.propTypes = {
  isVisitor: PropTypes.bool.isRequired,
  message: PropTypes.string,
}

Text.defaultProps = {
  message: '',
}

export default Text
