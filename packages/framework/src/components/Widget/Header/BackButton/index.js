import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { useOnBack } from 'src/component/webWidget/OnBackProvider'
import { HeaderItem } from 'src/components/Widget/Header'
import { TEST_IDS } from 'src/constants/shared'
import useTranslate from 'src/hooks/useTranslate'
import { getShowBackButton } from 'src/redux/modules/selectors'
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
