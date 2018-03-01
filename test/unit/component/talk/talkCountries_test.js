describe('Talk countries', () => {
  let lib;

  const countriesPath = buildSrcPath('component/talk/talkCountries');

  beforeEach(() => {
    mockery.enable();
    initMockRegistry({
      'translation/ze_countries': {
        'AU': { code: '61', name: 'Australia' },
        'US': { code: '1', name: 'United States' },
        'ZM': { code: '260', name: 'Zambia' }
      }
    });

    mockery.registerAllowable(countriesPath);
    lib = requireUncached(countriesPath);
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

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
