import PropTypes from 'prop-types'
import { withTheme } from 'styled-components'
import { Button, Label, LoadingDots, Loader } from './styles'

const LoadingButton = ({ onClick, isLoading, label, theme: { fontSize, buttonTextColorStr } }) => {
  return (
    <Button isPrimary={true} onClick={onClick} aria-label={label}>
      <Label showLabel={!isLoading}>{label}</Label>
      {isLoading && (
        <Loader>
          <LoadingDots delayMS={125} size={`${20 / fontSize}rem`} color={buttonTextColorStr} />
        </Loader>
      )}
    </Button>
  )
}

LoadingButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  theme: PropTypes.shape({
    fontSize: PropTypes.number,
    buttonTextColorStr: PropTypes.string,
  }),
}

export default withTheme(LoadingButton)
