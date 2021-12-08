import { i18n } from 'classicSrc/app/webWidget/services/i18n'
import PropTypes from 'prop-types'
import { Container, Paragraph, Title } from './styles'

const Message = ({ title, body }) => {
  return (
    <Container>
      <Title>{title}</Title>
      <Paragraph>{body}</Paragraph>
    </Container>
  )
}

Message.propTypes = {
  title: PropTypes.string,
  body: PropTypes.string,
}

const NoResultsMessage = ({ searchFailed, showNextButton, previousSearchTerm }) => {
  const title = searchFailed
    ? i18n.t('embeddable_framework.helpCenter.search.error.title')
    : i18n.t('embeddable_framework.helpCenter.search.noResults.title', {
        searchTerm: previousSearchTerm,
      })
  const body =
    searchFailed && showNextButton
      ? i18n.t('embeddable_framework.helpCenter.search.error.body')
      : i18n.t('embeddable_framework.helpCenter.search.noResults.body')

  return <Message title={title} body={body} />
}

NoResultsMessage.propTypes = {
  searchFailed: PropTypes.bool,
  showNextButton: PropTypes.bool,
  previousSearchTerm: PropTypes.string,
}

export default NoResultsMessage
