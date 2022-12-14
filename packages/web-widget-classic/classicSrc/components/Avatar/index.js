import BlankAvatar from 'classicSrc/asset/icons/widget-icon_avatar.svg'
import { ICONS } from 'classicSrc/constants/shared'
import PropTypes from 'prop-types'
import { Image } from './styles'

const FALLBACK_ICONS = {
  [ICONS.AGENT_AVATAR]: BlankAvatar,
}

const Avatar = ({ src, fallbackIcon }) => {
  const Fallback = FALLBACK_ICONS[fallbackIcon] || BlankAvatar

  return src ? (
    <Image aria-hidden="true" alt="avatar" src={src} />
  ) : (
    <Fallback aria-hidden="true" alt="avatar" />
  )
}

Avatar.propTypes = {
  src: PropTypes.string,
  fallbackIcon: PropTypes.string,
}

export default Avatar
