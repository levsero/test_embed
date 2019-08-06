import React from 'react'
import { locals as styles } from './styles.scss'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const Item = React.forwardRef(({ isMobile, article, onClick }, ref) => {
  const classes = classNames(styles.item, { [styles.itemMobile]: isMobile })
  return (
    <li className={classes}>
      <a
        ref={ref}
        href={article.html_url}
        target="_blank"
        onClick={onClick}
        className={styles.link}
      >
        {article.title || article.name}
      </a>
    </li>
  )
})

Item.propTypes = {
  isMobile: PropTypes.bool,
  article: PropTypes.object,
  onClick: PropTypes.func
}

export default Item
