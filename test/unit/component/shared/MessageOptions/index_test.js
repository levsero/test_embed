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
            expect(TestUtils.isElementOfType(optionItem, 'li')).toEqual(true);
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

        it('does not render middle option items with first/last styles', ()=> {
          const middleItems = response.props.children;

          _.slice(middleItems, 1, response.props.children.length - 2).forEach(optionItem => {
            const classes = optionItem.props.className;

            expect(classes)
              .not
              .toContain('firstItemBorders');

            expect(classes)
              .not
              .toContain('lastItemBorders');
          });
        });

        it('renders last option item with correct styles', () => {
          const lastItem = _.last(response.props.children);
          const lastItemClasses = lastItem.props.className;

          expect(lastItemClasses)
            .toContain('lastItemBorders');
        });
      });

      describe('when a custom option style is not provided', () => {
        beforeEach(() => {
          messageOptionsComponent = instanceRender(<MessageOptions isMessageBubbleLinked={true} optionItems={optionItems} />);
          response = messageOptionsComponent.render();
        });

        it('renders option items correctly', () => {
          response.props.children.forEach((optionItem, index) => {
            expect(TestUtils.isElementOfType(optionItem, 'li')).toEqual(true);
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

        it('does not render middle option items with first/last styles', ()=> {
          const middleItems = response.props.children;

          _.slice(middleItems, 1, response.props.children.length - 2).forEach(optionItem => {
            const classes = optionItem.props.className;

            expect(classes)
              .not
              .toContain('firstItemBorders');

            expect(classes)
              .not
              .toContain('lastItemBorders');
          });
        });

        it('renders last option item with correct styles', () => {
          const lastItem = _.last(response.props.children);
          const lastItemClasses = lastItem.props.className;

          expect(lastItemClasses)
            .toContain('lastItemBorders');
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
            expect(TestUtils.isElementOfType(optionItem, 'li')).toEqual(true);
            expect(optionItem.key).toEqual(index.toString());

            const classes = optionItem.props.className;

            expect(classes)
              .toContain('optionItem');
          });
        });

        it('renders first option with correct styles', () => {
          const firstItem = response.props.children[0];
          const firstItemClasses = firstItem.props.className;

          expect(firstItemClasses)
            .toContain('firstItemBorders');

          expect(firstItemClasses)
            .not
            .toContain('lastItemBorders');
        });

        it('does not render middle option items with first/last styles', ()=> {
          const middleItems = response.props.children;

          _.slice(middleItems, 1, response.props.children.length - 2).forEach(optionItem => {
            const classes = optionItem.props.className;

            expect(classes)
              .not
              .toContain('firstItemBorders');

            expect(classes)
              .not
              .toContain('lastItemBorders');
          });
        });

        it('renders last option item with correct styles', () => {
          const lastItem = _.last(response.props.children);
          const lastItemClasses = lastItem.props.className;

          expect(lastItemClasses)
            .not
            .toContain('firstItemBorders');

          expect(lastItemClasses)
            .toContain('lastItemBorders');
        });
      });

      describe('when a custom option style is provided', () => {
        beforeEach(() => {
          messageOptionsComponent = instanceRender(<MessageOptions isMessageBubbleLinked={false} optionItems={optionItems} optionItemClasses={'yolo'} />);
          response = messageOptionsComponent.render();
        });

        it('renders option items correctly', () => {
          response.props.children.forEach((optionItem, index) => {
            expect(TestUtils.isElementOfType(optionItem, 'li')).toEqual(true);
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

          expect(firstItemClasses)
            .not
            .toContain('lastItemBorders');
        });

        it('does not render middle option items with first/last styles', ()=> {
          const middleItems = response.props.children;

          _.slice(middleItems, 1, response.props.children.length - 2).forEach(optionItem => {
            const classes = optionItem.props.className;

            expect(classes)
              .not
              .toContain('firstItemBorders');

            expect(classes)
              .not
              .toContain('lastItemBorders');
          });
        });

        it('renders last option item with correct styles', () => {
          const lastItem = _.last(response.props.children);
          const lastItemClasses = lastItem.props.className;

          expect(lastItemClasses)
            .not
            .toContain('firstItemBorders');

          expect(lastItemClasses)
            .toContain('lastItemBorders');
        });
      });
    });
  });
});
