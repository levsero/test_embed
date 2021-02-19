import { Container, Content } from './styles'
import useTranslate from 'src/hooks/useTranslate'

const ContextualNoResultsMessage = () => {
  const translate = useTranslate()

  return (
    <Container>
      <Content>{translate('embeddable_framework.helpCenter.content.useSearchBar')}</Content>
    </Container>
  )
}

export default ContextualNoResultsMessage
