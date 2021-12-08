import WidgetThemeProvider from 'classicSrc/components/Widget/WidgetThemeProvider'
import ArticlePage from 'classicSrc/embeds/helpCenter/pages/ArticlePage'
import SearchPage from 'classicSrc/embeds/helpCenter/pages/SearchPage'
import SearchPromptPage from 'classicSrc/embeds/helpCenter/pages/SearchPromptPage'
import { connect } from 'react-redux'
import { Route, Switch, Redirect } from 'react-router-dom'
import routes from './routes'

const HelpCenter = () => (
  <WidgetThemeProvider>
    <Switch>
      <Route path={routes.articles()} component={ArticlePage} />
      <Route path={routes.searchPrompt()} component={SearchPromptPage} />
      <Route path={routes.search()} component={SearchPage} />
      <Redirect to={routes.searchPrompt()} />
    </Switch>
  </WidgetThemeProvider>
)

const connectedComponent = connect()(HelpCenter)

export { connectedComponent as default, HelpCenter as Component }
