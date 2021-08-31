import PropTypes from 'prop-types'
import { forwardRef } from 'react'
import Composer from 'src/Composer'
import useLabels from 'src/hooks/useLabels'
import FileInput from './FileInput'
import { Container } from './styles'

const MessengerFooter = forwardRef((props, ref) => {
  const labels = useLabels().fileUpload
  return (
    <Container>
      {props.isFileInputVisible && (
        <FileInput
          accept={props.allowedFileTypes}
          onChange={props.onFilesSelected}
          ariaLabel={labels.fileUploadButtonAriaLabel}
        />
      )}
      <Composer ref={ref} {...props} />
    </Container>
  )
})

MessengerFooter.propTypes = {
  ...Composer.propTypes,
  onFilesSelected: PropTypes.func,
  allowedFileTypes: PropTypes.string,
  isFileInputVisible: PropTypes.bool,
}

export default MessengerFooter
