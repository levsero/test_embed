import PropTypes from 'prop-types'
import { useRef } from 'react'
import { connect } from 'react-redux'
import { useFocusJail } from '@zendeskgarden/container-focusjail'
import { KEY_CODES } from '@zendeskgarden/react-selection'
import { useCurrentFrame } from 'src/framework/components/Frame'
import { handleEscapeKeyPressed } from 'src/redux/modules/base'
import { focusLauncher } from 'src/util/globals'

const FocusJail = ({ name, handleEscapeKeyPressed, children, ...props }) => {
  const containerRef = useRef()
  const frame = useCurrentFrame()
  const { getContainerProps } = useFocusJail({
    focusOnMount: false,
    environment: frame.document,
    containerRef,
  })

  if (name === 'launcher') {
    return children
  }

  return (
    <div
      {...getContainerProps({
        ref: containerRef,
        onKeyDown: (evt) => {
          const { keyCode } = evt

          if (keyCode === KEY_CODES.ESCAPE) {
            focusLauncher()
            handleEscapeKeyPressed()
          }
        },
      })}
      {...props}
    >
      {children}
    </div>
  )
}

FocusJail.propTypes = {
  name: PropTypes.string,
  children: PropTypes.node,
  handleEscapeKeyPressed: PropTypes.func,
}

const mapDispatchToProps = {
  handleEscapeKeyPressed,
}

export default connect(undefined, mapDispatchToProps)(FocusJail)

export const Component = FocusJail
