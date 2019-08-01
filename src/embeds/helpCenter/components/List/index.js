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
    showContactButton: PropTypes.bool,
    hideZendeskLogo: PropTypes.bool,
    locale: PropTypes.string,
    onItemClick: PropTypes.func
  }

  static defaultProps = {
    articles: []
  }

  constructor() {
    super()
    this.firstArticleRef = null
  }

  renderResultRow = (article, index) => {
    const assignRef = ref => {
      if (index === 0) {
        this.firstArticleRef = ref
      }
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

  focusOnFirstItem() {
    if (this.firstArticleRef) {
      this.firstArticleRef.focus()
    }
  }

  render() {
    const { articles, isMobile, locale, showContactButton, hideZendeskLogo } = this.props
    const articleLinks = articles.map(this.renderResultRow)

    const classes = classNames(styles.list, {
      [styles.listBottom]: !(!showContactButton && !hideZendeskLogo && articles.length > 0),
      [styles.listMobile]: isMobile
    })

    return (
      <ol lang={locale} className={classes}>
        {articleLinks}
      </ol>
    )
  }
}
