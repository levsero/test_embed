import ContextualNoResultsMessageStyles from 'embeds/helpCenter/components/ContextualNoResultsMessage/styles.scss'
import ItemStyles from 'embeds/helpCenter/components/Item/styles.scss'
import ListStyles from 'embeds/helpCenter/components/List/styles.scss'
import LegendStyles from 'embeds/helpCenter/components/Legend/styles.scss'
import NoResultsMessageStyles from 'embeds/helpCenter/components/NoResultsMessage/styles.scss'
import DesktopPageStyles from 'embeds/helpCenter/pages/DesktopPage/styles.scss'
import MobilePageStyles from 'embeds/helpCenter/pages/MobilePage/styles.scss'
import InitialSearchPageStyles from 'embeds/helpCenter/pages/SearchPromptPage/styles.scss'
import ChannelButtonStyles from 'src/embeds/helpCenter/components/ChannelButton/index.scss'
import SearchFormStyles from 'src/embeds/helpCenter/components/SearchForm/styles.scss'
import SearchHeaderStyles from 'src/embeds/helpCenter/components/SearchHeader/styles.scss'
import FooterStyles from 'src/embeds/helpCenter/components/Footer/styles.scss'

const styles = `
  ${InitialSearchPageStyles}
  ${DesktopPageStyles}
  ${MobilePageStyles}
  ${ContextualNoResultsMessageStyles}
  ${ItemStyles}
  ${ListStyles}
  ${LegendStyles}
  ${NoResultsMessageStyles}
  ${ChannelButtonStyles}
  ${SearchFormStyles}
  ${SearchHeaderStyles}
  ${FooterStyles}
`

export default styles
