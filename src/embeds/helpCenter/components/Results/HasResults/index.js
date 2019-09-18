import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Legend from 'embeds/helpCenter/components/Legend'
import List from 'src/embeds/helpCenter/components/List'
import { getLocale } from 'src/redux/modules/base/base-selectors'
import { isMobileBrowser } from 'utility/devices'
import {
  getArticles,
  getHasContextuallySearched,
  getPreviousActiveArticle
} from 'embeds/helpCenter/selectors'
import { getHideZendeskLogo, getShowNextButton } from 'src/redux/modules/selectors'
import { handleArticleClick } from 'embeds/helpCenter/actions'
import { updateBackButtonVisibility } from 'src/redux/modules/base'

class HasResults extends PureComponent {
  static propTypes = {
    isMobile: PropTypes.bool,
    articles: PropTypes.array,
    showNextButton: PropTypes.bool,
    hideZendeskLogo: PropTypes.bool,
    locale: PropTypes.string,
    handleArticleClick: PropTypes.func,
    hasContextuallySearched: PropTypes.bool,
    updateBackButtonVisibility: PropTypes.func,
    previousActiveArticle: PropTypes.number
  }

  constructor() {
    super()
    this.list = null
  }

  componentDidMount() {
    if (this.props.articles.length) {
      this.focus()
    }
  }

  componentDidUpdate() {
    if (this.props.articles.length) {
      this.focus()
    }
  }

  onArticleClick = (articleIndex, e) => {
    e.preventDefault()
    this.props.handleArticleClick(this.props.articles[articleIndex])
    this.props.updateBackButtonVisibility()
  }

  focus = () => {
    if (this.list) {
      const id = this.props.previousActiveArticle || this.props.articles[0].id
      this.list.focusOn(id)
    }
  }

  render() {
    const {
      isMobile,
      articles,
      showNextButton,
      hideZendeskLogo,
      locale,
      hasContextuallySearched
    } = this.props

    return (
      <div>
        <Legend hasContextuallySearched={hasContextuallySearched} locale={locale} />
        <List
          ref={el => (this.list = el)}
          isMobile={isMobile}
          articles={articles}
          showNextButton={showNextButton}
          hideZendeskLogo={hideZendeskLogo}
          locale={locale}
          onItemClick={this.onArticleClick}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    isMobile: isMobileBrowser(),
    articles: getArticles(state),
    showNextButton: getShowNextButton(state),
    hideZendeskLogo: getHideZendeskLogo(state),
    locale: getLocale(state),
    hasContextuallySearched: getHasContextuallySearched(state),
    previousActiveArticle: getPreviousActiveArticle(state)
  }
}

const actionCreators = {
  handleArticleClick,
  updateBackButtonVisibility
}

const connectedComponent = connect(
  mapStateToProps,
  actionCreators
)(HasResults)

export { connectedComponent as default, HasResults as Component }
