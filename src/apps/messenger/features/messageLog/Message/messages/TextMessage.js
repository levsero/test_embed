import React from 'react'
import PropTypes from 'prop-types'
import Text from 'src/apps/messenger/features/sunco-components/Text'

const TextMessage = ({ message: { role, text, isFirstInGroup, isLastInGroup } }) => {
  return (
    <Text isFirstInGroup={isFirstInGroup} isLastInGroup={isLastInGroup} text={text} role={role} />
  )
}

TextMessage.propTypes = {
  message: PropTypes.shape({
    role: PropTypes.string,
    text: PropTypes.string,
    isFirstInGroup: PropTypes.bool,
    isLastInGroup: PropTypes.bool
  })
}

export default TextMessage
