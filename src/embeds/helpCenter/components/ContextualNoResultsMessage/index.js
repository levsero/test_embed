import React from 'react'
import { Container, Content } from './styles'
import { i18n } from 'service/i18n'

const ContextualNoResultsMessage = () => {
  return (
    <Container>
      <Content>{i18n.t('embeddable_framework.helpCenter.content.useSearchBar')}</Content>
    </Container>
  )
}

export default ContextualNoResultsMessage
