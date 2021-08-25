import PropTypes from 'prop-types'
import { useRef } from 'react'
import PaperclipIcon from '@zendeskgarden/svg-icons/src/16/paperclip.svg'
import { Input, FileInputButton } from './styles'

const FileInput = ({ accept, onChange }) => {
  const fileInput = useRef(null)
  return (
    <>
      <FileInputButton onClick={() => fileInput.current.click()}>
        <PaperclipIcon />
      </FileInputButton>
      <Input type="file" ref={fileInput} accept={accept} multiple={true} onChange={onChange} />
    </>
  )
}

export default FileInput

FileInput.propTypes = {
  accept: PropTypes.string,
  onChange: PropTypes.func,
}
