import { TEST_IDS } from 'classicSrc/constants/shared'
import { Container, Loader } from './styles'

const BotTyping = () => (
  <Container data-testid={TEST_IDS.AB_TYPING_INDICATOR}>
    <Loader useUserColor={false} />
  </Container>
)

export default BotTyping
