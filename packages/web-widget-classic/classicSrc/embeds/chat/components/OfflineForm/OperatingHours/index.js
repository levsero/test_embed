import useTranslate from 'classicSrc/hooks/useTranslate'
import PropTypes from 'prop-types'
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
