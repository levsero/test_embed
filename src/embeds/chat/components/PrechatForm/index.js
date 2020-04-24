import React from 'react'
import PropTypes from 'prop-types'
import { Header, Main, Widget } from 'components/Widget'
import ChatFooter from 'embeds/chat/components/Footer'
import { getChatTitle, getPrechatFormSettings } from 'src/redux/modules/selectors'
import { connect } from 'react-redux'
import GreetingMessage from 'embeds/chat/components/PrechatForm/GreetingMessage'
import ViewHistoryButton from 'embeds/chat/components/ViewHistoryButton'

const PrechatForm = ({ title, prechatFormSettings }) => {
  return (
    <Widget>
      <Header title={title} />
      <Main>
        <ViewHistoryButton />

        {prechatFormSettings.message && <GreetingMessage message={prechatFormSettings.message} />}
      </Main>
      <ChatFooter label={'Not implemented'} onClick={() => {}} />
    </Widget>
  )
}

PrechatForm.propTypes = {
  title: PropTypes.string,
  prechatFormSettings: PropTypes.shape({
    message: PropTypes.string
  })
}

const mapStateToProps = state => ({
  title: getChatTitle(state),
  prechatFormSettings: getPrechatFormSettings(state)
})

export default connect(mapStateToProps)(PrechatForm)
export const Component = PrechatForm
