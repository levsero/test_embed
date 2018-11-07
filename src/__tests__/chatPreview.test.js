require('../chatPreview');

let preview;

beforeEach(() => {
  const div = document.createElement('div');

  div.setAttribute('id', 'preview');
  document.body.appendChild(div);

  preview = window.zEPreview.renderPreview({
    element: document.getElementById('preview')
  });
});

afterEach(() => {
  chatPreview().remove();
  document.getElementById('preview').remove();
});

const chatPreview = () => document.getElementById('chatPreview');
const chatPreviewBody = () => chatPreview().contentWindow.document.body.innerHTML;

it('creates the iframe for preview', (done) => {
  preview.waitForComponent(() => {
    expect(chatPreview())
      .toBeInTheDocument();
    done();
  });
});

it('can update to chatting screen', (done) => {
  preview.updateScreen('widget/chat/CHATTING_SCREEN');
  preview.waitForComponent(() => {
    expect(chatPreviewBody())
      .toMatch(/Type a message here/);
    done();
  });
});

it('can update to prechat screen', (done) => {
  preview.updateScreen('widget/chat/PRECHAT_SCREEN');
  preview.waitForComponent(() => {
    expect(chatPreviewBody())
      .toMatch(/Start chat/);
    done();
  });
});

it('can update to offline message screen', (done) => {
  preview.updateScreen('widget/chat/OFFLINE_MESSAGE_SCREEN');
  preview.waitForComponent(() => {
    expect(chatPreviewBody())
      .toMatch(/Sorry, we are not online at the moment/);
    done();
  });
});
