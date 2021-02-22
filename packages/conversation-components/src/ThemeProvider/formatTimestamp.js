const formatTimestamp = (timestamp) => {
  const currentDate = new Date()
  const messageDate = new Date(timestamp)

  const isToday =
    messageDate.getDate() === currentDate.getDate() &&
    messageDate.getMonth() === currentDate.getMonth() &&
    messageDate.getFullYear() === currentDate.getFullYear()

  return `${messageDate.toLocaleString('en-US', {
    ...(isToday ? {} : { month: 'long', day: 'numeric' }),
    hour: 'numeric',
    minute: 'numeric',
  })}`
}

export default formatTimestamp
