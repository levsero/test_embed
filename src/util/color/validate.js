import { settings } from 'service/settings';

const defaultColor = '#78A300';
let selectedThemeColor = defaultColor;

function themeColor(base = null) {
  let color = colorFor('theme');
  const normalizedBase = normalize(base);

  if (!color && isValid(normalizedBase)) {
    color = normalizedBase;
  }

  if (base !== null) {
    selectedThemeColor = color;
  }

  return color;
}

function colorFor(element, fallback = null) {
  const color = settings.get(`color.${element}`);

  return validatedColor(color, fallback);
}

function validatedColor(color, fallback = null) {
  const normalizedColor = normalize(color);

  return isValid(normalizedColor) ? normalizedColor : fallback;
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
  defaultColor,
  themeColor,
  colorFor,
  getThemeColor
};
