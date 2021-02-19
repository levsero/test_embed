import { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Widget, Header } from 'src/components/Widget'
import OfflineForm from 'src/embeds/chat/components/OfflineForm'
import { getChatTitle } from 'src/redux/modules/selectors'
import { handleOfflineFormBack } from 'src/redux/modules/chat'
import OfflineFormSuccess from 'src/embeds/chat/components/OfflineFormSuccess'

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
