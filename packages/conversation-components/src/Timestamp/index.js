import PropTypes from 'prop-types'
import { Container, Text } from './styles'

export const parseTimestamp = (timestamp, overrideDate = null) => {
  const currentDate = overrideDate ? new Date(overrideDate) : new Date()
  const messageDate = new Date(timestamp)

  const isToday =
    messageDate.getDate() === currentDate.getDate() &&
    messageDate.getMonth() === currentDate.getMonth() &&
    messageDate.getFullYear() === currentDate.getFullYear()

  return `${messageDate.toLocaleString(undefined, {
    ...(isToday ? {} : { month: 'long', day: 'numeric' }),
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  })}`
}

const Timestamp = ({ timestamp }) => {
  const text = parseTimestamp(timestamp)
  return (
    <Container>
      <Text>{text}</Text>
    </Container>
  )
}

Timestamp.propTypes = {
  timestamp: PropTypes.number
}

export default Timestamp
