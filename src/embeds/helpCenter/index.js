import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Route, Switch, Redirect } from 'react-router-dom'

import WidgetThemeProvider from 'src/components/Widget/WidgetThemeProvider'
import SearchPromptPage from 'embeds/helpCenter/pages/SearchPromptPage'
import ArticlePage from 'embeds/helpCenter/pages/ArticlePage'
import SearchPage from 'embeds/helpCenter/pages/SearchPage'
import { getArticleDisplayed, getActiveArticle } from 'embeds/helpCenter/selectors'
import { getHelpCenterEmbed } from 'src/redux/modules/base/base-selectors'
import { ROUTES } from './constants'

const HelpCenter = ({ articleDisplayed, activeArticle, helpCenterEnabled }) => (
  <WidgetThemeProvider>
    <Switch>
      <Route path={ROUTES.SEARCH_PROMPT} component={SearchPromptPage} />
      <Route path={ROUTES.articles()} component={ArticlePage} />
      <Route path={ROUTES.SEARCH} component={SearchPage} />
      {Boolean(articleDisplayed && activeArticle) && (
        // push only on helpCenterEnabled required for IPM in Z1
        <Redirect to={ROUTES.articles(activeArticle.id)} push={helpCenterEnabled} />
      )}
      <Redirect exact={true} from={ROUTES.HOME} to={ROUTES.SEARCH_PROMPT} />
    </Switch>
  </WidgetThemeProvider>
)

HelpCenter.propTypes = {
  articleDisplayed: PropTypes.bool.isRequired,
  activeArticle: PropTypes.object,
  helpCenterEnabled: PropTypes.bool
}

const mapStateToProps = state => {
  return {
    articleDisplayed: getArticleDisplayed(state),
    activeArticle: getActiveArticle(state),
    helpCenterEnabled: getHelpCenterEmbed(state) // needed for IPM
  }
}

const connectedComponent = connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true }
)(HelpCenter)

export { connectedComponent as default, HelpCenter as Component }
