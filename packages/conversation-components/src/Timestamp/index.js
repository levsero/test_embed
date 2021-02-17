import PropTypes from 'prop-types'
import { Container, Text } from './styles'
import useLabels from 'src/hooks/useLabels'

const Timestamp = ({ timestamp }) => {
  const { formatTimestamp } = useLabels()
  const text = formatTimestamp(timestamp)
  return (
    <Container>
      <Text>{text}</Text>
    </Container>
  )
}

Timestamp.propTypes = {
  timestamp: PropTypes.number,
}

export default Timestamp
