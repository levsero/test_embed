import PropTypes from 'prop-types'

import useTranslate from 'src/hooks/useTranslate'
import { ArrowDownIcon } from './styles'
import ButtonPill from 'src/embeds/chat/components/ButtonPill'

const ScrollPill = ({ notificationCount, onClick }) => {
  const translate = useTranslate()

  const label =
    notificationCount > 1
      ? translate('embeddable_framework.common.notification.manyMessages', {
          plural_number: notificationCount,
        })
      : translate('embeddable_framework.common.notification.oneMessage')

  return (
    <ButtonPill onClick={onClick}>
      {label}
      <ArrowDownIcon data-testid="Icon--arrow-down" aria-hidden={'true'} />
    </ButtonPill>
  )
}

ScrollPill.propTypes = {
  notificationCount: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default ScrollPill
