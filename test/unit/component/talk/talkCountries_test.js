const lib = require(buildSrcPath('component/talk/talkCountries'));

describe('Talk countries', () => {
  describe('countriesByIso', () => {
    it('looks up the country by ISO code', () => {
      expect(lib.countriesByIso.AU.name).toEqual('Australia');
    });
  });

  describe('countriesByName', () => {
    it('returns the country by name', () => {
      expect(lib.countriesByName['United States'].iso).toEqual('US');
    });
  });
});
