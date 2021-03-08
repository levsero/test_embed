import PropTypes from 'prop-types'

import useLabels from 'src/hooks/useLabels'

import { CloseButton, CloseIcon, Content, Label, Tail, TriangleShadow } from './styles'

const LauncherLabel = ({ onCloseClick, onLabelClick, position, text }) => {
  const { launcherLabel } = useLabels()

  return (
    <Content position={position}>
      <CloseButton
        onClick={onCloseClick}
        tabIndex={position === 'right' ? 1 : 2}
        position={position}
        aria-label={launcherLabel.ariaLabel}
      >
        <CloseIcon />
      </CloseButton>
      <Label onClick={onLabelClick} tabIndex={position === 'left' ? 1 : 2}>
        {text}
        <TriangleShadow position={position} />
        <Tail position={position} />
      </Label>
    </Content>
  )
}

LauncherLabel.propTypes = {
  onCloseClick: PropTypes.func,
  onLabelClick: PropTypes.func,
  position: PropTypes.string,
  text: PropTypes.string,
}

export default LauncherLabel
