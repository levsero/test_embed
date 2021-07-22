import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { isMobileBrowser } from 'utility/devices'
import { locals as styles } from './ButtonList.scss'

const isMobile = isMobileBrowser()

export class ButtonList extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  render() {
    const buttonItemStyles = classNames(styles.buttonItem, {
      [styles.overwriteState]: isMobile,
    })

    return (
      <ul className={styles.buttonList}>
        {this.props.children.map((child, idx) => {
          return (
            <li key={idx} className={buttonItemStyles}>
              {child}
            </li>
          )
        })}
      </ul>
    )
  }
}
