import React from 'react'

import { Container, Loader } from './styles'
import { TEST_IDS } from 'constants/shared'

const BotTyping = () => (
  <Container data-testid={TEST_IDS.AB_TYPING_INDICATOR}>
    <Loader useUserColor={false} />
  </Container>
)

export default BotTyping
