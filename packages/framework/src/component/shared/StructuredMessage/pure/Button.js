import { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { KeyboardFocusButton } from 'component/shared/KeyboardFocusButton'

import { isMobileBrowser } from 'utility/devices'

import { locals as styles } from './Button.scss'

const isMobile = isMobileBrowser()

export class Button extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func,
  }

  render() {
    const buttonStyles = classNames(styles.button, {
      [styles.overwriteState]: isMobile,
    })

    return (
      <KeyboardFocusButton
        className={buttonStyles}
        onClick={this.props.onClick}
        title={this.props.label}
      >
        {this.props.label}
      </KeyboardFocusButton>
    )
  }
}
