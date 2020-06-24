import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import useTranslate from 'src/hooks/useTranslate'

import ViewHistoryButton from 'embeds/chat/components/ViewHistoryButton'
import { Widget, Header, Main } from 'src/components/Widget'
import { TEST_IDS } from 'src/constants/shared'
import { cancelButtonClicked } from 'src/redux/modules/base'
import { getChatTitle } from 'src/redux/modules/selectors'

import { Button, Greeting, InnerContentContainer } from './styles'

const NoAgentsPage = ({ title, onButtonClick }) => {
  const translate = useTranslate()
  return (
    <Widget>
      <Header title={title} />
      <Main>
        <InnerContentContainer>
          <ViewHistoryButton />
          <Greeting data-testid={TEST_IDS.FORM_GREETING_MSG}>
            {translate('embeddable_framework.chat.offline.label.noForm')}
          </Greeting>
          <Button isPrimary={true} onClick={onButtonClick}>
            {translate('embeddable_framework.chat.offline.button.close')}
          </Button>
        </InnerContentContainer>
      </Main>
    </Widget>
  )
}

NoAgentsPage.propTypes = {
  title: PropTypes.string.isRequired,
  onButtonClick: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  title: getChatTitle(state)
})

const connectedComponent = connect(
  mapStateToProps,
  {
    onButtonClick: cancelButtonClicked
  }
)(NoAgentsPage)

export { connectedComponent as default, NoAgentsPage as Component }
