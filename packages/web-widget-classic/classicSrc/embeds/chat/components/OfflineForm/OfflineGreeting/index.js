import { TEST_IDS } from 'classicSrc/constants/shared'
import PropTypes from 'prop-types'
import { OfflineGreetingLink } from './styles'

const OfflineGreeting = ({ greeting }) => (
  <OfflineGreetingLink properties={{ target: '_blank' }}>
    <span data-testid={TEST_IDS.FORM_GREETING_MSG}>{greeting}</span>
  </OfflineGreetingLink>
)

OfflineGreeting.propTypes = {
  greeting: PropTypes.string,
}

export default OfflineGreeting
