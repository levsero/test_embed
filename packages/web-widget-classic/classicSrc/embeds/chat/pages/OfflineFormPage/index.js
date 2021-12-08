import { Widget, Header } from 'classicSrc/components/Widget'
import OfflineForm from 'classicSrc/embeds/chat/components/OfflineForm'
import OfflineFormSuccess from 'classicSrc/embeds/chat/components/OfflineFormSuccess'
import { handleOfflineFormBack } from 'classicSrc/redux/modules/chat'
import { getChatTitle } from 'classicSrc/redux/modules/selectors'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { connect } from 'react-redux'

const ChatOfflineFormPage = ({ title }) => {
  const [hasSubmitted, setHasSubmitted] = useState(false)
  return (
    <Widget>
      <Header title={title} />
      {!hasSubmitted && <OfflineForm setHasSubmitted={() => setHasSubmitted(true)} />}
      {hasSubmitted && <OfflineFormSuccess onClick={() => setHasSubmitted(false)} />}
    </Widget>
  )
}

ChatOfflineFormPage.propTypes = {
  title: PropTypes.string.isRequired,
}

const mapStateToProps = (state) => ({
  title: getChatTitle(state),
})

const connectedComponent = connect(mapStateToProps, { handleOfflineFormBack })(ChatOfflineFormPage)

export { connectedComponent as default, ChatOfflineFormPage as Component }
