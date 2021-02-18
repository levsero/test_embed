import { forwardRef } from 'react'
import PropTypes from 'prop-types'
import useLabels from 'src/hooks/useLabels'
import LauncherIcon from './LauncherIcon'
import { Container, Button } from './styles'

const SquareLauncher = forwardRef(({ isOpen, onClick, position, size }, ref) => {
  const { launcher } = useLabels()

  return (
    <Container
      ref={ref}
      size={size}
      onKeyDown={() => {
        // The focus jail does not pick up onKeyDown if not used at least once.
      }}
    >
      <Button onClick={onClick} aria-label={launcher.ariaLabel} isPill={false}>
        <LauncherIcon isOpen={isOpen} position={position} />
      </Button>
    </Container>
  )
})

SquareLauncher.propTypes = {
  isOpen: PropTypes.bool,
  onClick: PropTypes.func,
  position: PropTypes.oneOf(['left', 'right']),
  size: PropTypes.string,
}

SquareLauncher.defaultProps = {
  size: '64px',
}

export default SquareLauncher
