/** @jsx React.DOM */

var Frame = require("../../../src/components/Frame.js").Frame,
    ReactTestUtils = React.addons.ReactTestUtils;

describe('frame', function() {
    it('should be added to the document when called', function () {
      var frame1 = <Frame ref='test'></Frame>;
      expect(frame1).toBeDefined();
    });
  });

