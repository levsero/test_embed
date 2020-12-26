import PropTypes from 'prop-types'
import {
  Title,
  Description,
  Container,
  Details,
  Avatar,
  IconButton,
  CloseIcon,
  CloseIconContainer
} from './styles'

const MessengerHeader = ({
  title,
  description = '',
  avatar = '',
  avatarAltTag = 'Company avatar',
  showCloseButton = false,
  closeButtonAriaLabel = 'Close messenger',
  isCompact = false,
  onClose = () => {}
}) => {
  return (
    <Container isCompact={isCompact}>
      {avatar && (
        <Avatar isSystem={true} isCompact={isCompact}>
          <img src={avatar} alt={avatarAltTag} />
        </Avatar>
      )}
      <Details>
        {title && <Title isCompact={isCompact}>{title}</Title>}
        {description && <Description isCompact={isCompact}>{description}</Description>}
      </Details>

      {showCloseButton && (
        <CloseIconContainer isCompact={isCompact}>
          <IconButton isCompact={isCompact} onClick={onClose} aria-label={closeButtonAriaLabel}>
            <CloseIcon />
          </IconButton>
        </CloseIconContainer>
      )}
    </Container>
  )
}

MessengerHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  avatar: PropTypes.string,
  avatarAltTag: PropTypes.string,
  showCloseButton: PropTypes.bool,
  closeButtonAriaLabel: PropTypes.string,
  isCompact: PropTypes.bool,
  onClose: PropTypes.func
}

export default MessengerHeader
