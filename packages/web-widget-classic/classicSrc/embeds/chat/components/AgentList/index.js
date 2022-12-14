import AgentInfo from 'classicSrc/embeds/chat/components/AgentInfo'
import { getActiveAgents } from 'classicSrc/embeds/chat/selectors/reselectors'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const AgentList = ({ agents }) => (
  <ul>
    {Object.values(agents).map((agent) => (
      <li key={agent.nick}>
        <AgentInfo agent={agent} />
      </li>
    ))}
  </ul>
)

AgentList.propTypes = {
  agents: PropTypes.shape({
    [PropTypes.string]: PropTypes.shape({
      nick: PropTypes.string,
      isTyping: PropTypes.bool,
      title: PropTypes.string,
      display_name: PropTypes.string,
    }),
  }).isRequired,
}

const mapStateToProps = (state) => ({
  agents: getActiveAgents(state),
})

const connectedComponent = connect(mapStateToProps)(AgentList)

export { connectedComponent as default, AgentList as Component }
