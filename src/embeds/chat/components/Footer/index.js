import React from 'react'
import PropTypes from 'prop-types'
import { Footer } from 'src/components/Widget'
import { Button } from '@zendeskgarden/react-buttons'
import { TEST_IDS } from 'src/constants/shared'

const ChatFooter = ({ onClick, label }) => {
  return (
    <Footer>
      <Button primary={true} onClick={onClick} type="submit" data-testid={TEST_IDS.CHAT_START}>
        {label}
      </Button>
    </Footer>
  )
}

ChatFooter.propTypes = {
  onClick: PropTypes.func,
  label: PropTypes.string
}

ChatFooter.defaultProps = {
  onClick: () => {},
  label: ''
}

export default ChatFooter
