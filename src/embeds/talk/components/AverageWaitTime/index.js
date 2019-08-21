import PropTypes from 'prop-types'
import styled from 'styled-components'

import { FONT_SIZE } from 'constants/shared'

const AverageWaitTime = styled.p`
  margin-bottom: ${15 / FONT_SIZE}rem;
`

AverageWaitTime.propTypes = {
  children: PropTypes.string
}

export default AverageWaitTime
