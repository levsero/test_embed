import React from 'react'
import PropTypes from 'prop-types'
import { FocusJailContainer } from '@zendeskgarden/react-modals'
import { KEY_CODES } from '@zendeskgarden/react-selection'
import { focusLauncher } from 'utility/globals'
import { handleEscapeKeyPressed } from 'src/redux/modules/base'
import { connect } from 'react-redux'

const FocusJail = ({ name, handleEscapeKeyPressed, children, ...props }) => {
  if (name === 'launcher') {
    return children
  }

  return (
    <FocusJailContainer focusOnMount={false}>
      {({ getContainerProps, containerRef }) => (
        <div
          {...getContainerProps({
            ref: containerRef,
            onKeyDown: evt => {
              const { keyCode } = evt

              if (keyCode === KEY_CODES.ESCAPE) {
                focusLauncher()
                handleEscapeKeyPressed()
              }
            }
          })}
          {...props}
        >
          {children}
        </div>
      )}
    </FocusJailContainer>
  )
}

FocusJail.propTypes = {
  name: PropTypes.string,
  children: PropTypes.node,
  handleEscapeKeyPressed: PropTypes.func
}

const mapDispatchToProps = {
  handleEscapeKeyPressed
}

export default connect(
  undefined,
  mapDispatchToProps
)(FocusJail)

export const Component = FocusJail
