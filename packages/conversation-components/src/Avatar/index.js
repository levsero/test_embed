import PropTypes from 'prop-types'
import { Container, Image } from './styles'

const Avatar = ({ src, alt }) => {
  return src ? (
    <Container isSquare={true}>
      <Image src={src} alt={alt} />
    </Container>
  ) : (
    <Container as="div" />
  )
}

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
}

export default Avatar
