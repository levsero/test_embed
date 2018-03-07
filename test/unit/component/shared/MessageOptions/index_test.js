describe('MessageOptions component', () => {
  let MessageOptions,
    messageOptionsComponent;

  const optionItems = [
    <div>Y</div>,
    <div>O</div>,
    <div>L</div>,
    <div>O</div>
  ];

  const messageOptionsPath = buildSrcPath('component/shared/MessageOptions');

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      './MessageOptions.scss': {
        locals: {
          firstItemBorders: 'firstItemBorders',
          lastItemBorders: 'lastItemBorders',
          optionItem: 'optionItem'
        }
      }
    });

    mockery.registerAllowable(messageOptionsPath);
    MessageOptions = requireUncached(messageOptionsPath).MessageOptions;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('render', () => {
    let response;

    describe('when message bubble is linked', () => {
      describe('when a custom option style is provided', () => {
        beforeEach(() => {
          messageOptionsComponent = domRender(<MessageOptions isMessageBubbleLinked={true} optionItemStyle={'yolo'} optionItems={optionItems} />);
          response = messageOptionsComponent.render();
        });

        it('renders option items with correct styles', ()=> {
          response.props.children.forEach((optionItem, index) => {
            expect(TestUtils.isElementOfType(optionItem, 'li')).toEqual(true);
            expect(optionItem.key).toEqual(index.toString());

            if (index === response.props.children.length - 1) {
              expect(optionItem.props.className).toEqual('optionItem yolo  lastItemBorders');
            } else {
              expect(optionItem.props.className).toEqual('optionItem yolo  ');
            }
          });
        });
      });

      describe('when a custom option style is not provided', () => {
        beforeEach(() => {
          messageOptionsComponent = domRender(<MessageOptions isMessageBubbleLinked={true} optionItems={optionItems} />);
          response = messageOptionsComponent.render();
        });

        it('renders option items with correct styles', ()=> {
          response.props.children.forEach((optionItem, index) => {
            expect(TestUtils.isElementOfType(optionItem, 'li')).toEqual(true);
            expect(optionItem.key).toEqual(index.toString());

            if (index === response.props.children.length - 1) {
              expect(optionItem.props.className).toEqual('optionItem   lastItemBorders');
            } else {
              expect(optionItem.props.className).toEqual('optionItem   ');
            }
          });
        });
      });
    });

    describe('when message bubble is not linked', () => {
      describe('when a custom option style is not provided', () => {
        beforeEach(() => {
          messageOptionsComponent = domRender(<MessageOptions isMessageBubbleLinked={false} optionItems={optionItems} />);
          response = messageOptionsComponent.render();
        });

        it('renders option items with correct styles', ()=> {
          response.props.children.forEach((optionItem, index) => {
            expect(TestUtils.isElementOfType(optionItem, 'li')).toEqual(true);
            expect(optionItem.key).toEqual(index.toString());

            if (index === 0) {
              expect(optionItem.props.className).toEqual('optionItem  firstItemBorders ');
            } else if (index === response.props.children.length - 1) {
              expect(optionItem.props.className).toEqual('optionItem   lastItemBorders');
            } else {
              expect(optionItem.props.className).toEqual('optionItem   ');
            }
          });
        });
      });

      describe('when a custom option style is provided', () => {
        beforeEach(() => {
          messageOptionsComponent = domRender(<MessageOptions isMessageBubbleLinked={false} optionItems={optionItems} optionItemStyle={'yolo'} />);
          response = messageOptionsComponent.render();
        });

        it('renders option items with correct styles', ()=> {
          response.props.children.forEach((optionItem, index) => {
            expect(TestUtils.isElementOfType(optionItem, 'li')).toEqual(true);
            expect(optionItem.key).toEqual(index.toString());

            if (index === 0) {
              expect(optionItem.props.className).toEqual('optionItem yolo firstItemBorders ');
            } else if (index === response.props.children.length - 1) {
              expect(optionItem.props.className).toEqual('optionItem yolo  lastItemBorders');
            } else {
              expect(optionItem.props.className).toEqual('optionItem yolo  ');
            }
          });
        });
      });
    });
  });
});
