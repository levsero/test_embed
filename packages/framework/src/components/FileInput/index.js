import PropTypes from 'prop-types'
import { Children, cloneElement, useRef } from 'react'
import { TEST_IDS } from 'constants/shared'
import { HiddenInput } from './styles'

// FileInput allows you to provide your own button-like component that will trigger a hidden input element onClick.
const FileInput = ({ onFileSelect, children, ...props }) => {
  const input = useRef(null)

  const handleClick = () => {
    input.current.value = null
    input.current.click()
  }

  const handleFileSelect = (e) => {
    e.preventDefault()
    onFileSelect(e.target.files)
  }

  const triggerButton = Children.only(children)

  return (
    <>
      {cloneElement(triggerButton, {
        onClick: handleClick,
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
  children: PropTypes.element.isRequired,
}

export default FileInput
