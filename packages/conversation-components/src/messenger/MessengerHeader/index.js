import PropTypes from 'prop-types'
import { CompactContainer, Container } from './styles'
import Content from 'src/messenger/MessengerHeader/Content'
import Close from 'src/messenger/MessengerHeader/Close'

const MessengerHeader = ({ children, isCompact }) => {
  return <Container as={isCompact ? CompactContainer : Container}>{children}</Container>
}

MessengerHeader.propTypes = {
  children: PropTypes.node,
  isCompact: PropTypes.bool,
}

export default MessengerHeader

MessengerHeader.Content = Content
MessengerHeader.Close = Close
