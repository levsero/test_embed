import { settings } from 'service/settings';
import { _ } from 'lodash';

const defaultColor = '#78A300';
let selectedThemeColor = { base: defaultColor };

function themeColor(base = null) {
  let color = colorFor('theme', normalize(base), defaultColor);

  selectedThemeColor.base = color;
  return color;
}

function mainTextColor(base = null) {
  let color = colorFor('text', normalize(base));

  selectedThemeColor.text = color;
  return color;
}

function colorFor(element) {
  let color = normalize(settings.get(`color.${element}`));
  let fallbacks = Array.prototype.slice.call(arguments, 1);
  const colorOptions = Array.prototype.concat([color], fallbacks);

  return _.find(colorOptions, (option) => { return validatedColor(option); });
}

function validatedColor(color) {
  const normalizedColor = normalize(color);

  return isValid(normalizedColor) ? normalizedColor : null;
}

function isValid(color) {
  return color && isValidHex(color);
}

function isValidHex(color) {
  const validRegex = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;

  return validRegex.test(color);
}

function normalize(color) {
  const hashlessValidRegex = /(^[0-9A-F]{6}$)|(^[0-9A-F]{3}$)/i;

  return hashlessValidRegex.test(color) ? `#${color}` : color;
}

function getThemeColor() {
  return selectedThemeColor;
}

export {
  themeColor,
  mainTextColor,
  colorFor,
  getThemeColor
};
