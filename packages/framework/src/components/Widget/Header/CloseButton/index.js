import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import CloseIcon from '@zendeskgarden/svg-icons/src/16/dash-fill.svg'
import { HeaderItem } from 'src/components/Widget/Header'
import { TEST_IDS } from 'src/constants/shared'
import useTranslate from 'src/hooks/useTranslate'
import { handleCloseButtonClicked } from 'src/redux/modules/base'

const CloseButton = ({ onClick }) => {
  const translate = useTranslate()
  const dispatch = useDispatch()

  const onClickHandler = onClick || (() => dispatch(handleCloseButtonClicked()))

  return (
    <HeaderItem
      onClick={onClickHandler}
      aria-label={translate('embeddable_framework.navigation.minimize')}
    >
      <CloseIcon data-testid={TEST_IDS.ICON_DASH} />
    </HeaderItem>
  )
}

CloseButton.propTypes = {
  onClick: PropTypes.func,
}

export default CloseButton
