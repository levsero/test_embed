import React from 'react'
import PropTypes from 'prop-types'

import { TEST_IDS } from 'src/constants/shared'
import { ListItem, ArticleLink } from './styles'
import routes from 'src/embeds/helpCenter/routes'
import { useHistory } from 'react-router-dom'

const handleClick = (e, route, history) => {
  e.preventDefault()
  history.push(route)
}

const Item = React.forwardRef(({ article }, ref) => {
  const history = useHistory()
  const route = routes.articles(article.id)
  return (
    <ListItem data-testid={TEST_IDS.HC_RESULT_ITEM}>
      <ArticleLink
        ref={ref}
        href={article.html_url}
        data-testid={TEST_IDS.HC_RESULT_TITLE}
        onClick={e => handleClick(e, route, history)}
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
