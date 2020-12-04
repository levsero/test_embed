import React from 'react'
import PropTypes from 'prop-types'
import { getIsAuthenticated } from 'src/redux/modules/chat/chat-selectors'
import { getHasChatHistory } from 'src/redux/modules/chat/chat-history-selectors'
import useTranslate from 'src/hooks/useTranslate'
import { openedChatHistory } from 'src/redux/modules/chat'
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
  onOpenChatHistory: PropTypes.func
}

const mapStateToProps = state => ({
  canShowHistory: getIsAuthenticated(state) && getHasChatHistory(state)
})

const mapDispatchToProps = {
  onOpenChatHistory: openedChatHistory
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewHistoryButton)

export const Component = ViewHistoryButton
