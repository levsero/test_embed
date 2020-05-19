import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import SuccessNotification from 'components/SuccessNotification'
import SuccessIcon from 'icons/widget-icon_success_contactForm.svg'
import { Widget, Header, Main } from 'src/components/Widget'
import ChatFooter from 'src/embeds/chat/components/Footer/index'
import useTranslate from 'src/hooks/useTranslate'
import { handleOfflineFormBack } from 'src/redux/modules/chat'
import { getChatTitle } from 'src/redux/modules/selectors'

const OfflineFormSuccessPage = ({ onClick, title }) => {
  const translate = useTranslate()

  return (
    <Widget>
      <Header title={title} />
      <Main>
        <SuccessNotification
          icon={<SuccessIcon />}
          doneText={translate('embeddable_framework.common.button.goBack')}
          onClick={onClick}
        />
      </Main>
      <ChatFooter hideButton={true} scrollShadowVisible={false} />
    </Widget>
  )
}

OfflineFormSuccessPage.propTypes = {
  onClick: PropTypes.func,
  title: PropTypes.string
}

const mapStateToProps = state => ({
  title: getChatTitle(state)
})

const actionCreators = {
  onClick: handleOfflineFormBack
}

const connectedComponent = connect(
  mapStateToProps,
  actionCreators
)(OfflineFormSuccessPage)

export { connectedComponent as default, OfflineFormSuccessPage as Component }
