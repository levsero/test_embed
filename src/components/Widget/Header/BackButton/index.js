import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { HeaderItem } from 'components/Widget/Header'
import { BackIcon } from './styles'
import { getShowBackButton } from 'src/redux/modules/selectors'
import { useOnBack } from 'component/webWidget/OnBackProvider'
import useTranslation from 'src/hooks/useTranslation'

const BackButton = ({ onClick }) => {
  const isVisible = useSelector(getShowBackButton)
  const onBack = useOnBack()
  const label = useTranslation('embeddable_framework.navigation.back')

  if (!isVisible) {
    return null
  }

  const onClickHandler = onClick || onBack

  return (
    <HeaderItem onClick={onClickHandler} aria-label={label}>
      <BackIcon />
    </HeaderItem>
  )
}

BackButton.propTypes = {
  onClick: PropTypes.func
}

export default BackButton
