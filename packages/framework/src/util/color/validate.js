import _ from 'lodash'
import { zdColorBlue600 } from '@zendeskgarden/css-variables'

const defaultColor = zdColorBlue600
let selectedThemeColor = { base: defaultColor }

function themeColor(base = null) {
  let color = colorFor(normalize(base), defaultColor)

  selectedThemeColor.base = color
  return color
}

function mainTextColor(base = null) {
  let color = colorFor(normalize(base))

  selectedThemeColor.text = color
  return color
}

function colorFor() {
  const colorOptions = arguments
  const color = _.find(colorOptions, (option) => {
    return validatedColor(option)
  })

  return normalize(color)
}

function validatedColor(color) {
  const normalizedColor = normalize(color)

  return isValid(normalizedColor) ? normalizedColor : null
}

function isValid(color) {
  return color && isValidHex(color)
}

function isValidHex(color) {
  const validRegex = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i

  return color && validRegex.test(color)
}

function normalize(color) {
  try {
    const normalizedColor = color.toString()
    return normalizedColor[0] === '#' ? normalizedColor : `#${normalizedColor}`
  } catch {
    return undefined
  }
}

function getThemeColor() {
  return selectedThemeColor
}

export { themeColor, mainTextColor, colorFor, getThemeColor, validatedColor }
