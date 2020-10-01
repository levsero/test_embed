import React from 'react'
import PropTypes from 'prop-types'
import Timestamp from 'src/apps/messenger/features/sunco-components/Timestamp'

function formatAMPM(date) {
  let hours = date.getHours()
  let minutes = date.getMinutes()
  let ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes
  return hours + ':' + minutes + ' ' + ampm
}

export const parseTimestamp = (received, overrideDate = null) => {
  const currentDate = overrideDate ? new Date(overrideDate) : new Date()
  const messageDate = new Date(received)

  const isToday =
    messageDate.getDate() === currentDate.getDate() &&
    messageDate.getMonth() === currentDate.getMonth() &&
    messageDate.getFullYear() === currentDate.getFullYear()

  const dateString = `${messageDate.toLocaleString('default', {
    month: 'long'
  })} ${messageDate.getDate()}, `

  return `${isToday ? '' : dateString}${formatAMPM(messageDate)}`
}

const TimestampStructuredMessage = ({ message: { received } }) => {
  const text = parseTimestamp(received)
  return <Timestamp text={text} />
}

TimestampStructuredMessage.propTypes = {
  message: PropTypes.shape({
    received: PropTypes.number
  })
}

export default TimestampStructuredMessage
