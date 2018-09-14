import generateColor from 'color';

let instance = null;

export class ColorMixer {
  static highlightBy = { light: 0.1, dark: 0.15 };
  static yiqValues = { r: 299, g: 587, b: 114 };
  static mixFactor = 0.25;
  static darkenFactor = 0.5;
  static darkenIncreaseBy = 0.1;
  static luminosityThreshold = 0.15;
  static almostWhiteYIQ = 240;
  static defaultLightYIQ = 190;

  constructor(baseColor, options = {}) {
    if(!!instance) return instance;

    this.accents = {};
    this.options = options;
    this.white = generateColor('#FFF');
    this.black = generateColor('#000');
    this.neutralColor = generateColor('#7C7C7C');
    this.baseColor = generateColor(baseColor);

    this.buttonColor = this._buttonColor(this.baseColor);
    this.listColor = this._listColor(this.baseColor);
    instance = this;
  }

  getBaseColor = () => {
    return this.baseColor.hex();
  }

  highlight = (colorStr) => {
    const color = generateColor(colorStr);
    const highlighted = this._highlightColor(color);

    return highlighted.hex();
  }

  alpha = (colorStr, alphaValue) => {
    const color = generateColor(colorStr);

    return color.alpha(alphaValue).string();
  }

  getButtonColor = () => {
    return this.buttonColor.hex();
  }

  getListColor = () => {
    return this.listColor.hex();
  }

  uiElementColorFrom = (colorStr) => {
    const color = generateColor(colorStr);

    return this._uiElementColor(color).hex();
  }

  foregroundColorFrom = (colorStr) => {
    const color = generateColor(colorStr);

    return this._foregroundColor(color).hex();
  }

  _uiElementColor = (color) => {
    return !this._isLight(color) ? color : this._accentuate(color);
  }

  _buttonColor = (color) => {
    return this._isAlmostWhite(color)
      ? this.neutralColor
      : color;
  }

  _listColor = (color) => {
    return !this._isLight(color) && this._meetsAccessibilityRequirement(color, this.white)
      ? color
      : this._accentuate(color);
  }

  _foregroundColor = (color) => {
    return !this._isLight(color) && this._meetsAccessibilityRequirement(color, this.white)
      ? this.white
      : this._accentuate(color);
  }

  _highlightColor = (color) => {
    const value = ColorMixer.highlightBy;

    return this._isLight(color)
      ? color.darken(value.dark)
      : color.lighten(value.light);
  }

  _accentuate = (color) => {
    if(!!this.accents[color.hex()]) return this.accents[color.hex()];

    let tentativeAccentuate = color
      .mix(this.neutralColor, ColorMixer.mixFactor)
      .darken(ColorMixer.darkenFactor);

    while (
      !this._meetsAccessibilityRequirement(color, tentativeAccentuate) &&
      tentativeAccentuate.hex() !== this.black.hex()
    ) {
      tentativeAccentuate = tentativeAccentuate.darken(ColorMixer.darkenIncreaseBy);
    }

    this.accents[color.hex()] = tentativeAccentuate;

    return tentativeAccentuate;
  }

  _meetsAccessibilityRequirement = (color, inContrastTo = this.baseColor) => {
    return !!this.options.bypassA11y || color.level(inContrastTo).substring(0, 2) === 'AA';
  }

  _isAlmostWhite = (color) => {
    return this._isLight(color, ColorMixer.almostWhiteYIQ);
  }

  _isLight = (color, threshold = ColorMixer.defaultLightYIQ) => {
    const rgb = color.rgb().color;
    const values = ColorMixer.yiqValues;
    const yiq = (rgb[0] * values.r + rgb[1] * values.g + rgb[2] * values.b) / 1000;

    return yiq > threshold;
  }
}
