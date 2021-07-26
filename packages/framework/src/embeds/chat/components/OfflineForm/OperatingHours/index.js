import PropTypes from 'prop-types'
import useTranslate from 'src/hooks/useTranslate'
import { OperatingHoursLink } from './styles'

const OperatingHours = ({ onClick }) => {
  const translate = useTranslate()

  return (
    <OperatingHoursLink isLink={true} onClick={onClick}>
      {translate('embeddable_framework.chat.operatingHours.label.anchor')}
    </OperatingHoursLink>
  )
}

OperatingHours.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default OperatingHours
