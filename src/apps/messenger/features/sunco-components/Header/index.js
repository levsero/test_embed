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

const Header = ({ title, description, avatar, showCloseButton, compact, onClose }) => {
  return (
    <Container compact={compact}>
      {avatar && (
        <Avatar isSystem={true} compact={compact}>
          <img src={avatar} alt={'company avatar'} />
        </Avatar>
      )}
      <Details>
        {title && <Title compact={compact}>{title}</Title>}
        {description && <Description compact={compact}>{description}</Description>}
      </Details>

      {showCloseButton && (
        <CloseIconContainer compact={compact}>
          <IconButton compact={compact} onClick={onClose} aria-label="Close messenger">
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
  compact: PropTypes.bool,
  onClose: PropTypes.func
}

Header.defaultProps = {
  description: '',
  avatar: '',
  showCloseButton: false,
  compact: false,
  onClose: () => {}
}

export default Header
