import ResultsStyles from 'embeds/helpCenter/components/Results/styles.scss'
import ContextualNoResultsMessageStyles from 'embeds/helpCenter/components/ContextualNoResultsMessage/styles.scss'
import ItemStyles from 'embeds/helpCenter/components/Item/styles.scss'
import ListStyles from 'embeds/helpCenter/components/List/styles.scss'
import LegendStyles from 'embeds/helpCenter/components/Legend/styles.scss'
import NoResultsMessageStyles from 'embeds/helpCenter/components/NoResultsMessage/styles.scss'
import DesktopPageStyles from 'embeds/helpCenter/pages/DesktopPage/styles.scss'
import MobilePageStyles from 'embeds/helpCenter/pages/MobilePage/styles.scss'
import InitialSearchPageStyles from 'embeds/helpCenter/pages/SearchPromptPage/styles.scss'
import HelpCenterChannelButtonStyles from 'src/embeds/helpCenter/components/HelpCenterChannelButton/index.scss'
import SearchFormStyles from 'src/embeds/helpCenter/components/SearchForm/styles.scss'

const styles = `
  ${InitialSearchPageStyles}
  ${ResultsStyles}
  ${DesktopPageStyles}
  ${MobilePageStyles}
  ${ContextualNoResultsMessageStyles}
  ${ItemStyles}
  ${ListStyles}
  ${LegendStyles}
  ${NoResultsMessageStyles}
  ${HelpCenterChannelButtonStyles}
  ${SearchFormStyles}
`

export default styles
