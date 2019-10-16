import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Route, Switch, Redirect } from 'react-router-dom'

import WidgetThemeProvider from 'src/components/Widget/WidgetThemeProvider'
import SearchPromptPage from 'embeds/helpCenter/pages/SearchPromptPage'
import ArticlePage from 'embeds/helpCenter/pages/ArticlePage'
import SearchPage from 'embeds/helpCenter/pages/SearchPage'
import { getArticleDisplayed, getActiveArticle } from 'embeds/helpCenter/selectors'
import { getHelpCenterEmbed, getIPMWidget } from 'src/redux/modules/base/base-selectors'
import { ROUTES } from './constants'

const HelpCenter = ({ articleDisplayed, activeArticle, helpCenterEnabled, ipmWidget }) => (
  <WidgetThemeProvider>
    <Switch>
      <Route path={ROUTES.articles()} component={ArticlePage} />
      {Boolean(articleDisplayed && activeArticle) && (
        // push only on helpCenterEnabled required for IPM in Z1
        <Redirect to={ROUTES.articles(activeArticle.id)} push={!ipmWidget && helpCenterEnabled} />
      )}
      <Route path={ROUTES.SEARCH_PROMPT} component={SearchPromptPage} />
      <Route path={ROUTES.SEARCH} component={SearchPage} />
      <Redirect exact={true} from={ROUTES.HOME} to={ROUTES.SEARCH_PROMPT} />
    </Switch>
  </WidgetThemeProvider>
)

HelpCenter.propTypes = {
  articleDisplayed: PropTypes.bool.isRequired,
  activeArticle: PropTypes.object,
  helpCenterEnabled: PropTypes.bool,
  ipmWidget: PropTypes.bool
}

const mapStateToProps = state => {
  return {
    articleDisplayed: getArticleDisplayed(state),
    activeArticle: getActiveArticle(state),
    helpCenterEnabled: getHelpCenterEmbed(state), // needed for IPM
    ipmWidget: getIPMWidget(state) // needed for IPM
  }
}

const connectedComponent = connect(
  mapStateToProps,
  { forwardRef: true }
)(HelpCenter)

export { connectedComponent as default, HelpCenter as Component }
