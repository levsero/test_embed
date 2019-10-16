import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { HeaderItem } from 'components/Widget/Header'
import { BackIcon } from './styles'
import { getShowBackButton } from 'src/redux/modules/selectors'
import { useOnBack } from 'component/webWidget/OnBackProvider'
import useTranslation from 'src/hooks/useTranslation'
import { TEST_IDS } from 'constants/shared'

const BackButton = ({ useReactRouter, history }) => {
  const isVisible = useSelector(getShowBackButton)
  const onBack = useOnBack()
  const label = useTranslation('embeddable_framework.navigation.back')

  if (!useReactRouter && !isVisible) {
    return null
  }

  if (useReactRouter && history.length <= 1) {
    return null
  }

  const onClickHandler = useReactRouter ? history.goBack : onBack

  return (
    <HeaderItem onClick={onClickHandler} aria-label={label} data-testid={TEST_IDS.ICON_BACK}>
      <BackIcon />
    </HeaderItem>
  )
}

BackButton.propTypes = {
  useReactRouter: PropTypes.bool,
  history: PropTypes.object
}

const connectedComponent = withRouter(BackButton)

export { connectedComponent as default, BackButton as Component }
