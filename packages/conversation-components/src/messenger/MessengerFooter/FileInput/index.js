import PropTypes from 'prop-types'
import { useRef, useEffect } from 'react'
import PaperclipIcon from '@zendeskgarden/svg-icons/src/16/paperclip.svg'
import { Input } from './styles'

const FileInput = ({ accept, onChange }) => {
  const fileInput = useRef(null)
  useEffect(() => {
    console.log(fileInput)
  }, [])
  return (
    <>
      <button onClick={() => fileInput.current.click()}>
        <PaperclipIcon />
      </button>
      <Input type="file" ref={fileInput} accept={accept} multiple={true} onChange={onChange} />
    </>
  )
}

export default FileInput

FileInput.propTypes = {
  accept: PropTypes.string,
  onChange: PropTypes.func,
}
