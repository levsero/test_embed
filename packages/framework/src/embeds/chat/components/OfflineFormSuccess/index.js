import PropTypes from 'prop-types'

import SuccessNotification from 'components/SuccessNotification'
import SuccessIcon from 'icons/widget-icon_success_contactForm.svg'
import { Main } from 'src/components/Widget'
import ChatFooter from 'src/embeds/chat/components/Footer'
import useTranslate from 'src/hooks/useTranslate'

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
