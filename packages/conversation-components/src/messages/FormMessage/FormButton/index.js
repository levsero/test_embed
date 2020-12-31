import { useContext } from 'react'
import PropTypes from 'prop-types'
import { ThemeContext } from 'styled-components'
import { Label, LoadingDots, Button, Loader } from './styles'

const FormButton = ({ submitting, label }) => {
  const theme = useContext(ThemeContext)
  return (
    <Button isPrimary={true} isPill={true} type="submit" aria-label={label}>
      <Label showLabel={!submitting}>{label}</Label>
      {submitting && (
        <Loader>
          <LoadingDots
            delayMS={125}
            size={theme.messenger.fontSizes.xl}
            color={theme.messenger.colors.actionText}
          />
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

export default FormButton
