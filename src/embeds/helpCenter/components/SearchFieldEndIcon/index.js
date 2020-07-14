import React from 'react'
import PropTypes from 'prop-types'
import ClearInputIcon from '@zendeskgarden/svg-icons/src/16/x-stroke.svg'

import { TEST_IDS } from 'src/constants/shared'
import useTranslate from 'src/hooks/useTranslate'
import { LoadingDots, ClearInputButton } from './styles'
import { triggerOnEnter } from 'utility/keyboard'

const SearchFieldEndIcon = ({ isLoading, onClick, isVisible }) => {
  const translate = useTranslate()

  if (isLoading)
    return (
      <div key="clearInputOrLoading">
        <LoadingDots
          data-testid={TEST_IDS.ICON_ELLIPSIS}
          role="presentation"
          aria-hidden="true"
          focusable="false"
        />
      </div>
    )

  if (isVisible)
    return (
      <div key="clearInputOrLoading">
        <ClearInputButton
          onKeyDown={triggerOnEnter(() => onClick())}
          onClick={() => onClick()}
          data-testid={TEST_IDS.ICON_CLEAR_INPUT}
          aria-label={translate('embeddable_framework.helpCenter.search.clear')}
          isPill={false}
          isbasic={false}
          ignoreThemeOverride={true}
        >
          <ClearInputIcon role="presentation" aria-hidden="true" focusable="false" />
        </ClearInputButton>
      </div>
    )

  return null
}

SearchFieldEndIcon.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired
}

export default SearchFieldEndIcon
