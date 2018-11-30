import '../chatPreview';

import { i18n } from 'service/i18n';

beforeEach(() => {
  const div = document.createElement('div');

  div.setAttribute('id', 'preview');
  document.body.appendChild(div);
});

afterEach(() => {
  const rendered = chatPreview();

  if (rendered) {
    rendered.remove();
  }
  document.getElementById('preview').remove();
});

const chatPreview = () => document.getElementById('chatPreview');
const chatPreviewBody = () => chatPreview().contentWindow.document.body.innerHTML;
const chatPreviewBodyEl = () => chatPreview().contentWindow.document.body;

describe('rendered with default options', () => {
  let preview;

  beforeEach(() => {
    preview = window.zEPreview.renderPreview({
      element: document.getElementById('preview')
    });
  });

  it('creates the iframe for preview', (done) => {
    preview.waitForComponent(() => {
      expect(chatPreview())
        .toBeInTheDocument();
      done();
    });
  });

  it('creates the iframe with the expected styles', () => {
    expect(chatPreview())
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

  it('can update to chatting screen', (done) => {
    preview.updateScreen('widget/chat/CHATTING_SCREEN');
    preview.waitForComponent(() => {
      expect(chatPreviewBodyEl())
        .toHaveTextContent('Type a message here');
      done();
    });
  });

  it('can update to prechat screen', (done) => {
    preview.updateScreen('widget/chat/PRECHAT_SCREEN');
    preview.waitForComponent(() => {
      expect(chatPreviewBodyEl())
        .toHaveTextContent('Start chat');
      done();
    });
  });

  it('can update to offline message screen', (done) => {
    preview.updateScreen('widget/chat/OFFLINE_MESSAGE_SCREEN');
    preview.waitForComponent(() => {
      expect(chatPreviewBodyEl())
        .toHaveTextContent('Sorry, we are not online at the moment');
      done();
    });
  });

  it('allows setting of color', (done) => {
    preview.setColor('#FF1234');

    preview.waitForComponent(() => {
      expect(chatPreviewBody())
        .toMatch('background-color: #FF1234 !important;');
      done();
    });
  });

  it('sets it with default color', (done) => {
    preview.setColor();

    preview.waitForComponent(() => {
      expect(chatPreviewBody())
        .toMatch('background-color: #659700 !important;');
      done();
    });
  });

  it('allows updating of locale', (done) => {
    preview.updateLocale('zh');

    preview.waitForComponent(() => {
      expect(i18n.getLocale())
        .toEqual('zh-cn');
      done();
    });
  });

  it('allows setting of chat state', (done) => {
    const action = { type: 'account_status', detail: 'online' };

    preview.updateChatState(action);

    preview.waitForComponent(() => {
      expect(chatPreviewBodyEl())
        .toHaveTextContent('Chat with us');
      expect(chatPreviewBodyEl())
        .toHaveTextContent('Live Support');
      done();
    });
  });

  it('allows updating of preview settings', (done) => {
    preview.updateScreen('widget/chat/CHATTING_SCREEN');
    preview.updateSettings({ concierge: { title: 'updated concierge title' } });

    preview.waitForComponent(() => {
      expect(chatPreviewBodyEl().querySelector('header'))
        .toHaveTextContent('updated concierge title');
      done();
    });
  });
});

describe('when calling with no element property in options', () => {
  it('throws an error', () => {
    expect(() => window.zEPreview.renderPreview())
      .toThrowError('A DOM element is required to render the Preview into');
  });
});

test('locale can be set', () => {
  window.zEPreview.renderPreview({
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

  window.zEPreview.renderPreview({
    element: document.getElementById('preview'),
    styles
  });

  expect(chatPreview())
    .toHaveStyle(`
      float: left;
      margin-top: 32px;
      margin-left: 32px;
      width: 112px;
    `);
});
