import React from 'react'
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

const Header = ({ title, description, avatar, showCloseButton, isCompact, onClose }) => {
  return (
    <Container isCompact={isCompact}>
      {avatar && (
        <Avatar isSystem={true} isCompact={isCompact}>
          <img src={avatar} alt={'company avatar'} />
        </Avatar>
      )}
      <Details>
        {title && <Title isCompact={isCompact}>{title}</Title>}
        {description && <Description isCompact={isCompact}>{description}</Description>}
      </Details>

      {showCloseButton && (
        <CloseIconContainer isCompact={isCompact}>
          <IconButton isCompact={isCompact} onClick={onClose} aria-label="Close messenger">
            <CloseIcon />
          </IconButton>
        </CloseIconContainer>
      )}
    </Container>
  )
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  avatar: PropTypes.string,
  showCloseButton: PropTypes.bool,
  isCompact: PropTypes.bool,
  onClose: PropTypes.func
}

Header.defaultProps = {
  description: '',
  avatar: '',
  showCloseButton: false,
  isCompact: false,
  onClose: () => {}
}

export default Header
