import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { HeaderItem } from 'components/Widget/Header'
import { BackIcon } from './styles'
import { getShowBackButton } from 'src/redux/modules/selectors'
import { useOnBack } from 'component/webWidget/OnBackProvider'
import useTranslate from 'src/hooks/useTranslate'
import { TEST_IDS } from 'constants/shared'

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
