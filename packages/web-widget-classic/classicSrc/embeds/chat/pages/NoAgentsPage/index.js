import { Widget, Header, Main } from 'classicSrc/components/Widget'
import { TEST_IDS } from 'classicSrc/constants/shared'
import ViewHistoryButton from 'classicSrc/embeds/chat/components/ViewHistoryButton'
import useTranslate from 'classicSrc/hooks/useTranslate'
import { cancelButtonClicked } from 'classicSrc/redux/modules/base'
import { getChatTitle } from 'classicSrc/redux/modules/selectors'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
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
  onButtonClick: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  title: getChatTitle(state),
})

const connectedComponent = connect(mapStateToProps, {
  onButtonClick: cancelButtonClicked,
})(NoAgentsPage)

export { connectedComponent as default, NoAgentsPage as Component }
