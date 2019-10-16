import React from 'react'
import PropTypes from 'prop-types'
import { Container } from './styles'
import BackButton from 'components/Widget/Header/BackButton'
import Title from 'components/Widget/Header/Title'
import CloseButton from 'components/Widget/Header/CloseButton'
import TitleRow from 'components/Widget/Header/TitleRow'

const Header = ({ children, title, useReactRouter = false }) => {
  if (title !== undefined) {
    return (
      <Container>
        <TitleRow>
          <BackButton useReactRouter={useReactRouter} />
          <Title>{title}</Title>
          <CloseButton />
        </TitleRow>
        {children}
      </Container>
    )
  }

  return <Container>{children}</Container>
}

Header.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  useReactRouter: PropTypes.bool
}

export default Header
