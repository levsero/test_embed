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

        it('renders option items correctly', () => {
          response.props.children.forEach((optionItem, index) => {
            expect(TestUtils.isElementOfType(optionItem, 'button')).toEqual(true);
            expect(optionItem.key).toEqual(index.toString());

            const classes = optionItem.props.className;

            expect(classes)
              .toContain('optionItem');

            expect(classes)
              .toContain('yolo');

            expect(classes)
              .not
              .toContain('firstItemBorders');
          });
        });
      });

      describe('when a custom option style is not provided', () => {
        beforeEach(() => {
          messageOptionsComponent = instanceRender(<MessageOptions isMessageBubbleLinked={true} optionItems={optionItems} />);
          response = messageOptionsComponent.render();
        });

        it('renders option items correctly', () => {
          response.props.children.forEach((optionItem, index) => {
            expect(TestUtils.isElementOfType(optionItem, 'button')).toEqual(true);
            expect(optionItem.key).toEqual(index.toString());

            const classes = optionItem.props.className;

            expect(classes)
              .toContain('optionItem');

            expect(classes)
              .not
              .toContain('yolo');

            expect(classes)
              .not
              .toContain('firstItemBorders');
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

        it('renders option items correctly', () => {
          response.props.children.forEach((optionItem, index) => {
            expect(TestUtils.isElementOfType(optionItem, 'button')).toEqual(true);
            expect(optionItem.key).toEqual(index.toString());

            const classes = optionItem.props.className;

            expect(classes)
              .toContain('optionItem');

            expect(classes)
              .not
              .toContain('yolo');
          });
        });

        it('renders first option with correct styles', () => {
          const firstItem = response.props.children[0];
          const firstItemClasses = firstItem.props.className;

          expect(firstItemClasses)
            .toContain('firstItemBorders');
        });

        it('does not render remaining option items with firstItemBorders styles', ()=> {
          const middleItems = response.props.children;

          _.slice(middleItems, 1).forEach(optionItem => {
            const classes = optionItem.props.className;

            expect(classes)
              .not
              .toContain('firstItemBorders');
          });
        });
      });

      describe('when a custom option style is provided', () => {
        beforeEach(() => {
          messageOptionsComponent = instanceRender(<MessageOptions isMessageBubbleLinked={false} optionItems={optionItems} optionItemClasses={'yolo'} />);
          response = messageOptionsComponent.render();
        });

        it('renders option items correctly', () => {
          response.props.children.forEach((optionItem, index) => {
            expect(TestUtils.isElementOfType(optionItem, 'button')).toEqual(true);
            expect(optionItem.key).toEqual(index.toString());

            const classes = optionItem.props.className;

            expect(classes)
              .toContain('optionItem');

            expect(classes)
              .toContain('yolo');
          });
        });

        it('renders first option with correct styles', () => {
          const firstItem = response.props.children[0];
          const firstItemClasses = firstItem.props.className;

          expect(firstItemClasses)
            .toContain('firstItemBorders');
        });

        it('does not render remaining option items with firstItemBorders', ()=> {
          const middleItems = response.props.children;

          _.slice(middleItems, 1).forEach(optionItem => {
            const classes = optionItem.props.className;

            expect(classes)
              .not
              .toContain('firstItemBorders');
          });
        });
      });
    });

    describe('onOptionClick', () => {
      let onOptionClickSpy;

      beforeEach(() => {
        onOptionClickSpy = jasmine.createSpy();

        messageOptionsComponent = instanceRender(
          <MessageOptions optionItems={optionItems} onOptionClick={onOptionClickSpy} />
        );

        response = messageOptionsComponent.render();
      });

      it('sets onClick handler to each item correctly', () => {
        response.props.children.forEach((item, index) => {
          expect(item.props.onClick)
            .toEqual(jasmine.any(Function));

          item.props.onClick();

          expect(onOptionClickSpy)
            .toHaveBeenCalledWith(optionItems[index]);
        });
      });
    });
  });
});
