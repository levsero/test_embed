/** @jsx React.DOM */

 var root = window.top,
      Zd   = root.Zd,
      form = Zd.services.submitTicket;

var ReactTestUtils = React.addons.ReactTestUtils;

describe('submit ticket form', function() {
    it('should be added to the document when called', function () {
      var form1 = form.render();
      ReactTestUtils.isDOMComponent(form1);
      form1.getDOMNode()
    });
  });

