import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { TEST_IDS } from 'src/constants/shared'

const AttachmentInput = ({ className, onFileSelect, dropzoneId, children }) => {
  const inputRef = useRef(null)
  const onChange = e => {
    e.preventDefault()

    onFileSelect(e.target.files)
  }

  const onClick = () => {
    inputRef.current.value = null
    inputRef.current.click()
  }

  const dropzoneClasses = `${className}`
  const inputStyle = { display: 'none' }

  return (
    <div
      data-testid={TEST_IDS.DROPZONE}
      role="presentation"
      onClick={onClick}
      className={dropzoneClasses}
    >
      {children}
      <input
        type="file"
        style={inputStyle}
        multiple={true}
        ref={inputRef}
        onChange={onChange}
        id={dropzoneId}
        data-testid={dropzoneId}
      />
    </div>
  )
}

AttachmentInput.propTypes = {
  className: PropTypes.string.isRequired,
  onFileSelect: PropTypes.func.isRequired,
  dropzoneId: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}

export default AttachmentInput
