import React from 'react'
import PropTypes from 'prop-types'
import { Container } from './styles'

const Widget = ({ children }) => <Container>{children}</Container>

Widget.propTypes = {
  children: PropTypes.node
}

export default Widget
