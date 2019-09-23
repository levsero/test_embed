import React from 'react'
import { locals as styles } from './styles.scss'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { TEST_IDS } from 'src/constants/shared'

const Item = React.forwardRef(({ isMobile, article, onClick }, ref) => {
  const classes = classNames(styles.item, { [styles.itemMobile]: isMobile })
  return (
    <li className={classes} data-testid={TEST_IDS.HC_RESULT_ITEM}>
      <a
        ref={ref}
        href={article.html_url}
        target="_blank"
        onClick={onClick}
        className={styles.link}
        data-testid={TEST_IDS.HC_RESULT_TITLE}
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
