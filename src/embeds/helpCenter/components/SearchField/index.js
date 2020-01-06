import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Field, MediaInput } from '@zendeskgarden/react-forms'
import { TEST_IDS } from 'src/constants/shared'
import { LoadingDots, SearchIcon, ClearInputButton, Container } from './styles'
import { triggerOnEnter } from 'utility/keyboard'
import { getSettingsHelpCenterSearchPlaceholder } from 'src/redux/modules/selectors'
import { getSearchLoading, getSearchFieldValue } from 'embeds/helpCenter/selectors'

const SearchField = ({ isLoading, onChange, placeholder, value, inputRef }) => {
  const endIcon = () => {
    let icon = null

    if (isLoading) {
      icon = <LoadingDots data-testid={TEST_IDS.ICON_ELLIPSIS} />
    } else if (value) {
      icon = (
        <ClearInputButton
          onClick={() => onChange()}
          role="button"
          cursor="pointer"
          data-testid={TEST_IDS.ICON_CLEAR_INPUT}
          tabIndex="0"
          onKeyDown={triggerOnEnter(() => onChange())}
        />
      )
    }

    return <div key="clearInputOrLoading">{icon}</div>
  }

  return (
    <Container>
      <Field>
        <MediaInput
          start={<SearchIcon data-testid={TEST_IDS.ICON_SEARCH} />}
          end={endIcon()}
          onChange={e => onChange(e.target.value)}
          value={value}
          ref={inputRef}
          placeholder={placeholder}
          data-testid={TEST_IDS.SEARCH_FIELD}
          type="search"
          autoCapitalize="off"
        />
      </Field>
    </Container>
  )
}

SearchField.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  inputRef: PropTypes.object
}

const mapStateToProps = state => ({
  isLoading: getSearchLoading(state),
  placeholder: getSettingsHelpCenterSearchPlaceholder(state),
  value: getSearchFieldValue(state)
})

const connectedComponent = connect(mapStateToProps)(SearchField)

export { connectedComponent as default, SearchField as Component }
