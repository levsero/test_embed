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
          messageOptionsComponent = instanceRender(<MessageOptions isMessageBubbleLinked={true} optionItemClasses={'yolo'} optionItems={optionItems} />);
          response = messageOptionsComponent.render();
        });

        it('renders option items with correct styles', ()=> {
          response.props.children.forEach((optionItem, index) => {
            expect(TestUtils.isElementOfType(optionItem, 'li')).toEqual(true);
            expect(optionItem.key).toEqual(index.toString());

            const classes = optionItem.props.className;

            expect(classes)
              .toContain('optionItem');

            expect(classes)
              .toContain('yolo');

            if (index === response.props.children.length - 1) {
              expect(classes)
                .toContain('lastItemBorders');
            } else {
              expect(classes)
                .not
                .toContain('lastItemBorders');
            }
          });
        });
      });

      describe('when a custom option style is not provided', () => {
        beforeEach(() => {
          messageOptionsComponent = instanceRender(<MessageOptions isMessageBubbleLinked={true} optionItems={optionItems} />);
          response = messageOptionsComponent.render();
        });

        it('renders option items with correct styles', ()=> {
          response.props.children.forEach((optionItem, index) => {
            expect(TestUtils.isElementOfType(optionItem, 'li')).toEqual(true);
            expect(optionItem.key).toEqual(index.toString());

            const classes = optionItem.props.className;

            expect(classes)
              .toContain('optionItem');

            expect(classes)
              .not
              .toContain('yolo');

            if (index === response.props.children.length - 1) {
              expect(classes)
                .toContain('lastItemBorders');
            } else {
              expect(classes)
                .not
                .toContain('lastItemBorders');
            }
          });
        });
      });
    });

    describe('when message bubble is not linked', () => {
      describe('when a custom option style is not provided', () => {
        beforeEach(() => {
          messageOptionsComponent = instanceRender(<MessageOptions isMessageBubbleLinked={false} optionItems={optionItems} />);
          response = messageOptionsComponent.render();
        });

        it('renders option items with correct styles', ()=> {
          response.props.children.forEach((optionItem, index) => {
            expect(TestUtils.isElementOfType(optionItem, 'li')).toEqual(true);
            expect(optionItem.key).toEqual(index.toString());

            const classes = optionItem.props.className;

            expect(classes)
              .toContain('optionItem');

            expect(classes)
              .not
              .toContain('yolo');

            if (index === 0) {
              expect(classes)
                .toContain('firstItemBorders');
            } else if (index === response.props.children.length - 1) {
              expect(classes)
                .toContain('lastItemBorders');
            } else {
              expect(classes)
                .not
                .toContain('lastItemBorders');
            }
          });
        });
      });

      describe('when a custom option style is provided', () => {
        beforeAll(() => {
          messageOptionsComponent = instanceRender(<MessageOptions isMessageBubbleLinked={false} optionItems={optionItems} optionItemClasses={'yolo'} />);
          response = messageOptionsComponent.render();
        });

        it('renders option items with correct styles', ()=> {
          response.props.children.forEach((optionItem, index) => {
            expect(TestUtils.isElementOfType(optionItem, 'li')).toEqual(true);
            expect(optionItem.key).toEqual(index.toString());

            const classes = optionItem.props.className;

            expect(classes)
              .toContain('optionItem');

            expect(classes)
              .toContain('yolo');

            if (index === 0) {
              expect(classes)
                .toContain('firstItemBorders');
            } else if (index === response.props.children.length - 1) {
              expect(classes)
                .toContain('lastItemBorders');
            } else {
              expect(classes)
                .not
                .toContain('lastItemBorders');
            }
          });
        });
      });
    });
  });
});
