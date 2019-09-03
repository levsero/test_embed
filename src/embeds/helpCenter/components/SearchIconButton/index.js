import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { locals as styles } from './styles.scss'

import SearchIcon from 'embeds/helpCenter/icons/search.svg'
import classNames from 'classnames'
import { triggerOnEnter } from 'utility/keyboard'

export default class SearchIconButton extends Component {
  static propTypes = {
    focused: PropTypes.bool,
    isMobile: PropTypes.bool,
    onClick: PropTypes.func
  }

  static defaultProps = {
    focused: false,
    isMobile: false,
    onClick: () => {}
  }

  render = () => {
    const buttonStyles = classNames(styles.icon, {
      [styles.focused]: this.props.focused && !this.props.isMobile,
      [styles.notFocused]: !this.props.isMobile
    })

    return (
      <span
        tabIndex={0}
        role="button"
        onClick={this.props.onClick}
        data-testid="Icon--search"
        className={buttonStyles}
        onKeyDown={triggerOnEnter(this.props.onClick)}
      >
        <SearchIcon />
      </span>
    )
  }
}
