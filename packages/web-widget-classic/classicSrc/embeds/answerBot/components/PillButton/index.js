import { TEST_IDS } from 'classicSrc/constants/shared'
import PropTypes from 'prop-types'
import { Button } from './styles'

const PillButton = ({ className, label, onClick }) => {
  return (
    <Button onClick={onClick} className={className} data-testid={TEST_IDS.PILL_BUTTON}>
      {label}
    </Button>
  )
}

PillButton.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
}

export default PillButton
