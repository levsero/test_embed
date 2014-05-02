/** @jsx React.DOM */

var Frame = require("../../../src/components/Frame.js").Frame,
    ReactTestUtils = React.addons.ReactTestUtils;

describe('frame', function() {
    it('should add to doc?', function () {
      var frame1 = <Frame></Frame>;
      //ReactTestUtils.renderIntoDocument(frame1);
      expect(frame1).toBeDefined();
    });
  });

