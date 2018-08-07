describe('NestedDropdown component', () => {
  let NestedDropdown,
    mockOptions = [
      {
        name: 'pizza',
        value: 'pizza'
      },
      {
        name: 'ice cream',
        value: 'ice cream'
      },
      {
        name: 'fruits::apple',
        value: 'fruits__apple',
        default: true
      },
      {
        name: 'fruits::banana',
        value: 'fruits__banana'
      },
      {
        name: 'vegetable::carrot',
        value: 'vegetable__carrot'
      },
      {
        name: 'vegetable',
        value: 'vegetable'
      }
    ];

  const SelectField = noopReactComponent();
  const Item = noopReactComponent();
  const NextItem = noopReactComponent();
  const PreviousItem = noopReactComponent();
  const Separator = noopReactComponent();
  const Message = noopReactComponent();
  const nestedDropdownPath = buildSrcPath('component/field/NestedDropdown');

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      './NestedDropdown.scss': {
        locals: {}
      },
      '@zendeskgarden/react-select': {
        SelectField,
        Label: noopReactComponent(),
        Item,
        Select: noopReactComponent(),
        Hint: noopReactComponent(),
        Separator,
        NextItem,
        PreviousItem,
        Message
      },
      'service/i18n': {
        i18n: {
          t: noop
        }
      }
    });

    mockery.registerAllowable(nestedDropdownPath);
    NestedDropdown = requireUncached(nestedDropdownPath).NestedDropdown;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('initial state', () => {
    let component;

    describe('when no defaultOption is passed in', () => {
      beforeEach(() => {
        component = instanceRender(
          <NestedDropdown options={mockOptions} />
        );
      });

      it('selectedKey is undefined', () => {
        expect(component.state.selectedKey)
          .toEqual(undefined);
      });

      it('displayedKey is an empty string', () => {
        expect(component.state.displayedKey)
          .toEqual('');
      });
    });

    describe('when a defaultOption is passed in', () => {
      beforeEach(() => {
        component = instanceRender(
          <NestedDropdown options={mockOptions} defaultOption={{ name: 'pizza', value: 'pizza' }} />
        );
      });

      it('selectedKey is set to the value of the defaultOption', () => {
        expect(component.state.selectedKey)
          .toEqual('pizza');
      });

      it('displayedKey is set to the value of the defaultOption', () => {
        expect(component.state.displayedKey)
          .toEqual('pizza');
      });
    });
  });

  describe('instance variables', () => {
    let component,
      options,
      items,
      topLevelMenu;

    beforeEach(() => {
      component = instanceRender(
        <NestedDropdown options={mockOptions} />
      );
      options = component.options;
      items = component.items;
      topLevelMenu = component.topLevelMenu;
    });

    describe('options', () => {
      it('equals the options grouped by their name value', () => {
        expect(options)
          .toEqual({
            'pizza': { name: 'pizza', value: 'pizza' },
            'ice cream': { name: 'ice cream', value: 'ice cream' },
            'fruits': { name: 'fruits', value: 'fruits-nested' },
            'fruits::apple': { name: 'fruits::apple', value: 'fruits__apple', default: true },
            'fruits::banana': { name: 'fruits::banana', value: 'fruits__banana' },
            'vegetable::carrot': { name: 'vegetable::carrot', value: 'vegetable__carrot' },
            'vegetable': { name: 'vegetable', value: 'vegetable' }
          });
      });
    });

    describe('items', () => {
      it('equals the options converted to the correct item type', () => {
        _.forEach(items, (option, key) => {
          const nextItemKeys = key === 'vegetable' || key === 'fruits';

          expect(TestUtils.isElementOfType(option, nextItemKeys ? NextItem : Item))
            .toEqual(true);
        });
      });
    });

    describe('topLevelMenu', () => {
      it('equals just the items in the initial menu screen', () => {
        expect(topLevelMenu.length)
          .toEqual(4);
      });
    });
  });

  describe('handleChange', () => {
    let component,
      selectedKey;
    const onChangeSpy = jasmine.createSpy('onChange');

    beforeEach(() => {
      jasmine.clock().install();
      component = instanceRender(
        <NestedDropdown options={mockOptions} onChange={onChangeSpy} />
      );
      component.setState({ displayedKey: 'initial' });
      component.handleChange(selectedKey);
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    it('calls props.onChange', () => {
      jasmine.clock().tick();

      expect(onChangeSpy)
        .toHaveBeenCalled();
    });

    describe('when a key with -prev is passed in', () => {
      beforeAll(() => {
        selectedKey = 'apple-prev';
      });

      it('strips off the -prev and saves it as the selectedKey state', () => {
        expect(component.state.selectedKey)
          .toEqual('apple');
      });

      it('does not change the state of the displayedKey', () => {
        expect(component.state.displayedKey)
          .toEqual('initial');
      });
    });

    describe('when a key with -next is passed in', () => {
      beforeAll(() => {
        selectedKey = 'fruit-next';
      });

      it('strips off the -next and saves it as the selectedKey state', () => {
        expect(component.state.selectedKey)
          .toEqual('fruit');
      });

      it('does not change the state of the displayedKey', () => {
        expect(component.state.displayedKey)
          .toEqual('initial');
      });
    });

    describe('when another key is passed in', () => {
      beforeAll(() => {
        selectedKey = 'pizza';
      });

      it('saves it as the selectedKey state', () => {
        expect(component.state.selectedKey)
          .toEqual('pizza');
      });

      it('saves it as the displayedKey state', () => {
        expect(component.state.displayedKey)
          .toEqual('pizza');
      });
    });
  });

  describe('renderMenuItems', () => {
    let component,
      selectedKey,
      menuItems;

    beforeEach(() => {
      component = domRender(
        <NestedDropdown options={mockOptions} />
      );
      menuItems = component.renderMenuItems(selectedKey);
    });

    describe('when selectedKey is undefined', () => {
      beforeAll(() => {
        selectedKey = undefined;
      });

      it('returns the top level items', () => {
        expect(menuItems)
          .toEqual(component.topLevelMenu);
      });
    });

    describe('when selectedKey is an NextItem with nested items', () => {
      beforeAll(() => {
        selectedKey = 'vegetable';
      });

      it('returns the menu containing the nested items', () => {
        expect(menuItems.length)
          .toEqual(3);
      });

      it('has a PreviousItem as the first element', () => {
        expect(TestUtils.isElementOfType(menuItems[0], PreviousItem))
          .toEqual(true);
      });

      it('has a Seperator as the second element', () => {
        expect(TestUtils.isElementOfType(menuItems[1], Separator))
          .toEqual(true);
      });

      it('has a Item as the third element', () => {
        expect(TestUtils.isElementOfType(menuItems[2], Item))
          .toEqual(true);
      });
    });

    describe('when selectedKey is an Item within a nested menu', () => {
      beforeAll(() => {
        selectedKey = 'vegetable__carrot';
      });

      it('returns the currently nested menu', () => {
        expect(menuItems.length)
          .toEqual(3);

        expect(TestUtils.isElementOfType(menuItems[0], PreviousItem))
          .toEqual(true);
      });
    });
  });

  describe('render', () => {
    let component;

    beforeEach(() => {
      component = domRender(
        <NestedDropdown options={mockOptions} />
      );
    });

    describe('when no value is selected', () => {
      let displayedValue;

      beforeEach(() => {
        displayedValue = component.render().props.children[0].props.children[2].props.children;
      });

      it('displays the default value of -', () => {
        expect(displayedValue)
          .toEqual('-');
      });
    });

    describe('when a value is selected', () => {
      let displayedValue;

      beforeEach(() => {
        component.setState({ displayedKey: 'pizza' });
        displayedValue = component.render().props.children[0].props.children[2].props.children;
      });

      it('displays the name of the value', () => {
        expect(displayedValue)
          .toEqual('pizza');
      });
    });

    describe('when a nested value is selected', () => {
      let displayedValue;

      beforeEach(() => {
        component.setState({ displayedKey: 'fruits__apple' });
        displayedValue = component.render().props.children[0].props.children[2].props.children;
      });

      it('displays the last section of the name of the value', () => {
        expect(displayedValue)
          .toEqual('apple');
      });
    });

    describe('when showError is true', () => {
      let errorComponent;

      beforeEach(() => {
        component = domRender(
          <NestedDropdown options={mockOptions} showError={true} />
        );
        errorComponent = component.render().props.children[0].props.children[3];
      });

      it('renders a Message component', () => {
        expect(TestUtils.isElementOfType(errorComponent, Message))
          .toEqual(true);
      });
    });

    describe('when showError is false', () => {
      let errorComponent;

      beforeEach(() => {
        component = domRender(
          <NestedDropdown options={mockOptions} showError={false} />
        );
        errorComponent = component.render().props.children[0].props.children[3];
      });

      it('does not render a Message component', () => {
        expect(TestUtils.isElementOfType(errorComponent, Message))
          .toEqual(false);
      });
    });
  });
});
