import { readableColor } from 'polished'

// import { DEFAULT_THEME } from '@zendeskgarden/react-theming'

const getReadableMessengerColor = (
  // color,
  // darkColor = DEFAULT_THEME.palette.grey[500],
  // lightColor = DEFAULT_THEME.palette.white
  color,
  darkColor,
  lightColor
) => {
  return readableColor(color, darkColor, lightColor, false)
}

export default getReadableMessengerColor
