import generateColor from 'color';

export class ColorMixer {
  static highlightBy = { light: 0.1, dark: 0.15 };
  static mixFactor = 0.25;
  static darkenFactor = 0.5;
  static darkenIncreaseBy = 0.1;
  static luminosityThreshold = 0.15;

  constructor(baseColor) {
    this.white = generateColor('#FFF');
    this.black = generateColor('#000');
    this.neutralColor = generateColor('#7C7C7C');
    this.baseColor = generateColor(baseColor);
    this.buttonColor = this.baseColor;
    this.listColor = this._listColor(this.baseColor);
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
    return color.isDark() ? color : this._accentuate(color);
  }

  _listColor = (color) => {
    return color.isDark() && this._meetsAccessibilityRequirement(color, this.white)
      ? color
      : this._accentuate(color);
  }

  _foregroundColor = (color) => {
    return color.isDark() && this._meetsAccessibilityRequirement(color, this.white)
      ? this.white
      : this._accentuate(color);
  }

  _highlightColor = (color) => {
    const value = ColorMixer.highlightBy;

    return this._isPerceptuallyLight(color)
      ? color.darken(value.dark)
      : color.lighten(value.light);
  }

  _accentuate = (color) => {
    let tentativeAccentuate = color
      .mix(this.neutralColor, ColorMixer.mixFactor)
      .darken(ColorMixer.darkenFactor);

    while (
      !this._meetsAccessibilityRequirement(color, tentativeAccentuate) &&
      tentativeAccentuate.hex() !== this.black.hex()
    ) {
      tentativeAccentuate = tentativeAccentuate.darken(ColorMixer.darkenIncreaseBy);
    }

    return tentativeAccentuate;
  }

  _meetsAccessibilityRequirement = (color, inContrastTo = this.baseColor) => {
    return color.level(inContrastTo).substring(0, 2) === 'AA';
  }

  _isPerceptuallyLight = (color) => {
    return color.luminosity() > ColorMixer.luminosityThreshold;
  }
}
