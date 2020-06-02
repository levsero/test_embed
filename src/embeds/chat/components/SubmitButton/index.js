import React from 'react'
import { withTheme } from 'styled-components'
import PropTypes from 'prop-types'
import { Button } from '@zendeskgarden/react-buttons'
import { Dots } from '@zendeskgarden/react-loaders'

import { TEST_IDS } from 'constants/shared'

const SubmitButton = ({ submitting, label, theme: { fontSize, buttonTextColorStr } }) => {
  return (
    <Button primary={true} type="submit" data-testid={TEST_IDS.BUTTON_OK}>
      {submitting ? (
        <div data-testid={TEST_IDS.DOTS}>
          <Dots delayMS={125} size={`${20 / fontSize}rem`} color={buttonTextColorStr} />
        </div>
      ) : (
        label
      )}
    </Button>
  )
}

SubmitButton.propTypes = {
  submitting: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  theme: PropTypes.shape({
    fontSize: PropTypes.number,
    buttonTextColorStr: PropTypes.string
  })
}

export default withTheme(SubmitButton)
