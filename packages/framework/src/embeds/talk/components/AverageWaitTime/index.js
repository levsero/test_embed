import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FONT_SIZE } from 'src/constants/shared'
import { TEST_IDS } from 'src/constants/shared'

const AverageWaitTime = styled.p.attrs(() => ({ testId: TEST_IDS.TALK_AVG_WAIT_TIME }))`
  margin-bottom: ${15 / FONT_SIZE}rem;
  data-testid: ${(props) => props.testId};
`

AverageWaitTime.propTypes = {
  children: PropTypes.string,
}

export default AverageWaitTime
