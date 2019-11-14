import React from 'react'
import PropTypes from 'prop-types'
import HeaderContainer from 'components/Widget/Header/HeaderContainer'
import BackButton from 'components/Widget/Header/BackButton'
import Title from 'components/Widget/Header/Title'
import CloseButton from 'components/Widget/Header/CloseButton'
import TitleRow from 'components/Widget/Header/TitleRow'

const Header = ({ children, title, useReactRouter, showBackButton, showCloseButton }) => (
  <HeaderContainer>
    <TitleRow>
      {showBackButton && <BackButton useReactRouter={useReactRouter} />}
      <Title>{title}</Title>
      {showCloseButton && <CloseButton />}
    </TitleRow>
    {children}
  </HeaderContainer>
)

Header.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string.isRequired,
  useReactRouter: PropTypes.bool.isRequired,
  showBackButton: PropTypes.bool.isRequired,
  showCloseButton: PropTypes.bool.isRequired
}

Header.defaultProps = {
  title: '',
  useReactRouter: false,
  showTitle: true,
  showBackButton: true,
  showCloseButton: true
}

export default Header
