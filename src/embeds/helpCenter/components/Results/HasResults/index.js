import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Legend from 'embeds/helpCenter/components/Legend'
import List from 'src/embeds/helpCenter/components/List'
import { getLocale } from 'src/redux/modules/base/base-selectors'
import { isMobileBrowser } from 'utility/devices'
import { getArticles, getHasContextuallySearched } from 'embeds/helpCenter/selectors'
import { getHideZendeskLogo, getShowNextButton } from 'src/redux/modules/selectors'
import { handleArticleClick } from 'embeds/helpCenter/actions'
import { updateBackButtonVisibility } from 'src/redux/modules/base'

const HasResults = ({
  isMobile,
  articles,
  showNextButton,
  hideZendeskLogo,
  locale,
  handleArticleClick,
  hasContextuallySearched,
  updateBackButtonVisibility
}) => {
  const onArticleClick = (articleIndex, e) => {
    e.preventDefault()
    handleArticleClick(articles[articleIndex])
    updateBackButtonVisibility()
  }

  return (
    <div>
      <Legend
        fullscreen={isMobile}
        hasContextuallySearched={hasContextuallySearched}
        locale={locale}
      />
      <List
        isMobile={isMobile}
        articles={articles}
        showNextButton={showNextButton}
        hideZendeskLogo={hideZendeskLogo}
        locale={locale}
        onItemClick={onArticleClick}
      />
    </div>
  )
}

HasResults.propTypes = {
  isMobile: PropTypes.bool,
  articles: PropTypes.array,
  showNextButton: PropTypes.bool,
  hideZendeskLogo: PropTypes.bool,
  locale: PropTypes.string,
  handleArticleClick: PropTypes.func,
  hasContextuallySearched: PropTypes.bool,
  updateBackButtonVisibility: PropTypes.func
}

const mapStateToProps = state => {
  return {
    isMobile: isMobileBrowser(),
    articles: getArticles(state),
    showNextButton: getShowNextButton(state),
    hideZendeskLogo: getHideZendeskLogo(state),
    locale: getLocale(state),
    hasContextuallySearched: getHasContextuallySearched(state)
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
