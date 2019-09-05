import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import NoResults from 'src/embeds/helpCenter/components/Results/NoResults'
import HasResults from 'src/embeds/helpCenter/components/Results/HasResults'
import { getArticles } from 'embeds/helpCenter/selectors'

const Results = React.forwardRef(({ articles }, ref) => {
  return articles.length > 0 ? <HasResults ref={ref} /> : <NoResults />
})

Results.propTypes = {
  articles: PropTypes.array
}

const mapStateToProps = state => {
  return {
    articles: getArticles(state)
  }
}
const connectedComponent = connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true }
)(Results)

export { connectedComponent as default, Results as Component }
