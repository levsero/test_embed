describe('util.setScaleLock', function() {
  let setScaleLock,
    metaStringToObj,
    splitPath,
    metaTag;
  const utilPath = buildSrcPath('util/utils');

  beforeEach(function() {
    resetDOM();

    mockery.enable({
      useCleanCache: true
    });

    initMockRegistry({
      'utility/globals': {
        document: document
      },
      'service/mediator': {
        mediator: {
          channel: jasmine.createSpyObj('channel', ['broadcast', 'subscribe'])
        }
      },
      'utility/devices': {
        getZoomSizingRatio: function() {
          return 1;
        }
      },
      'lodash': _
    });

    setScaleLock = require(utilPath).setScaleLock;
    metaStringToObj = require(utilPath).metaStringToObj;
    splitPath = require(utilPath).splitPath;

    metaTag = document.createElement('meta');
    metaTag.name = 'viewport';
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('setScaleLock(true)', function() {
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

    it('sets `user-scalable` to "No" if `user-scalable` does not exist', function() {
      metaTag.content = '';
      document.head.appendChild(metaTag);

      setScaleLock(true);

      const viewportContent = metaStringToObj(metaTag.content);

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

    it('resets user-scalable if `originalUserScalable` does exists', function() {
      metaTag.content = 'user-scalable=NO_CHANGE';
      document.head.appendChild(metaTag);

      setScaleLock(true);

      const viewportContentBefore = metaStringToObj(metaTag.content);

      expect(viewportContentBefore['user-scalable'])
        .toEqual('no');

      setScaleLock(false);

      const viewportContentAfter = metaStringToObj(metaTag.content);

      expect(viewportContentAfter['user-scalable'])
        .toEqual('NO_CHANGE');
    });

    it('unsets `user-scalable` if `originalUserScalable` is null', function() {
      document.head.appendChild(metaTag);

      setScaleLock(false);

      const viewportContent = metaStringToObj(metaTag.content);

      expect(viewportContent['original-user-scalable'])
        .toBeUndefined();
      expect(viewportContent['user-scalable'])
        .toBeUndefined();
    });
  });

  describe('splitPath()', function() {
    it('should split a path with some typical separation', function() {
      expect(splitPath('/this/is/a-1-path.html'))
        .toEqual(' this is a 1 path');

      // %20 is ' ' urlencoded
      expect(splitPath('/this/is/a-1%20path.html'))
        .toEqual(' this is a 1 path');

      // %2E is '.' urlencoded
      expect(splitPath('/this/is/a-2%2Epath.html'))
        .toEqual(' this is a 2 path');

      // %2D is '-' urlencoded
      expect(splitPath('/this/is/a--2%2Dpath.php'))
        .toEqual(' this is a  2 path');

      expect(splitPath('/this/is/a-2-path.html'))
        .toEqual(' this is a 2 path');

      expect(splitPath('/this/is/a|2|path.html'))
        .toEqual(' this is a 2 path');

      expect(splitPath('!/thi$/is/1@-_path.html'))
        .toEqual('! thi$ is 1@  path');

      expect(splitPath('!/thi𝌆$/is/tchüss1@-_path.html'))
        .toEqual('! thi𝌆$ is tchüss1@  path');
    });
  });

  describe('patchReactIdAttribute()', function() {
    it('updates react data attribute to data-ze-reactid instead of data-reactid', function() {
      require(utilPath).patchReactIdAttribute();

      // we have to require react again after the ID_ATTRIBUTE is updated for change to take effect
      const { addons: { TestUtils } } = require('react/addons');

      const containerDiv = TestUtils.renderIntoDocument(<h1>Hello React!</h1>).getDOMNode();

      expect(containerDiv.outerHTML)
        .toEqual('<h1 data-ze-reactid=".0">Hello React!</h1>');
    });
  });
});
