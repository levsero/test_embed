import React from 'react'
import PropTypes from 'prop-types'

import { TEST_IDS } from 'src/constants/shared'

import { OfflineGreetingLink } from './styles'

const OfflineGreeting = ({ greeting }) => (
  <OfflineGreetingLink properties={{ target: '_blank' }}>
    <span data-testid={TEST_IDS.FORM_GREETING_MSG}>{greeting}</span>
  </OfflineGreetingLink>
)

OfflineGreeting.propTypes = {
  greeting: PropTypes.string
}

export default OfflineGreeting
