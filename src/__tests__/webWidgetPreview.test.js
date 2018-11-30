import '../webWidgetPreview';

import { i18n } from 'service/i18n';

beforeEach(() => {
  const div = document.createElement('div');

  div.setAttribute('id', 'preview');
  document.body.appendChild(div);
});

afterEach(() => {
  const rendered = webWidgetPreview();

  if (rendered) {
    rendered.remove();
  }
  document.getElementById('preview').remove();
});

const webWidgetPreview = () => document.getElementById('webWidgetPreview');
const webWidgetPreviewBody = () => webWidgetPreview().contentWindow.document.body.innerHTML;
const webWidgetPreviewBodyEl = () => webWidgetPreview().contentWindow.document.body;

describe('default parameters', () => {
  let preview;

  beforeEach(() => {
    preview = window.zE.renderWebWidgetPreview({
      element: document.getElementById('preview')
    });
  });

  it('creates the iframe for preview', () => {
    expect(webWidgetPreview())
      .toBeInTheDocument();
  });

  it('creates the iframe with the expected styles', () => {
    expect(webWidgetPreview())
      .toHaveStyle(`
        position: relative;
        float: right;
        margin-top: 16px;
        margin-right: 16px;
        right: 0px;
        bottom: 0px;
        width: 369px;
        height: 565px;
    `);
  });

  it('renders the message title', () => {
    preview.setTitle('message');

    expect(webWidgetPreviewBodyEl())
      .toHaveTextContent('Leave us a message');
  });

  it('renders the contact title', () => {
    preview.setTitle('contact');

    expect(webWidgetPreviewBodyEl())
      .toHaveTextContent('Contact us');
  });

  it('sets it with default title if no title is passed', () => {
    preview.setTitle();

    expect(webWidgetPreviewBodyEl())
      .toHaveTextContent('Leave us a message');
  });

  it('allows setting of color', () => {
    preview.setColor('#FF1234');

    expect(webWidgetPreviewBody())
      .toMatch('background-color: #FF1234 !important;');
  });

  it('sets it with default color', () => {
    preview.setColor();

    expect(webWidgetPreviewBody())
      .toMatch('background-color: #659700 !important;');
  });
});

describe('when calling with no element property in options', () => {
  it('throws an error', () => {
    expect(() => window.zE.renderWebWidgetPreview())
      .toThrowError('A DOM element is required to render the Web Widget Preview into');
  });
});

test('locale can be set', () => {
  window.zE.renderWebWidgetPreview({
    element: document.getElementById('preview'),
    locale: 'fr'
  });

  expect(i18n.getLocale())
    .toEqual('fr');
});

test('styles can be customized', () => {
  const styles = {
    float: 'left',
    marginTop: '32px',
    marginLeft: '32px',
    width: '100px'
  };

  window.zE.renderWebWidgetPreview({
    element: document.getElementById('preview'),
    styles
  });

  expect(webWidgetPreview())
    .toHaveStyle(`
      float: left;
      margin-top: 32px;
      margin-left: 32px;
      width: 112px;
    `);
});
