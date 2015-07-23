describe('main.js', function() {
  const root = window.parent;
  const zEmbed = root.zEmbed;
  const zE = root.zE;

  it('should export to the global namespace', function() {
    expect(zE)
      .toBeDefined();

    expect(zEmbed)
      .toBeDefined();
  });

});
