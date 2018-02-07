import { settings } from 'service/settings';

const defaultColor = '#78A300';

function themeColor(base = null) {
  let color = colorFor('theme');
  const normalizedBase = normalize(base);

  if (!color && isValid(normalizedBase)) {
    color = normalizedBase;
  }

  return color || defaultColor;
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

export {
  defaultColor,
  themeColor,
  colorFor
};
