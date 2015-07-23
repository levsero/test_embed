describe('util.setScaleLock', function() {
  let setScaleLock,
      metaStringToObj,
      mockRegistry,
      metaTag;
  const utilPath = buildSrcPath('util/utils');

  beforeEach(function() {
    resetDOM();

    mockery.enable({
      useCleanCache: true
    });

    mockRegistry = initMockRegistry({
      'utility/globals': {
        document: document
      },
      'service/mediator': {
        mediator: {
          channel: jasmine.createSpyObj('channel', ['broadcast', 'subscribe'])
        }
      },
      'utility/devices': {
        getSizingRatio: function() {
          return 1;
        }
      },
      'lodash': _
    });

    setScaleLock = require(utilPath).setScaleLock;
    metaStringToObj = require(utilPath).metaStringToObj;

    metaTag = document.createElement('meta');
    metaTag.name = 'viewport';

  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('setScaleLock(true)', function() {

    /* jshint maxlen:false */

    it('adds a <meta name="viewport" /> tag if one does not exist', function() {
      expect(document.querySelectorAll('meta[name="viewport"]').length)
        .toEqual(0);

      setScaleLock(true);

      expect(document.querySelectorAll('meta[name="viewport"]').length)
        .toEqual(1);
    });

    it('does not add a <meta name="viewport" /> tag if one exists', function() {
      document.head.appendChild(metaTag);

      expect(document.querySelectorAll('meta[name="viewport"]').length)
        .toEqual(1);

      setScaleLock(true);

      expect(document.querySelectorAll('meta[name="viewport"]').length)
        .toEqual(1);
    });

    it('adds a "user-scalable" key/value to existing <meta name="viewport" /> if it does not exist', function() {
      metaTag.content = 'initial-scale=1.0';
      document.head.appendChild(metaTag);

      setScaleLock(true);

      const viewportContent = metaStringToObj(metaTag.content);

      expect(viewportContent['user-scalable'])
        .toEqual('no');

      expect(viewportContent['initial-scale'])
        .toEqual('1.0');
    });

    it('sets `original-user-scalable` to "UNDEFINED" if `user-scalable` does not exist', function() {
      metaTag.content = '';
      document.head.appendChild(metaTag);

      setScaleLock(true);

      const viewportContent = metaStringToObj(metaTag.content);

      expect(viewportContent['user-scalable'])
        .toEqual('no');

      expect(viewportContent['original-user-scalable'])
        .toEqual('UNDEFINED');
    });

    it('does nothing if `original-user-scalable` exists', function() {
      metaTag.content = 'original-user-scalable=no, user-scalable=NO_CHANGE';
      document.head.appendChild(metaTag);

      setScaleLock(true);

      const viewportContent = metaStringToObj(metaTag.content);

      expect(viewportContent['user-scalable'])
        .toEqual('NO_CHANGE');
    });

    it('stores original `user-scalable` value in `original-user-scalable`', function() {
      metaTag.content = 'user-scalable=SAVE_ME';
      document.head.appendChild(metaTag);

      setScaleLock(true);

      const viewportContent = metaStringToObj(metaTag.content);

      expect(viewportContent['original-user-scalable'])
        .toEqual('SAVE_ME');

      expect(viewportContent['user-scalable'])
        .toEqual('no');
    });

  });

  describe('setScaleLock(false)', function() {

    it('does not add a <meta name="viewport" /> tag if one does not exist', function() {
      expect(document.querySelectorAll('meta[name="viewport"]').length)
        .toEqual(0);

      setScaleLock(false);

      expect(document.querySelectorAll('meta[name="viewport"]').length)
        .toEqual(0);
    });

    it('does nothing if `original-user-scalable` does not exist', function() {
      metaTag.content = 'user-scalable=NO_CHANGE';
      document.head.appendChild(metaTag);

      setScaleLock(false);

      const viewportContent = metaStringToObj(metaTag.content);

      expect(viewportContent['user-scalable'])
        .toEqual('NO_CHANGE');
    });

    it('sets `user-scalable` to `original-user-scalable`', function() {
      metaTag.content = 'original-user-scalable=ORIGINAL_VALUE, user-scalable=no';
      document.head.appendChild(metaTag);

      setScaleLock(false);

      const viewportContent = metaStringToObj(metaTag.content);

      expect(viewportContent['user-scalable'])
        .toEqual('ORIGINAL_VALUE');
    });

    it('unsets `original-user-scalable`', function() {
      metaTag.content = 'original-user-scalable=ORIGINAL_VALUE, user-scalable=no';
      document.head.appendChild(metaTag);

      setScaleLock(false);

      const viewportContent = metaStringToObj(metaTag.content);

      expect(viewportContent['original-user-scalable'])
        .toBeUndefined();
    });

    it('unsets `user-scalable` if `original-user-scalable` is UNDEFINED', function() {
      metaTag.content = 'original-user-scalable=UNDEFINED, user-scalable=no';
      document.head.appendChild(metaTag);

      setScaleLock(false);

      const viewportContent = metaStringToObj(metaTag.content);

      expect(viewportContent['original-user-scalable'])
        .toBeUndefined();
      expect(viewportContent['user-scalable'])
        .toBeUndefined();
    });

  });

});
