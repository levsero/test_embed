describe('main.js', function() {
  var root = window.top,
      Zd   = root.Zd;

  it('should export to the global Zd namespace', function() {
    expect(Zd).toBeDefined();
  });

});
