describe('launcher', function() {
  var root = window.top;
  var Zd = root.Zd;
  var launcher = Zd.services.launcher;
  it('should create and store a launcher', function() {
   launcher.create("launcher1", {});
   expect(typeof launcher.list()["launcher1"]).toEqual("object");
   expect(launcher.get("launcher1").props.name).toEqual("launcher1");
  });
  it('should render launcher using react', function () {
    spyOn(document.body, 'appendChild').andCallThrough();
    launcher.create("launcher1", {});
    launcher.render("launcher1");
    expect(document.body.appendChild).toHaveBeenCalled();
  });
})
