import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { HiddenInput } from './styles'
import { TEST_IDS } from 'constants/shared'

// FileInput allows you to provide your own button-like component that will trigger a hidden input element onClick.
const FileInput = ({ onFileSelect, children, ...props }) => {
  const input = useRef(null)

  const handleClick = () => {
    input.current.value = null
    input.current.click()
  }

  const handleFileSelect = e => {
    e.preventDefault()
    onFileSelect(e.target.files)
  }

  const triggerButton = React.Children.only(children)

  return (
    <>
      {React.cloneElement(triggerButton, {
        onClick: handleClick
      })}
      <HiddenInput
        type="file"
        multiple={true}
        ref={input}
        onChange={handleFileSelect}
        data-testid={TEST_IDS.FILE_INPUT}
        {...props}
      />
    </>
  )
}

FileInput.propTypes = {
  onFileSelect: PropTypes.func,
  children: PropTypes.element.isRequired
}

export default FileInput