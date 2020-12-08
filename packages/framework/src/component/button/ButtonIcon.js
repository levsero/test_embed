import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Icon } from 'component/Icon'
import { TEST_IDS } from 'src/constants/shared'

import { locals as styles } from './ButtonIcon.scss'

export class ButtonIcon extends Component {
  static propTypes = {
    actionable: PropTypes.bool,
    containerStyles: PropTypes.string,
    labelClassName: PropTypes.string,
    icon: PropTypes.string,
    iconClasses: PropTypes.string,
    label: PropTypes.node,
    onClick: PropTypes.func,
    flipX: PropTypes.bool
  }

  static defaultProps = {
    actionable: true,
    containerStyles: '',
    labelClassName: '',
    icon: '',
    iconClasses: '',
    label: null,
    onClick: () => {},
    flipX: false
  }

  handleOnClick = () => {
    if (this.props.actionable) {
      this.props.onClick()
    }
  }

  render = () => {
    const { actionable, containerStyles, labelClassName, icon, label, flipX } = this.props
    const actionableStyles = actionable ? styles.containerActionable : ''
    const buttonClasses = `
      ${styles.container}
      ${containerStyles}
      ${actionableStyles}
      ${this.props.icon}
    `

    return (
      <button className={buttonClasses} onClick={this.handleOnClick}>
        <Icon className={`${styles.icon} ${this.props.iconClasses}`} flipX={flipX} type={icon} />
        <span className={`${styles.label} ${labelClassName}`} data-testid={TEST_IDS.LABEL}>
          {label}
        </span>
      </button>
    )
  }
}
