import PropTypes from 'prop-types'
import { useRef } from 'react'
import PaperclipIcon from '@zendeskgarden/svg-icons/src/16/paperclip.svg'
import IconButton from 'src/IconButton'
import { Input } from './styles'

const FileInput = ({ accept, onChange }) => {
  const fileInput = useRef(null)
  return (
    <>
      <IconButton onClick={() => fileInput.current.click()}>
        <PaperclipIcon />
      </IconButton>
      <Input type="file" ref={fileInput} accept={accept} multiple={true} onChange={onChange} />
    </>
  )
}

export default FileInput

FileInput.propTypes = {
  accept: PropTypes.string,
  onChange: PropTypes.func,
}
