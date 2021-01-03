import PropTypes from 'prop-types'

import { Container, Text } from './styles'

function formatAMPM(date) {
  let hours = date.getHours()
  let minutes = date.getMinutes()
  let ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes
  return hours + ':' + minutes + ' ' + ampm
}

export const parseTimestamp = (millisecondsSinceEpoch, overrideDate = null) => {
  const currentDate = overrideDate ? new Date(overrideDate) : new Date()
  const messageDate = new Date(millisecondsSinceEpoch)

  const isToday =
    messageDate.getDate() === currentDate.getDate() &&
    messageDate.getMonth() === currentDate.getMonth() &&
    messageDate.getFullYear() === currentDate.getFullYear()

  const dateString = `${messageDate.toLocaleString(undefined, {
    month: 'long'
  })} ${messageDate.getDate()}, `

  return `${isToday ? '' : dateString}${formatAMPM(messageDate)}`
}

const Timestamp = ({ millisecondsSinceEpoch }) => {
  const text = parseTimestamp(millisecondsSinceEpoch)
  return (
    <Container>
      <Text>{text}</Text>
    </Container>
  )
}

Timestamp.propTypes = {
  millisecondsSinceEpoch: PropTypes.number
}

export default Timestamp
