import PropTypes from 'prop-types'
import { forwardRef } from 'react'
import { LAUNCHER_SHAPES, LAUNCHER_POSITION } from 'src/constants'
import useLabels from 'src/hooks/useLabels'
import LauncherIcon from './LauncherIcon'
import { Container, Button } from './styles'

const Launcher = forwardRef(({ shape, isOpen, onClick, position, size }, ref) => {
  const { launcher } = useLabels()

  return (
    <Container
      ref={ref}
      size={size}
      shape={shape}
      onKeyDown={() => {
        // The focus jail does not pick up onKeyDown if not used at least once.
      }}
    >
      <Button shape={shape} onClick={onClick} aria-label={launcher.ariaLabel} isPill={false}>
        <LauncherIcon isOpen={isOpen} position={position} />
      </Button>
    </Container>
  )
})

Launcher.propTypes = {
  shape: PropTypes.oneOf(Object.keys(LAUNCHER_SHAPES)),
  isOpen: PropTypes.bool,
  onClick: PropTypes.func,
  position: PropTypes.oneOf(LAUNCHER_POSITION),
  size: PropTypes.string,
}

Launcher.defaultProps = {
  size: '64px',
}

export default Launcher
