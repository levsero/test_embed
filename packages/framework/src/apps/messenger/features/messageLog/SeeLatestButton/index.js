import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import useTranslate from 'src/apps/messenger/features/i18n/useTranslate'

import { getUnreadCount } from 'src/apps/messenger/store/unreadIndicator'

import { ArrowDown, Button, Text, Container } from './styles'

const SeeLatestButton = ({ onClick }) => {
  const unreadCount = useSelector(getUnreadCount)
  const translate = useTranslate()

  if (unreadCount === 0) {
    return null
  }

  return (
    <Container>
      <Button isPill={true} onClick={onClick}>
        <ArrowDown />
        <Text>{translate('embeddable_framework.messenger.see_latest')}</Text>
      </Button>
    </Container>
  )
}

SeeLatestButton.propTypes = {
  onClick: PropTypes.func,
}

export default SeeLatestButton
