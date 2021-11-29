import PropTypes from 'prop-types'
import { useState } from 'react'
import Transition from 'react-transition-group/Transition'
import useLabels from 'src/hooks/useLabels'
import {
  DropzoneContainer,
  DropzoneActiveContainer,
  UploaderContainer,
  Text,
  UploadIcon,
} from './styles'

const Dropzone = ({ onDrop, forceDisplay, children }) => {
  const { fileUpload } = useLabels()
  const [dragCount, setDragCount] = useState(0)

  const isDragging = dragCount > 0

  const onDragEnter = () => {
    setDragCount((count) => count + 1)
  }

  const onDragLeave = () => {
    setDragCount((count) => Math.max(count - 1, 0))
  }

  const onDragOver = (e) => {
    e.preventDefault()
  }

  const onDragDrop = (e) => {
    e.preventDefault()
    setDragCount(0)
    onDrop(e.dataTransfer ? e.dataTransfer.files : e.target.files)
  }

  return (
    <DropzoneContainer
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      data-testid="dropzone-container"
    >
      <Transition
        appear={false}
        in={isDragging || forceDisplay}
        mountOnEnter={true}
        unmountOnExit={true}
        timeout={200}
      >
        {(state) => (
          <DropzoneActiveContainer state={state} onDrop={onDragDrop}>
            <UploaderContainer>
              <UploadIcon />
              <Text>{fileUpload.dragDropOverlayText}</Text>
            </UploaderContainer>
          </DropzoneActiveContainer>
        )}
      </Transition>
      {children}
    </DropzoneContainer>
  )
}

Dropzone.propTypes = {
  onDrop: PropTypes.func.isRequired,
  forceDisplay: PropTypes.bool,
  children: PropTypes.node,
}

Dropzone.defaultProps = {
  forceDisplay: false,
}

export default Dropzone
