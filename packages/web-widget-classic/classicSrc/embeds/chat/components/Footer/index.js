import { Footer } from 'classicSrc/components/Widget'
import { TEST_IDS } from 'classicSrc/constants/shared'
import PropTypes from 'prop-types'
import { Button } from '@zendeskgarden/react-buttons'

const ChatFooter = ({ onClick, label, hideButton }) => {
  return (
    <Footer>
      {!hideButton && (
        <Button isPrimary={true} onClick={onClick} type="submit" data-testid={TEST_IDS.CHAT_START}>
          {label}
        </Button>
      )}
    </Footer>
  )
}

ChatFooter.propTypes = {
  onClick: PropTypes.func,
  label: PropTypes.string,
  hideButton: PropTypes.bool,
}

ChatFooter.defaultProps = {
  onClick: () => {},
  label: '',
  hideButton: false,
}

export default ChatFooter
