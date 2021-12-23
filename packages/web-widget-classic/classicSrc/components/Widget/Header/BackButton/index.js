import { useOnBack } from 'classicSrc/component/webWidget/OnBackProvider'
import { HeaderItem } from 'classicSrc/components/Widget/Header'
import { TEST_IDS } from 'classicSrc/constants/shared'
import useTranslate from 'classicSrc/hooks/useTranslate'
import { getShowBackButton } from 'classicSrc/redux/modules/selectors'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { BackIcon } from './styles'

const BackButton = ({ useReactRouter, history }) => {
  const translate = useTranslate()
  const isVisible = useSelector(getShowBackButton)
  const onBack = useOnBack()

  if (!useReactRouter && !isVisible) {
    return null
  }

  if (useReactRouter && history.length <= 1) {
    return null
  }

  const onClickHandler = useReactRouter ? history.goBack : onBack

  return (
    <HeaderItem
      onClick={onClickHandler}
      aria-label={translate('embeddable_framework.navigation.back')}
      data-testid={TEST_IDS.ICON_BACK}
    >
      <BackIcon />
    </HeaderItem>
  )
}

BackButton.propTypes = {
  useReactRouter: PropTypes.bool,
  history: PropTypes.object,
}

const connectedComponent = withRouter(BackButton)

export { connectedComponent as default, BackButton as Component }
