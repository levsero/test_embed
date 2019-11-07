import React from 'react'
import PropTypes from 'prop-types'

import { TEST_IDS } from 'src/constants/shared'
import { ListItem, ArticleLink } from './styles'
import routes from 'src/embeds/helpCenter/routes'

const Item = React.forwardRef(({ article }, ref) => {
  return (
    <ListItem data-testid={TEST_IDS.HC_RESULT_ITEM}>
      <ArticleLink
        innerRef={ref}
        to={routes.articles(article.id)}
        data-testid={TEST_IDS.HC_RESULT_TITLE}
      >
        {article.title || article.name}
      </ArticleLink>
    </ListItem>
  )
})

Item.propTypes = {
  article: PropTypes.object
}

export default Item
