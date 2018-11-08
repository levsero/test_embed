require('../webWidgetPreview');

let preview;

beforeEach(() => {
  const div = document.createElement('div');

  div.setAttribute('id', 'preview');
  document.body.appendChild(div);

  preview = window.zE.renderWebWidgetPreview({
    element: document.getElementById('preview')
  });
});

afterEach(() => {
  webWidgetPreview().remove();
  document.getElementById('preview').remove();
});

const webWidgetPreview = () => document.getElementById('webWidgetPreview');
const webWidgetPreviewBody = () => webWidgetPreview().contentWindow.document.body.innerHTML;

it('creates the iframe for preview', () => {
  expect(webWidgetPreview())
    .toBeInTheDocument();
});

it('renders the message title', () => {
  preview.setTitle('message');

  expect(webWidgetPreviewBody())
    .toMatch(/Leave us a message/);
});

it('renders the contact title', () => {
  preview.setTitle('contact');

  expect(webWidgetPreviewBody())
    .toMatch(/Contact us/);
});
