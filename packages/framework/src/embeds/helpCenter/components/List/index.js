import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { StyledList } from './styles'
import Item from 'embeds/helpCenter/components/Item'

export default class List extends PureComponent {
  static propTypes = {
    isMobile: PropTypes.bool,
    articles: PropTypes.array,
    showNextButton: PropTypes.bool,
    hideZendeskLogo: PropTypes.bool,
    locale: PropTypes.string,
  }

  static defaultProps = {
    articles: [],
  }

  constructor() {
    super()
    this.itemRefs = {}
  }

  focusOn(id) {
    if (this.itemRefs[id]) {
      this.itemRefs[id].focus()
    }
  }

  renderResultRow = (article) => {
    const assignRef = (ref) => {
      this.itemRefs[article.id] = ref
    }

    return (
      <Item
        ref={assignRef}
        key={_.uniqueId('article_')}
        article={article}
        isMobile={this.props.isMobile}
      />
    )
  }

  render() {
    const { articles, locale, showNextButton, hideZendeskLogo } = this.props
    const articleLinks = articles.map(this.renderResultRow)

    const isBottom = !(!showNextButton && !hideZendeskLogo && articles.length > 0)
    return (
      <StyledList lang={locale} isBottom={isBottom}>
        {articleLinks}
      </StyledList>
    )
  }
}
