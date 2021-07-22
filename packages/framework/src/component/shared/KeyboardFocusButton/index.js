import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { KeyboardFocusContainer } from '@zendeskgarden/react-selection'
import { locals as styles } from './KeyboardFocusButton.scss'

/**
 * An un-styled button component with keyboard navigation support.
 * When clicked, the button:
 * - will show focus ring (styled by the browser stylesheet) when focused using keyboard
 * - will not show focus ring when focused due to mouse click
 */
export class KeyboardFocusButton extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func,
    title: PropTypes.string,
  }

  render() {
    return (
      <KeyboardFocusContainer>
        {({ keyboardFocused, getFocusProps }) => {
          const buttonStyles = classNames(styles.button, this.props.className, {
            [styles.keyboardFocus]: keyboardFocused,
          })

          return (
            <button
              {...getFocusProps({
                className: buttonStyles,
                onClick: this.props.onClick,
                title: this.props.title,
              })}
            >
              {this.props.children}
            </button>
          )
        }}
      </KeyboardFocusContainer>
    )
  }
}
