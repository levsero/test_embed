import PropTypes from 'prop-types'

import { Container, Text } from './styles'

const Timestamp = ({ text }) => {
  return (
    <Container>
      <Text>{text}</Text>
    </Container>
  )
}

Timestamp.propTypes = {
  text: PropTypes.string
}

export default Timestamp
