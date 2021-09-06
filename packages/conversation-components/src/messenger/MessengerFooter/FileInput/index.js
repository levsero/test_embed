import PropTypes from 'prop-types'
import { useRef } from 'react'
import PaperclipIcon from '@zendeskgarden/svg-icons/src/16/paperclip.svg'
import { Input, FileInputButton as IconButton } from './styles'

const FileInput = ({ accept, onChange, ariaLabel }) => {
  const fileInput = useRef(null)
  return (
    <>
      <IconButton
        buttonSize="xl"
        iconSize="attachmentButton"
        aria-label={ariaLabel}
        onClick={() => {
          fileInput.current.value = null
          fileInput.current.click()
        }}
      >
        <PaperclipIcon />
      </IconButton>
      <Input
        type="file"
        ref={fileInput}
        accept={accept}
        multiple={true}
        onChange={(e) => {
          onChange(e.target.files)
        }}
      />
    </>
  )
}

export default FileInput

FileInput.propTypes = {
  accept: PropTypes.string,
  onChange: PropTypes.func,
  ariaLabel: PropTypes.string,
}
