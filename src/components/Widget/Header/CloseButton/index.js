import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import CloseIcon from '@zendeskgarden/svg-icons/src/16/dash-fill.svg'
import { handleCloseButtonClicked } from 'src/redux/modules/base'
import { HeaderItem } from 'components/Widget/Header'
import useTranslation from 'src/hooks/useTranslation'
import { TEST_IDS } from 'constants/shared'

const CloseButton = ({ onClick }) => {
  const label = useTranslation('embeddable_framework.navigation.minimize')
  const dispatch = useDispatch()

  const onClickHandler = onClick || (() => dispatch(handleCloseButtonClicked()))

  return (
    <HeaderItem onClick={onClickHandler} aria-label={label}>
      <CloseIcon data-testid={TEST_IDS.ICON_DASH} />
    </HeaderItem>
  )
}

CloseButton.propTypes = {
  onClick: PropTypes.func
}

export default CloseButton
