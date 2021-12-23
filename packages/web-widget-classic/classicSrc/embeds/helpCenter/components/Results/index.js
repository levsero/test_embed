import HasResults from 'classicSrc/embeds/helpCenter/components/Results/HasResults'
import NoResults from 'classicSrc/embeds/helpCenter/components/Results/NoResults'
import { getSearchedArticles } from 'classicSrc/embeds/helpCenter/selectors'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const Results = ({ articles }) => (articles.length > 0 ? <HasResults /> : <NoResults />)

Results.propTypes = {
  articles: PropTypes.array,
}

const mapStateToProps = (state) => {
  return {
    articles: getSearchedArticles(state),
  }
}
const connectedComponent = connect(mapStateToProps)(Results)

export { connectedComponent as default, Results as Component }
