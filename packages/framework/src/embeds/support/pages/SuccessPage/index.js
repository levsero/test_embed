import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import SuccessIcon from 'src/asset/icons/widget-icon_success_contactForm.svg'
import SuccessNotification from 'src/components/SuccessNotification'
import { Footer, Header, Main, Widget } from 'src/components/Widget'
import useTranslate from 'src/hooks/useTranslate'
import { onCancelClick } from 'src/redux/modules/base'

const SuccessPage = ({ onCancelClick }) => {
  const t = useTranslate()

  return (
    <Widget>
      <Header
        title={t('embeddable_framework.submitTicket.notify.message.success')}
        showBackButton={false}
      />
      <Main>
        <SuccessNotification
          icon={<SuccessIcon />}
          doneText={t('embeddable_framework.common.button.goBack')}
          onClick={onCancelClick}
        />
      </Main>
      <Footer />
    </Widget>
  )
}

SuccessPage.propTypes = {
  onCancelClick: PropTypes.func,
}

const connectedComponent = connect(undefined, { onCancelClick })(SuccessPage)

export { connectedComponent as default, SuccessPage as Component }
