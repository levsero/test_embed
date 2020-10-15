import React from 'react'
import PropTypes from 'prop-types'
import { Container, Image } from './styles'

const Avatar = ({ src }) => {
  return src ? (
    <Container isSquare={true}>
      <Image src={src} />
    </Container>
  ) : (
    <Container as="div" />
  )
}

Avatar.propTypes = {
  src: PropTypes.string
}

export default Avatar
