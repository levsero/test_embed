describe('launcher', function() {
  var root     = window.top,
      Zd       = root.Zd,
      launcher = Zd.services.launcher,
      d        = window.document;

  describe('create', function() {
    it('should create and store a launcher', function() {
      var launcher1;

      launcher.create("launcher1", {
        onClick: function() { return "expected_onclick";},
        position: "expected_position"
      });

      launcher1 = launcher.get('launcher1');

      expect(typeof launcher1)
        .toEqual("object");

      expect(launcher1.props.name)
        .toEqual("launcher1");

      expect(launcher1.props.onClick())
        .toEqual("expected_onclick");

      expect(launcher1.props.position)
        .toEqual("expected_position");
    });

    it('should have default values for config parameter', function() {
      var launcher1;

      launcher.create('launcher1');
      launcher1 = launcher.get('launcher1');

      expect(typeof launcher1)
        .toEqual("object");

      expect(launcher1.props.position)
        .toEqual('right');

      expect(typeof launcher1.props.onClick)
        .toEqual("function");
    });
  });
  
  describe('render', function() {
    it('should add an iframe to the document', function () {
      spyOn(d.body, 'appendChild').andCallThrough();

      var initialIframeCount = d.body.getElementsByTagName("iframe").length;

      launcher.create("launcher1", {});
      launcher.render("launcher1");

      expect(d.body.appendChild)
        .toHaveBeenCalled();

      expect(d.body.getElementsByTagName("iframe").length)
        .toEqual(initialIframeCount + 1);
    });
  });


})
