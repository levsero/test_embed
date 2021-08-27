import { readableColor } from 'polished'
import { DEFAULT_THEME } from '@zendeskgarden/react-theming'

const getReadableMessengerColor = (
  color,
  darkColor = DEFAULT_THEME.palette.grey[800],
  lightColor = DEFAULT_THEME.palette.white
) => {
  return readableColor(color, darkColor, lightColor, false)
}

export default getReadableMessengerColor
