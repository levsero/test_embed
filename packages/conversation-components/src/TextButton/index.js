import PropTypes from 'prop-types'
import { Anchor, Button } from './styles'

const TextButton = ({ href, ...props }) => {
  if (href) {
    return <Anchor href={href} {...props} />
  }

  return <Button {...props} />
}

TextButton.propTypes = {
  href: PropTypes.string,
}

export default TextButton
