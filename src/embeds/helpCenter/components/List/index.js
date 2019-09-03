import React, { PureComponent } from 'react'
import { locals as styles } from './styles.scss'
import PropTypes from 'prop-types'
import _ from 'lodash'
import classNames from 'classnames'

import Item from 'embeds/helpCenter/components/Item'

export default class List extends PureComponent {
  static propTypes = {
    isMobile: PropTypes.bool,
    articles: PropTypes.array,
    showNextButton: PropTypes.bool,
    hideZendeskLogo: PropTypes.bool,
    locale: PropTypes.string,
    onItemClick: PropTypes.func
  }

  static defaultProps = {
    articles: []
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

  renderResultRow = (article, index) => {
    const assignRef = ref => {
      this.itemRefs[article.id] = ref
    }

    return (
      <Item
        ref={assignRef}
        key={_.uniqueId('article_')}
        article={article}
        isMobile={this.props.isMobile}
        onClick={e => this.props.onItemClick(index, e)}
      />
    )
  }

  render() {
    const { articles, isMobile, locale, showNextButton, hideZendeskLogo } = this.props
    const articleLinks = articles.map(this.renderResultRow)

    const classes = classNames(styles.list, {
      [styles.listBottom]: !(!showNextButton && !hideZendeskLogo && articles.length > 0),
      [styles.listMobile]: isMobile
    })

    return (
      <ol lang={locale} className={classes}>
        {articleLinks}
      </ol>
    )
  }
}
