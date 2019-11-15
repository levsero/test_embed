import React from 'react'
import PropTypes from 'prop-types'
import HeaderView from 'components/Widget/Header/HeaderView'
import BackButton from 'components/Widget/Header/BackButton'
import Title from 'components/Widget/Header/Title'
import CloseButton from 'components/Widget/Header/CloseButton'
import TitleRow from 'components/Widget/Header/TitleRow'

const Header = ({ children, title, useReactRouter, showBackButton, showCloseButton }) => (
  <HeaderView>
    <TitleRow>
      {showBackButton && <BackButton useReactRouter={useReactRouter} />}
      <Title>{title}</Title>
      {showCloseButton && <CloseButton />}
    </TitleRow>
    {children}
  </HeaderView>
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
