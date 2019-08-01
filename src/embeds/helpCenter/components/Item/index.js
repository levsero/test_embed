import React, { PureComponent } from 'react'
import { locals as styles } from './styles.scss'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export default class Item extends PureComponent {
  static propTypes = {
    isMobile: PropTypes.bool,
    article: PropTypes.object,
    onClick: PropTypes.func
  }

  focus() {
    this.link.focus()
  }

  render() {
    const { isMobile, article, onClick } = this.props
    const classes = classNames(styles.item, { [styles.itemMobile]: isMobile })
    return (
      <li className={classes}>
        <a
          ref={el => (this.link = el)}
          href={article.html_url}
          target="_blank"
          onClick={onClick}
          className={styles.link}
        >
          {article.title || article.name}
        </a>
      </li>
    )
  }
}
