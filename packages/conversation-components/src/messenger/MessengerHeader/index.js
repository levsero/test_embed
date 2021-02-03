import useLabels from 'src/hooks/useLabels'
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
  showCloseButton = false,
  isCompact = false,
  onClose = () => {}
}) => {
  const labels = useLabels().messengerHeader
  return (
    <Container isCompact={isCompact}>
      {avatar && (
        <Avatar isSystem={true} isCompact={isCompact}>
          <img src={avatar} alt={labels.avatarAltTag} />
        </Avatar>
      )}
      <Details>
        {title && <Title isCompact={isCompact}>{title}</Title>}
        {description && <Description isCompact={isCompact}>{description}</Description>}
      </Details>

      {showCloseButton && (
        <CloseIconContainer isCompact={isCompact}>
          <IconButton
            isCompact={isCompact}
            onClick={onClose}
            aria-label={labels.closeButtonAriaLabel}
          >
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
  showCloseButton: PropTypes.bool,
  isCompact: PropTypes.bool,
  onClose: PropTypes.func
}

export default MessengerHeader
