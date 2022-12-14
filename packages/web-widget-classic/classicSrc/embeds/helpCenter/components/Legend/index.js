import useTranslate from 'classicSrc/hooks/useTranslate'
import PropTypes from 'prop-types'
import { Container, Content } from './styles'

const Legend = ({ hasContextuallySearched }) => {
  const translate = useTranslate()
  const message = hasContextuallySearched
    ? translate('embeddable_framework.helpCenter.label.topSuggestions')
    : translate('embeddable_framework.helpCenter.label.results')
  return (
    <Container>
      <Content>{message}</Content>
    </Container>
  )
}

Legend.propTypes = {
  hasContextuallySearched: PropTypes.bool,
}

export default Legend
