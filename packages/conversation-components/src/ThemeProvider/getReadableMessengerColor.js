import { readableColor } from 'polished'
import { DEFAULT_THEME } from '@zendeskgarden/react-theming'

const getReadableMessengerColor = (color) => {
  return readableColor(color, DEFAULT_THEME.palette.grey[800], DEFAULT_THEME.palette.white, false)
}

export default getReadableMessengerColor
