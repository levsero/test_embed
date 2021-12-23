import SuccessIcon from 'classicSrc/asset/icons/widget-icon_success_contactForm.svg'
import SuccessNotification from 'classicSrc/components/SuccessNotification'
import { Main } from 'classicSrc/components/Widget'
import ChatFooter from 'classicSrc/embeds/chat/components/Footer'
import useTranslate from 'classicSrc/hooks/useTranslate'
import PropTypes from 'prop-types'

const OfflineFormSuccess = ({ onClick }) => {
  const translate = useTranslate()

  return (
    <>
      <Main>
        <SuccessNotification
          icon={<SuccessIcon />}
          doneText={translate('embeddable_framework.common.button.done')}
          onClick={onClick}
        />
      </Main>
      <ChatFooter hideButton={true} scrollShadowVisible={false} />
    </>
  )
}

OfflineFormSuccess.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default OfflineFormSuccess
