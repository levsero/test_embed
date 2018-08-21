import generateColor from 'color';

export class ColorMixer {
  static defaultLightYIQ = 190;
  static almostWhiteYIQ = 240;

  highlightColor = (color) => {
    return this._getContrastColor(
      color,
      this._lightenColor(0.15),
      this._darkenColor(0.1),
      this._isLuminosityGreaterThan(0.15)
    );
  };

  alphaColor = (color, alpha) => {
    return generateColor(color).alpha(alpha);
  };

  buttonColorFrom = (color) => {
    return this._getContrastColor(
      color,
      () => color,
      () => '#777',
      this._isColorLight(color, ColorMixer.almostWhiteYIQ)
    );
  };

  listColorFrom = (color) => {
    return this._getContrastColor(color, () => color, this._darkenAndMixColor(0.2, 0.5), this._isColorLight(color));
  }

  foregroundColorFrom = (color) => {
    return this._getContrastColor(color, () => 'white', this._darkenAndMixColor(0.3, 0.5));
  }

  _darkenColor = (amount) => (color) => color.darken(amount).hexString();
  _lightenColor = (amount) => (color) => color.lighten(amount).hexString();

  _darkenAndMixColor = (mixAmount, darkenAmount, mixColor = 'gray') => (color) => {
    return color.mix(generateColor(mixColor), mixAmount).darken(darkenAmount).hexString();
  };

  _isLuminosityGreaterThan = (amount) => (color) => color.luminosity() > amount;

  _isColorLight = (colorStr, threshold = ColorMixer.defaultLightYIQ) => {
    const color = generateColor(colorStr);

    // YIQ equation from http://24ways.org/2010/calculating-color-contrast
    const rgb = color.rgb();
    const redChannel = rgb.r * 299;
    const greenChannel = rgb.g * 587;
    const blueChannel = rgb.b * 114;
    const yiq = (redChannel + greenChannel + blueChannel) / 1000;

    return yiq > threshold;
  };

  _getContrastColor = (colorStr, lightFn, darkFn, isLight = this._isColorLight(colorStr)) => {
    const color = generateColor(colorStr);

    return isLight ? darkFn(color) : lightFn(color);
  };
}
