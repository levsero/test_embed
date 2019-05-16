import { hostAllowList } from '../config';

describe('hostAllowList', () => {
  const regex = () => new RegExp(hostAllowList[0]);

  describe('when the trace does not include any mention of our assets (from the allow list)', () => {
    const traceList = [
      'File https://www.betabrand.com/angular/bower_components/tinymce/tinymce.min.js line 2 col 13017 in m',
      'File "webpack-internal:///./node_modules/component-emitter/index.js" line 133 col 20 in Request.Emitter.emit',
      'File https://v2.zopim.com/ line 7462 col 1 in t.exports</m.increment'
    ];

    it('returns false for all patterns', () => {
      traceList.forEach((pattern) => {
        expect(regex().test(pattern))
          .toEqual(false);
      });
    });
  });

  describe('when the trace mentions assets which we want to record exceptions for (from our allow list)', () => {
    const traceList = [
      'File https://assets.zendesk.com/embeddable_framework/main.js line 51 col 1060096 in render/</</<',
      'https://static.zdassets.com/web_widget/00b4ca1a169d2dc52a34f2938e7280039c621394/web_widget.js',
      'https://static-staging.zdassets.com/ekr/asset_composer.js?key=7144da5b-c5f6-4e4a-8e14-3db3d8404d35',
      'assets.zd-staging.com/embeddable_framework/webWidgetPreview.js'
    ];

    it('returns true for all patterns', () => {
      traceList.forEach((pattern) => {
        expect(regex().test(pattern))
          .toEqual(true);
      });
    });
  });
});
