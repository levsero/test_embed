import React from 'react'
import { withTheme } from 'styled-components'
import PropTypes from 'prop-types'
import { Label, LoadingDots, Button, Loader } from './styles'

const FormButton = ({
  submitting,
  label,
  theme: {
    messenger: { colors, fontSizes }
  }
}) => {
  return (
    <Button isPrimary={true} isPill={true} type="submit" aria-label={label}>
      <Label showLabel={!submitting}>{label}</Label>
      {submitting && (
        <Loader>
          <LoadingDots delayMS={125} size={fontSizes.xl} color={colors.actionText} />
        </Loader>
      )}
    </Button>
  )
}

FormButton.propTypes = {
  submitting: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  theme: PropTypes.shape({
    fontSize: PropTypes.number,
    buttonTextColorStr: PropTypes.string
  })
}

export default withTheme(FormButton)
