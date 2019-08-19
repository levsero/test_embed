import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import WidgetContainer from 'src/components/WidgetContainer'
import WidgetHeader from 'src/components/WidgetHeader'
import WidgetMain from 'src/components/WidgetMain'
import WidgetFooter from 'src/components/WidgetFooter'
import ZendeskLogo from 'src/components/ZendeskLogo'
import SearchForm from 'src/embeds/helpCenter/components/SearchForm'
import { locals as styles } from './styles.scss'
import { getSettingsHelpCenterTitle } from 'src/redux/modules/selectors'
import { performSearch } from 'embeds/helpCenter/actions'

const SearchPromptPage = ({ title }) => {
  return (
    <WidgetContainer>
      <WidgetHeader>{title}</WidgetHeader>
      <WidgetMain>
        <SearchForm />
      </WidgetMain>
      <WidgetFooter>
        <div className={styles.footer}>
          <ZendeskLogo />
        </div>
      </WidgetFooter>
    </WidgetContainer>
  )
}

SearchPromptPage.propTypes = {
  title: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  title: getSettingsHelpCenterTitle(state)
})

const mapDispatchToProps = {
  performSearch
}

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchPromptPage)

export { connectedComponent as default, SearchPromptPage as Component }
