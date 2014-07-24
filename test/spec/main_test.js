describe('main.js', function() {
  var root = window.top,
      zEmbed = root.zEmbed,
      zE = root.zE;

  it('should export to the global namespace', function() {
    expect(zE)
      .toBeDefined();

    expect(zEmbed)
      .toBeDefined();
  });

});
