import React from 'react'
import PropTypes from 'prop-types'
import { TEST_IDS } from 'src/constants/shared'
import { ListItem, Link } from './styles'

const Item = React.forwardRef(({ article, onClick }, ref) => {
  return (
    <ListItem data-testid={TEST_IDS.HC_RESULT_ITEM}>
      <Link
        ref={ref}
        href={article.html_url}
        target="_blank"
        onClick={onClick}
        data-testid={TEST_IDS.HC_RESULT_TITLE}
      >
        {article.title || article.name}
      </Link>
    </ListItem>
  )
})

Item.propTypes = {
  article: PropTypes.object,
  onClick: PropTypes.func
}

export default Item
