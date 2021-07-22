import PropTypes from 'prop-types'
import { withTheme } from 'styled-components'
import { Button } from '@zendeskgarden/react-buttons'
import { TEST_IDS } from 'constants/shared'
import { Hidden, LoadingContainer, LoadingDots } from './styles'

const SubmitButton = ({ submitting, label, theme: { fontSize, buttonTextColorStr } }) => {
  return (
    <Button isPrimary={true} type="submit" data-testid={TEST_IDS.BUTTON_OK}>
      {submitting ? (
        <LoadingContainer data-testid={TEST_IDS.DOTS}>
          <Hidden>{label}</Hidden>
          <LoadingDots delayMS={125} size={`${20 / fontSize}rem`} color={buttonTextColorStr} />
        </LoadingContainer>
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
    buttonTextColorStr: PropTypes.string,
  }),
}

export default withTheme(SubmitButton)
