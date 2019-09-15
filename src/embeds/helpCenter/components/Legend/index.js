import React from 'react'
import PropTypes from 'prop-types'
import { Container, Content } from './styles'

import { i18n } from 'service/i18n'

const Legend = ({ hasContextuallySearched }) => {
  const message = hasContextuallySearched
    ? i18n.t('embeddable_framework.helpCenter.label.topSuggestions')
    : i18n.t('embeddable_framework.helpCenter.label.results')
  return (
    <Container>
      <Content>{message}</Content>
    </Container>
  )
}

Legend.propTypes = {
  hasContextuallySearched: PropTypes.bool
}

export default Legend
