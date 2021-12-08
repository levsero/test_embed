import { getIsAuthenticated } from 'classicSrc/embeds/chat/selectors'
import useTranslate from 'classicSrc/hooks/useTranslate'
import { openedChatHistory } from 'classicSrc/redux/modules/chat'
import { getHasChatHistory } from 'classicSrc/redux/modules/chat/chat-history-selectors'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Container, Button, HistoryIcon } from './styles'

const ViewHistoryButton = ({ canShowHistory, onOpenChatHistory }) => {
  const translate = useTranslate()

  if (!canShowHistory) {
    return null
  }

  return (
    <Container>
      <HistoryIcon />
      <Button onClick={onOpenChatHistory}>
        {translate('embeddable_framework.chat.historyLink.label')}
      </Button>
    </Container>
  )
}

ViewHistoryButton.propTypes = {
  canShowHistory: PropTypes.bool,
  onOpenChatHistory: PropTypes.func,
}

const mapStateToProps = (state) => ({
  canShowHistory: getIsAuthenticated(state) && getHasChatHistory(state),
})

const mapDispatchToProps = {
  onOpenChatHistory: openedChatHistory,
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewHistoryButton)

export const Component = ViewHistoryButton
