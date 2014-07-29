describe('util.setScaleLock', function() {
  var setScaleLock,
      metaObjToString,
      metaStringToObj,
      mockRegistry,
      metaTag,
      utilPath = buildSrcPath('util/utils');

  beforeEach(function() {
    resetDOM();

    mockery.enable({
      useCleanCache: true
    });

    mockRegistry = initMockRegistry({
      'util/globals': {
        document: document
      },
      'imports?_=lodash!lodash': _
    });

    setScaleLock = require(utilPath).setScaleLock;
    metaStringToObj = require(utilPath).metaStringToObj;
    metaObjToString = require(utilPath).metaObjToString;
    
    metaTag = document.createElement('meta');
    metaTag.name='viewport';

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
      var viewportContent;
      metaTag.content = 'initial-scale=1.0';
      document.head.appendChild(metaTag);

      setScaleLock(true);

      viewportContent = metaStringToObj(metaTag.content);

      expect(viewportContent['user-scalable'])
        .toEqual('no');
      expect(viewportContent['initial-scale'])
        .toEqual('1.0');
    });

    it('sets `original-user-scalable` to "yes" if `user-scalable` does not exist', function() {
      var viewportContent;
      metaTag.content = '';
      document.head.appendChild(metaTag);

      setScaleLock(true);

      viewportContent = metaStringToObj(metaTag.content);

      expect(viewportContent['user-scalable'])
        .toEqual('no');

      expect(viewportContent['original-user-scalable'])
        .toEqual('yes');
    });

    it('does nothing if `original-user-scalable` exists', function() {
      var viewportContent;
      metaTag.content = 'original-user-scalable=no, user-scalable=NO_CHANGE';
      document.head.appendChild(metaTag);
      
      setScaleLock(true);

      viewportContent = metaStringToObj(metaTag.content);

      expect(viewportContent['user-scalable'])
        .toEqual('NO_CHANGE');
    });

    it('stores original `user-scalable` value in `original-user-scalable`', function() {
      var viewportContent;
      metaTag.content = 'user-scalable=SAVE_ME';
      document.head.appendChild(metaTag);
      
      setScaleLock(true);

      viewportContent = metaStringToObj(metaTag.content);

      expect(viewportContent['original-user-scalable'])
        .toEqual('SAVE_ME');

      expect(viewportContent['user-scalable'])
        .toEqual('no');
    });

  });

  describe('setScaleLock(false)', function() {

    it('does not add a <meta name="viewport" /> tag if one does not exists', function() {
      expect(document.querySelectorAll('meta[name="viewport"]').length)
        .toEqual(0);

      setScaleLock(false);

      expect(document.querySelectorAll('meta[name="viewport"]').length)
        .toEqual(0);
    });

    it('does nothing if `original-user-scalable` does not exist', function() {
      var viewportContent;
      metaTag.content = 'user-scalable=NO_CHANGE';
      document.head.appendChild(metaTag);
      
      setScaleLock(false);

      viewportContent = metaStringToObj(metaTag.content);

      expect(viewportContent['user-scalable'])
        .toEqual('NO_CHANGE');
    });

    it('sets `user-scalable` to `original-user-scalable`', function() {
      var viewportContent;
      metaTag.content = 'original-user-scalable=ORIGINAL_VALUE, user-scalable=no';
      document.head.appendChild(metaTag);
      
      setScaleLock(false);

      viewportContent = metaStringToObj(metaTag.content);

      expect(viewportContent['user-scalable'])
        .toEqual('ORIGINAL_VALUE');

    });

    it('unsets `original-user-scalable`', function() {
      var viewportContent;
      metaTag.content = 'original-user-scalable=ORIGINAL_VALUE, user-scalable=no';
      document.head.appendChild(metaTag);
      
      setScaleLock(false);

      viewportContent = metaStringToObj(metaTag.content);

      expect(viewportContent['original-user-scalable'])
        .toBeUndefined();

    });

  });

});
