import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch, Redirect } from 'react-router-dom'

import WidgetThemeProvider from 'src/components/Widget/WidgetThemeProvider'
import SearchPromptPage from 'embeds/helpCenter/pages/SearchPromptPage'
import ArticlePage from 'embeds/helpCenter/pages/ArticlePage'
import SearchPage from 'embeds/helpCenter/pages/SearchPage'
import { ROUTES } from './constants'

const HelpCenter = () => (
  <WidgetThemeProvider>
    <Switch>
      <Route path={ROUTES.articles()} component={ArticlePage} />
      <Route path={ROUTES.SEARCH_PROMPT} component={SearchPromptPage} />
      <Route path={ROUTES.SEARCH} component={SearchPage} />
      <Redirect exact={true} from={ROUTES.HOME} to={ROUTES.SEARCH_PROMPT} />
    </Switch>
  </WidgetThemeProvider>
)

const connectedComponent = connect()(HelpCenter)

export { connectedComponent as default, HelpCenter as Component }
