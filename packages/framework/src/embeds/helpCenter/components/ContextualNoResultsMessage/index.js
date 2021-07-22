import useTranslate from 'src/hooks/useTranslate'
import { Container, Content } from './styles'

const ContextualNoResultsMessage = () => {
  const translate = useTranslate()

  return (
    <Container>
      <Content>{translate('embeddable_framework.helpCenter.content.useSearchBar')}</Content>
    </Container>
  )
}

export default ContextualNoResultsMessage
