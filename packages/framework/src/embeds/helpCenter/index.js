import { connect } from 'react-redux'
import { Route, Switch, Redirect } from 'react-router-dom'
import WidgetThemeProvider from 'src/components/Widget/WidgetThemeProvider'
import ArticlePage from 'src/embeds/helpCenter/pages/ArticlePage'
import SearchPage from 'src/embeds/helpCenter/pages/SearchPage'
import SearchPromptPage from 'src/embeds/helpCenter/pages/SearchPromptPage'
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
