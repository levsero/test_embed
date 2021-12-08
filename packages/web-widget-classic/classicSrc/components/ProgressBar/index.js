import { TEST_IDS } from 'classicSrc/constants/shared'
import PropTypes from 'prop-types'
import { Container, Progress } from './styles'

const ProgressBar = ({ percentLoaded = 0, fakeProgress = false }) => {
  return (
    <Container>
      <Progress
        fakeProgress={fakeProgress}
        percentLoaded={`${Math.floor(percentLoaded)}%`}
        data-testid={TEST_IDS.PROGRESS_BAR}
      />
    </Container>
  )
}

ProgressBar.propTypes = {
  percentLoaded: PropTypes.number,
  fakeProgress: PropTypes.bool,
}

export default ProgressBar
