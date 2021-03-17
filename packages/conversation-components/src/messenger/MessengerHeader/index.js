import PropTypes from 'prop-types'
import { CompactContainer, Container } from './styles'
import Content from 'src/messenger/MessengerHeader/Content'
import Close from 'src/messenger/MessengerHeader/Close'
import Menu from 'src/messenger/MessengerHeader/Menu'

const MessengerHeader = ({ children, isCompact }) => {
  return <Container as={isCompact ? CompactContainer : Container}>{children}</Container>
}

MessengerHeader.propTypes = {
  children: PropTypes.node,
  isCompact: PropTypes.bool,
}

MessengerHeader.Content = Content
MessengerHeader.Close = Close
MessengerHeader.Menu = Menu

export default MessengerHeader
